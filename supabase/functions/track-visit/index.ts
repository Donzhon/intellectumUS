// Public Edge Function: records an anonymous page view from the website.
// Geo lookup uses the client IP (not stored) to resolve country/city only.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PATH = 200;
const MAX_REFERRER = 500;

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

interface TrackPayload {
  path?: string;
  referrer?: string;
  visitor_id?: string;
}

function cleanText(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLen);
}

function isValidPath(path: string): boolean {
  if (!path.startsWith("/") || path.length > MAX_PATH) return false;
  if (path.toLowerCase().startsWith("/adminintus")) return false;
  return true;
}

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || null;
}

function isPrivateIp(ip: string): boolean {
  if (ip.includes(":")) {
    const lower = ip.toLowerCase();
    return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") ||
      lower.startsWith("fe80");
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

async function lookupGeo(ip: string): Promise<{ country: string | null; city: string | null }> {
  if (isPrivateIp(ip)) {
    return { country: null, city: null };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const url =
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return { country: null, city: null };

    const data = await res.json() as {
      status?: string;
      country?: string;
      city?: string;
    };

    if (data.status !== "success") {
      return { country: null, city: null };
    }

    return {
      country: cleanText(data.country, 100),
      city: cleanText(data.city, 100),
    };
  } catch {
    return { country: null, city: null };
  } finally {
    clearTimeout(timeout);
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }

  if (request.method !== "POST") {
    return jsonResponse(request, { ok: false, error: "Method not allowed" }, 405);
  }

  let payload: TrackPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(request, { ok: false, error: "Invalid JSON" }, 400);
  }

  const path = cleanText(payload.path, MAX_PATH);
  const visitorId = cleanText(payload.visitor_id, 36);

  if (!path || !isValidPath(path)) {
    return jsonResponse(request, { ok: false, error: "Invalid path" }, 422);
  }

  if (!visitorId || !UUID_RE.test(visitorId)) {
    return jsonResponse(request, { ok: false, error: "Invalid visitor_id" }, 422);
  }

  const referrer = cleanText(payload.referrer, MAX_REFERRER);
  const userAgent = request.headers.get("User-Agent")?.slice(0, 500) ?? null;

  const ip = clientIp(request);
  const geo = ip ? await lookupGeo(ip) : { country: null, city: null };

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { error } = await supabase.from("page_views").insert({
    path,
    referrer,
    visitor_id: visitorId,
    user_agent: userAgent,
    country: geo.country,
    city: geo.city,
  });

  if (error) {
    console.error("Insert error:", error);
    return jsonResponse(request, { ok: false, error: "Storage error" }, 500);
  }

  return jsonResponse(request, { ok: true });
});
