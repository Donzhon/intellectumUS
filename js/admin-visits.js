(function () {
  "use strict";

  const ADMIN_URL = window.SiteConfig?.ADMIN_URL;
  const STORAGE_KEY = "intellectum-admin-pw";

  const PALETTE = {
    accent: "#4f8cff",
    muted: "#9aa3b2",
    grid: "rgba(154, 163, 178, 0.15)",
    bars: ["#4f8cff", "#3ecf8e", "#f5b54a", "#b98bff", "#ff7ab2", "#22d3ee"],
  };

  const KNOWN_PATHS = [
    "/",
    "/intellectum",
    "/neyri",
    "/nodi",
    "/labo",
    "/pasco",
    "/telos",
    "/about",
    "/partners",
    "/privacy",
    "/terms",
  ];

  const el = {
    login: document.getElementById("admin-login"),
    loginForm: document.getElementById("admin-login-form"),
    password: document.getElementById("admin-password"),
    loginError: document.getElementById("admin-login-error"),
    panel: document.getElementById("admin-panel"),
    logout: document.getElementById("admin-logout"),
    updated: document.getElementById("admin-updated"),
    period: document.getElementById("admin-period"),
    kpis: document.getElementById("admin-kpis"),
    filters: document.getElementById("admin-filters"),
    search: document.getElementById("filter-search"),
    path: document.getElementById("filter-path"),
    from: document.getElementById("filter-from"),
    to: document.getElementById("filter-to"),
    reset: document.getElementById("filter-reset"),
    meta: document.getElementById("admin-meta"),
    rows: document.getElementById("admin-rows"),
    empty: document.getElementById("admin-empty"),
    pagePrev: document.getElementById("page-prev"),
    pageNext: document.getElementById("page-next"),
    pageInfo: document.getElementById("page-info"),
  };

  let currentPage = 0;
  let totalRows = 0;
  let viewTotal = 0;
  let pageSize = 50;
  let periodDays = 30;
  let listCapped = false;
  const expandedSessions = new Set();
  const charts = {};

  function getPassword() {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  }

  async function callAdmin(body) {
    if (!ADMIN_URL) {
      throw new Error("ADMIN_URL не настроен (js/config.js).");
    }
    const response = await fetch(ADMIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: getPassword(), ...body }),
    });
    if (response.status === 401) {
      const err = new Error("Unauthorized");
      err.code = 401;
      throw err;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || `Ошибка запроса (${response.status})`);
    }
    return data;
  }

  function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function parseBrowser(ua) {
    if (!ua) return "—";
    if (/Edg\//.test(ua)) return "Edge";
    if (/Firefox\//.test(ua)) return "Firefox";
    if (/Chrome\//.test(ua)) return "Chrome";
    if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
    return ua.length > 48 ? `${ua.slice(0, 45)}…` : ua;
  }

  function formatReferrer(value) {
    if (!value) return "прямой";
    try {
      const url = new URL(value);
      return url.hostname || value;
    } catch {
      return value.length > 48 ? `${value.slice(0, 45)}…` : value;
    }
  }

  function formatLocation(country, city) {
    if (country && city) return `${country}, ${city}`;
    return country || city || "—";
  }

  function sessionLabel(id) {
    if (!id) return "—";
    return String(id).slice(0, 8);
  }

  function buildFilters(extra) {
    const filters = {};
    if (el.search.value.trim()) filters.search = el.search.value.trim();
    if (el.path.value) filters.path = el.path.value;
    if (el.from.value) {
      filters.from = new Date(el.from.value).toISOString();
    } else if (periodDays > 0) {
      const from = new Date();
      from.setDate(from.getDate() - periodDays);
      from.setHours(0, 0, 0, 0);
      filters.from = from.toISOString();
    }
    if (el.to.value) {
      const to = new Date(el.to.value);
      to.setHours(23, 59, 59, 999);
      filters.to = to.toISOString();
    }
    return Object.assign(filters, extra || {});
  }

  function formatSessionPeriod(startedAt, endedAt) {
    const start = formatDate(startedAt);
    if (!endedAt || endedAt === startedAt) return start;
    const end = formatDate(endedAt);
    if (start.slice(0, 10) === end.slice(0, 10)) {
      const endTime = new Date(endedAt).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${start} — ${endTime}`;
    }
    return `${start} — ${end}`;
  }

  function formatPathsSummary(paths) {
    if (!paths || paths.length === 0) return "—";
    if (paths.length <= 3) return paths.join(", ");
    return `${paths.slice(0, 3).join(", ")} +${paths.length - 3}`;
  }

  function renderViewDetail(view) {
    return [
      "<tr>",
      `<td>${escapeHtml(formatDate(view.created_at))}</td>`,
      `<td><code>${escapeHtml(view.path)}</code></td>`,
      `<td title="${escapeHtml(view.referrer || "")}">${escapeHtml(formatReferrer(view.referrer))}</td>`,
      "</tr>",
    ].join("");
  }

  function renderSessions(sessions) {
    el.rows.innerHTML = "";
    el.empty.hidden = sessions.length > 0;

    sessions.forEach((session) => {
      const sessionId = String(session.visitor_id);
      const isExpanded = expandedSessions.has(sessionId);
      const canExpand = (session.views || []).length > 0;

      const head = document.createElement("tr");
      head.className = "admin__session";
      head.dataset.sessionId = sessionId;
      if (isExpanded) head.classList.add("is-expanded");
      if (canExpand) head.classList.add("is-expandable");

      head.innerHTML = [
        `<td class="admin__col-toggle" aria-hidden="true">${
          canExpand
            ? `<span class="session-toggle" aria-hidden="true">${isExpanded ? "▼" : "▶"}</span>`
            : ""
        }</td>`,
        `<td><div class="session-main"><code>${escapeHtml(sessionLabel(session.visitor_id))}</code><span class="session-period">${escapeHtml(
          formatSessionPeriod(session.started_at, session.ended_at),
        )}</span></div></td>`,
        `<td>${escapeHtml(String(session.view_count ?? 0))}</td>`,
        `<td title="${escapeHtml((session.paths || []).join(", "))}">${escapeHtml(
          formatPathsSummary(session.paths),
        )}</td>`,
        `<td title="${escapeHtml(session.referrer || "")}">${escapeHtml(formatReferrer(session.referrer))}</td>`,
        `<td>${escapeHtml(formatLocation(session.country, session.city))}</td>`,
        `<td title="${escapeHtml(session.user_agent || "")}">${escapeHtml(parseBrowser(session.user_agent))}</td>`,
      ].join("");

      el.rows.appendChild(head);

      if (!canExpand) return;

      const details = document.createElement("tr");
      details.className = "admin__session-details";
      details.dataset.sessionId = sessionId;
      details.hidden = !isExpanded;
      details.innerHTML = [
        '<td colspan="7">',
        '<div class="session-details">',
        '<table class="admin__subtable">',
        "<thead><tr><th>Время</th><th>Страница</th><th>Referrer</th></tr></thead>",
        `<tbody>${(session.views || []).map(renderViewDetail).join("")}</tbody>`,
        "</table>",
        "</div>",
        "</td>",
      ].join("");

      el.rows.appendChild(details);

      head.addEventListener("click", () => {
        if (expandedSessions.has(sessionId)) {
          expandedSessions.delete(sessionId);
        } else {
          expandedSessions.add(sessionId);
        }
        renderSessions(sessions);
      });
    });
  }

  function updatePager() {
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    el.pageInfo.textContent = `${currentPage + 1} / ${totalPages}`;
    el.pagePrev.disabled = currentPage <= 0;
    el.pageNext.disabled = currentPage >= totalPages - 1;
    let meta = `Найдено сессий: ${totalRows}`;
    if (viewTotal) meta += ` (${viewTotal} просмотров)`;
    if (listCapped) meta += " · показаны последние 10000 просмотров";
    el.meta.textContent = meta;
  }

  async function loadRows() {
    try {
      const data = await callAdmin({
        action: "visitsSessions",
        filters: buildFilters({ page: currentPage }),
      });
      totalRows = data.total || 0;
      viewTotal = data.viewTotal || 0;
      pageSize = data.pageSize || pageSize;
      currentPage = data.page || 0;
      listCapped = Boolean(data.capped);
      renderSessions(data.sessions || []);
      updatePager();
    } catch (error) {
      if (error.code === 401) return handleUnauthorized();
      el.meta.textContent = error.message;
    }
  }

  function setKpis(stats) {
    const map = {
      viewsToday: stats.kpi?.viewsToday ?? 0,
      viewsWeek: stats.kpi?.viewsWeek ?? 0,
      viewsMonth: stats.kpi?.viewsMonth ?? 0,
      viewsTotal: stats.kpi?.viewsTotal ?? 0,
      sessionsToday: stats.kpi?.sessionsToday ?? 0,
      sessionsWeek: stats.kpi?.sessionsWeek ?? 0,
      sessionsMonth: stats.kpi?.sessionsMonth ?? 0,
      sessionsTotal: stats.kpi?.sessionsTotal ?? 0,
    };
    Object.entries(map).forEach(([field, value]) => {
      const node = el.kpis.querySelector(`[data-field="${field}"]`);
      if (node) node.textContent = value;
    });
  }

  function buildDailySeries(daily) {
    const keys = Object.keys(daily || {});
    let start;
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    if (periodDays > 0) {
      start = new Date(end);
      start.setDate(start.getDate() - periodDays + 1);
    } else if (keys.length) {
      start = new Date(keys.sort()[0]);
    } else {
      start = new Date(end);
    }
    const labels = [];
    const values = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      labels.push(
        d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
      );
      values.push(daily[key] || 0);
    }
    return { labels, values };
  }

  function baseOptions(extra) {
    return Object.assign(
      {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: PALETTE.muted, boxWidth: 12 } },
        },
      },
      extra || {},
    );
  }

  function axisOptions() {
    return {
      x: { ticks: { color: PALETTE.muted }, grid: { color: PALETTE.grid } },
      y: {
        beginAtZero: true,
        ticks: { color: PALETTE.muted, precision: 0 },
        grid: { color: PALETTE.grid },
      },
    };
  }

  function upsertChart(key, config) {
    if (!window.Chart) return;
    if (charts[key]) {
      charts[key].data = config.data;
      charts[key].options = config.options;
      charts[key].update();
      charts[key].resize();
      return;
    }
    const canvas = document.getElementById(key);
    if (canvas) {
      charts[key] = new window.Chart(canvas, config);
    }
  }

  function resizeCharts() {
    Object.values(charts).forEach((chart) => chart.resize());
  }

  function renderCharts(stats) {
    const daily = buildDailySeries(stats.daily);
    upsertChart("chart-daily", {
      type: "line",
      data: {
        labels: daily.labels,
        datasets: [
          {
            label: "Просмотры",
            data: daily.values,
            borderColor: PALETTE.accent,
            backgroundColor: "rgba(79, 140, 255, 0.18)",
            fill: true,
            tension: 0.3,
            pointRadius: 2,
          },
        ],
      },
      options: baseOptions({
        plugins: { legend: { display: false } },
        scales: axisOptions(),
      }),
    });

    const topPages = stats.topPages || [];
    upsertChart("chart-pages", {
      type: "bar",
      data: {
        labels: topPages.map((p) => p.name),
        datasets: [
          {
            label: "Просмотры",
            data: topPages.map((p) => p.count),
            backgroundColor: PALETTE.bars,
            borderRadius: 6,
          },
        ],
      },
      options: baseOptions({
        plugins: { legend: { display: false } },
        scales: axisOptions(),
      }),
    });
  }

  async function loadStats() {
    try {
      const stats = await callAdmin({ action: "visitsStats", filters: buildFilters() });
      setKpis(stats);
      renderCharts(stats);
      requestAnimationFrame(resizeCharts);
      el.updated.textContent = `Обновлено: ${new Date().toLocaleTimeString("ru-RU")}${
        stats.capped ? " · показаны последние 10000" : ""
      }`;
    } catch (error) {
      if (error.code === 401) return handleUnauthorized();
      const message = `Статистика недоступна: ${error.message}`;
      el.updated.textContent = message;
      if (!el.meta.textContent?.startsWith("Найдено сессий:")) {
        el.meta.textContent = message;
      }
    }
  }

  function refreshAll() {
    loadStats();
    loadRows();
  }

  function showPanel() {
    el.login.hidden = true;
    el.panel.hidden = false;
    requestAnimationFrame(resizeCharts);
  }

  function showLogin() {
    el.panel.hidden = true;
    el.login.hidden = false;
  }

  function handleUnauthorized() {
    sessionStorage.removeItem(STORAGE_KEY);
    showLogin();
    el.loginError.textContent = "Сессия истекла или пароль неверен. Войдите снова.";
    el.loginError.hidden = false;
  }

  function populatePathFilter() {
    KNOWN_PATHS.forEach((path) => {
      const option = document.createElement("option");
      option.value = path;
      option.textContent = path === "/" ? "/" : path;
      el.path.appendChild(option);
    });
  }

  el.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    el.loginError.hidden = true;
    sessionStorage.setItem(STORAGE_KEY, el.password.value);
    try {
      await callAdmin({ action: "visitsSessions", filters: { page: 0 } });
      el.password.value = "";
      showPanel();
      refreshAll();
    } catch (error) {
      sessionStorage.removeItem(STORAGE_KEY);
      el.loginError.textContent =
        error.code === 401 ? "Неверный пароль." : error.message;
      el.loginError.hidden = false;
    }
  });

  el.logout.addEventListener("click", () => {
    sessionStorage.removeItem(STORAGE_KEY);
    showLogin();
  });

  document.querySelectorAll(".js-admin-refresh").forEach((btn) => {
    btn.addEventListener("click", refreshAll);
  });

  el.period.addEventListener("click", (event) => {
    const chip = event.target.closest(".admin__chip");
    if (!chip) return;
    periodDays = Number(chip.dataset.days) || 0;
    el.period.querySelectorAll(".admin__chip").forEach((node) => {
      node.classList.toggle("is-active", node === chip);
    });
    currentPage = 0;
    expandedSessions.clear();
    refreshAll();
  });

  el.filters.addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 0;
    expandedSessions.clear();
    refreshAll();
  });

  el.reset.addEventListener("click", () => {
    el.search.value = "";
    el.path.value = "";
    el.from.value = "";
    el.to.value = "";
    currentPage = 0;
    expandedSessions.clear();
    refreshAll();
  });

  el.pagePrev.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage -= 1;
      expandedSessions.clear();
      loadRows();
    }
  });

  el.pageNext.addEventListener("click", () => {
    currentPage += 1;
    expandedSessions.clear();
    loadRows();
  });

  populatePathFilter();

  if (getPassword()) {
    showPanel();
    refreshAll();
  } else {
    showLogin();
  }
})();
