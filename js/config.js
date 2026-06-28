// Public runtime config for the website.
// Replace YOUR-PROJECT-ref with your Supabase project reference id.
// These URLs are the public Edge Function endpoints; no secret keys here.
window.SiteConfig = {
  SUBMIT_LEAD_URL: "https://YOUR-PROJECT-ref.supabase.co/functions/v1/submit-lead",
  ADMIN_URL: "https://YOUR-PROJECT-ref.supabase.co/functions/v1/admin",
};
