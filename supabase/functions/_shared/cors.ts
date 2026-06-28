// Shared CORS helpers for the public-facing Edge Functions.
// ALLOWED_ORIGINS can be set as a comma-separated env var to restrict
// which sites may call the functions. Defaults to "*".

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

export function resolveOrigin(request: Request): string {
  const origin = request.headers.get("Origin") ?? "";

  if (allowedOrigins.includes("*") || allowedOrigins.length === 0) {
    return "*";
  }

  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

export function corsHeaders(request: Request): HeadersInit {
  return {
    "Access-Control-Allow-Origin": resolveOrigin(request),
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function jsonResponse(
  request: Request,
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json",
    },
  });
}
