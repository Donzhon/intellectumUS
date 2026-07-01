(function () {
  "use strict";

  const TRACK_URL = window.SiteConfig?.TRACK_VISIT_URL;
  const STORAGE_KEY = "intellectum-visit-sid";

  if (!TRACK_URL) return;

  const path = window.location.pathname || "/";
  if (path.toLowerCase().startsWith("/adminintus")) return;

  function getVisitorId() {
    let id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  function sendVisit() {
    const referrer = (document.referrer || "").trim().slice(0, 500);
    const payload = {
      path,
      referrer: referrer || null,
      visitor_id: getVisitorId(),
    };

    fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      mode: "cors",
    }).catch(function () {});
  }

  sendVisit();
})();
