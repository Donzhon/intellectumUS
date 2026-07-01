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
    const payload = {
      path,
      referrer: (document.referrer || "").slice(0, 500) || null,
      visitor_id: getVisitorId(),
    };
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(TRACK_URL, blob)) return;
    }

    fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(function () {});
  }

  if (document.readyState === "complete") {
    sendVisit();
  } else {
    window.addEventListener("load", sendVisit, { once: true });
  }
})();
