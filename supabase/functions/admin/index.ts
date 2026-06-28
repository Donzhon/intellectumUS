// Password-protected Edge Function for the admin panel.
// The browser sends a shared password; it is compared (constant-time)
// against ADMIN_PASSWORD. The password never grants direct DB access —
// this function uses the service role and returns only what it chooses.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

function resolveOrigin(request: Request): string {
  const origin = request.headers.get("Origin") ?? "";
  if (allowedOrigins.includes("*") || allowedOrigins.length === 0) return "*";
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

function corsHeaders(request: Request): HeadersInit {
  return {
    "Access-Control-Allow-Origin": resolveOrigin(request),
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function jsonResponse(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

const VALID_STATUSES = ["new", "in_progress", "done", "spam"];
const PAGE_SIZE = 50;
const STATS_LIMIT = 10000;

interface AdminPayload {
  password?: string;
  action?: string;
  filters?: {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
    page?: number;
  };
  id?: string;
  status?: string;
}

// Constant-time string comparison to avoid timing attacks.
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }

  if (request.method !== "POST") {
    return jsonResponse(request, { ok: false, error: "Method not allowed" }, 405);
  }

  let payload: AdminPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(request, { ok: false, error: "Invalid JSON" }, 400);
  }

  const expected = (Deno.env.get("ADMIN_PASSWORD") ?? "").trim();
  const gotPw = (payload.password ?? "").trim();
  if (!expected || !gotPw || !timingSafeEqual(gotPw, expected)) {
    return jsonResponse(request, { ok: false, error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const action = payload.action ?? "list";

  // Applies the shared list/stats filters (status/search/date range) to a query.
  // deno-lint-ignore no-explicit-any
  function applyFilters(query: any, filters: NonNullable<AdminPayload["filters"]>) {
    if (filters.status && VALID_STATUSES.includes(filters.status)) {
      query = query.eq("status", filters.status);
    }
    if (filters.search) {
      const term = `%${filters.search.replace(/[%_]/g, "")}%`;
      query = query.or(`email.ilike.${term},comment.ilike.${term},location.ilike.${term}`);
    }
    if (filters.from) {
      query = query.gte("created_at", filters.from);
    }
    if (filters.to) {
      query = query.lte("created_at", filters.to);
    }
    return query;
  }

  if (action === "list") {
    const filters = payload.filters ?? {};
    const page = Math.max(0, Number(filters.page) || 0);
    const fromIdx = page * PAGE_SIZE;
    const toIdx = fromIdx + PAGE_SIZE - 1;

    let query = supabase
      .from("lead_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(fromIdx, toIdx);

    query = applyFilters(query, filters);

    const { data, count, error } = await query;
    if (error) {
      console.error("List error:", error);
      return jsonResponse(request, { ok: false, error: "Query error" }, 500);
    }

    return jsonResponse(request, {
      ok: true,
      rows: data,
      total: count ?? 0,
      page,
      pageSize: PAGE_SIZE,
    });
  }

  if (action === "updateStatus") {
    if (!payload.id || !payload.status || !VALID_STATUSES.includes(payload.status)) {
      return jsonResponse(request, { ok: false, error: "Invalid arguments" }, 422);
    }

    const { error } = await supabase
      .from("lead_requests")
      .update({ status: payload.status })
      .eq("id", payload.id);

    if (error) {
      console.error("Update error:", error);
      return jsonResponse(request, { ok: false, error: "Update error" }, 500);
    }

    return jsonResponse(request, { ok: true });
  }

  if (action === "delete") {
    if (!payload.id) {
      return jsonResponse(request, { ok: false, error: "Invalid arguments" }, 422);
    }

    const { error } = await supabase
      .from("lead_requests")
      .delete()
      .eq("id", payload.id);

    if (error) {
      console.error("Delete error:", error);
      return jsonResponse(request, { ok: false, error: "Delete error" }, 500);
    }

    return jsonResponse(request, { ok: true });
  }

  if (action === "stats") {
    const filters = payload.filters ?? {};

    let query = supabase
      .from("lead_requests")
      .select("created_at, status, product, reason, location")
      .order("created_at", { ascending: false })
      .limit(STATS_LIMIT);

    query = applyFilters(query, filters);

    const { data, error } = await query;
    if (error) {
      console.error("Stats error:", error);
      return jsonResponse(request, { ok: false, error: "Query error" }, 500);
    }

    const rows = (data ?? []) as Array<{
      created_at: string;
      status: string | null;
      product: string | null;
      reason: string | null;
      location: string | null;
    }>;

    const byStatus: Record<string, number> = {
      new: 0,
      in_progress: 0,
      done: 0,
      spam: 0,
    };
    const byProduct: Record<string, number> = {};
    const byReason: Record<string, number> = {};
    const byLocation: Record<string, number> = {};
    const daily: Record<string, number> = {};

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTs = startOfToday.getTime();
    const weekTs = now - 7 * dayMs;
    const monthTs = now - 30 * dayMs;

    let today = 0;
    let week = 0;
    let month = 0;

    for (const row of rows) {
      const status = row.status ?? "new";
      byStatus[status] = (byStatus[status] ?? 0) + 1;

      const product = row.product ?? "unknown";
      byProduct[product] = (byProduct[product] ?? 0) + 1;

      if (row.reason) byReason[row.reason] = (byReason[row.reason] ?? 0) + 1;
      if (row.location) byLocation[row.location] = (byLocation[row.location] ?? 0) + 1;

      const ts = new Date(row.created_at).getTime();
      if (!Number.isNaN(ts)) {
        if (ts >= todayTs) today += 1;
        if (ts >= weekTs) week += 1;
        if (ts >= monthTs) month += 1;
        const dayKey = new Date(row.created_at).toISOString().slice(0, 10);
        daily[dayKey] = (daily[dayKey] ?? 0) + 1;
      }
    }

    const topLocations = Object.entries(byLocation)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    const total = rows.length;
    const doneShare = total > 0 ? Math.round((byStatus.done / total) * 100) : 0;

    return jsonResponse(request, {
      ok: true,
      total,
      capped: total >= STATS_LIMIT,
      byStatus,
      byProduct,
      byReason,
      topLocations,
      daily,
      kpi: { today, week, month, doneShare },
    });
  }

  return jsonResponse(request, { ok: false, error: "Unknown action" }, 400);
});
