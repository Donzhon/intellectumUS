// Public Edge Function: receives a lead request from the website form,
// stores it in the `lead_requests` table, then forwards it to Telegram
// and Email (Resend). Notification failures are logged but never block
// the response, because the lead is already saved.

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 4000;

interface LeadPayload {
  email?: string;
  location?: string;
  comment?: string;
  reason?: string;
  product?: string;
  source_url?: string;
  // Honeypot: must stay empty for real users.
  company?: string;
}

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_LEN);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function notifyTelegram(text: string): Promise<void> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    console.error("Telegram error:", res.status, await res.text());
  }
}

async function notifyEmail(subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("NOTIFY_EMAIL_TO");
  const from = Deno.env.get("NOTIFY_EMAIL_FROM");
  if (!apiKey || !to || !from) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((value) => value.trim()).filter(Boolean),
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error:", res.status, await res.text());
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(request) });
  }

  if (request.method !== "POST") {
    return jsonResponse(request, { ok: false, error: "Method not allowed" }, 405);
  }

  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(request, { ok: false, error: "Invalid JSON" }, 400);
  }

  // Honeypot: silently accept bot submissions without storing them.
  if (clean(payload.company)) {
    return jsonResponse(request, { ok: true });
  }

  const email = clean(payload.email);
  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse(request, { ok: false, error: "Invalid email" }, 422);
  }

  const record = {
    email,
    location: clean(payload.location),
    comment: clean(payload.comment),
    reason: clean(payload.reason),
    product: clean(payload.product),
    source_url: clean(payload.source_url),
    user_agent: request.headers.get("User-Agent")?.slice(0, MAX_LEN) ?? null,
  };

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data, error } = await supabase
    .from("lead_requests")
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return jsonResponse(request, { ok: false, error: "Storage error" }, 500);
  }

  const lines = [
    "<b>Новая заявка с сайта</b>",
    `Email: ${escapeHtml(record.email)}`,
    record.product ? `Продукт: ${escapeHtml(record.product)}` : null,
    record.reason ? `Причина: ${escapeHtml(record.reason)}` : null,
    record.location ? `Локация: ${escapeHtml(record.location)}` : null,
    record.comment ? `Комментарий: ${escapeHtml(record.comment)}` : null,
    record.source_url ? `Страница: ${escapeHtml(record.source_url)}` : null,
  ].filter(Boolean) as string[];

  const telegramText = lines.join("\n");
  const emailHtml = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${
    lines.join("<br>")
  }</div>`;

  // Fire notifications in parallel; never fail the request on their account.
  await Promise.allSettled([
    notifyTelegram(telegramText),
    notifyEmail("Новая заявка с сайта IntellectumUS", emailHtml),
  ]);

  return jsonResponse(request, { ok: true, id: data.id });
});
