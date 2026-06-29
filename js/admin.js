(function () {
  "use strict";

  const ADMIN_URL = window.SiteConfig?.ADMIN_URL;
  const STORAGE_KEY = "intellectum-admin-pw";

  const STATUS_LABELS = {
    new: "Новая",
    in_progress: "В работе",
    done: "Завершена",
    spam: "Спам",
  };

  const PRODUCT_LABELS = {
    nodi: "Nodi",
    intellectum: "Intellectum",
    unknown: "Без продукта",
  };

  const PALETTE = {
    accent: "#4f8cff",
    new: "#4f8cff",
    in_progress: "#f5b54a",
    done: "#3ecf8e",
    spam: "#ff5c5c",
    muted: "#9aa3b2",
    grid: "rgba(154, 163, 178, 0.15)",
    bars: ["#4f8cff", "#3ecf8e", "#f5b54a", "#b98bff", "#ff7ab2", "#5ad1e6", "#ff9f5c", "#9aa3b2"],
  };

  const el = {
    login: document.getElementById("admin-login"),
    loginForm: document.getElementById("admin-login-form"),
    password: document.getElementById("admin-password"),
    loginError: document.getElementById("admin-login-error"),
    panel: document.getElementById("admin-panel"),
    logout: document.getElementById("admin-logout"),
    refresh: document.getElementById("admin-refresh"),
    updated: document.getElementById("admin-updated"),
    period: document.getElementById("admin-period"),
    kpis: document.getElementById("admin-kpis"),
    filters: document.getElementById("admin-filters"),
    search: document.getElementById("filter-search"),
    status: document.getElementById("filter-status"),
    from: document.getElementById("filter-from"),
    to: document.getElementById("filter-to"),
    reset: document.getElementById("filter-reset"),
    export: document.getElementById("admin-export"),
    meta: document.getElementById("admin-meta"),
    rows: document.getElementById("admin-rows"),
    empty: document.getElementById("admin-empty"),
    pagePrev: document.getElementById("page-prev"),
    pageNext: document.getElementById("page-next"),
    pageInfo: document.getElementById("page-info"),
    drawer: document.getElementById("admin-drawer"),
    drawerBackdrop: document.getElementById("drawer-backdrop"),
    drawerClose: document.getElementById("drawer-close"),
    drawerBody: document.getElementById("drawer-body"),
    drawerStatus: document.getElementById("drawer-status"),
    drawerDelete: document.getElementById("drawer-delete"),
  };

  let currentPage = 0;
  let totalRows = 0;
  let pageSize = 50;
  let periodDays = 30;
  let activeRow = null;
  const rowCache = new Map();
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

  function productLabel(value) {
    return PRODUCT_LABELS[value] || value || "—";
  }

  // ---------- Filters ----------
  // Builds the filter object sent to the backend. The selected period acts as a
  // default date window when no explicit "from" date is set by the user.
  function buildFilters(extra) {
    const filters = {};
    if (el.search.value.trim()) filters.search = el.search.value.trim();
    if (el.status.value) filters.status = el.status.value;
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

  // ---------- Table ----------
  function statusSelect(row) {
    const options = Object.entries(STATUS_LABELS)
      .map(
        ([value, label]) =>
          `<option value="${value}"${value === row.status ? " selected" : ""}>${label}</option>`,
      )
      .join("");
    return `<select class="admin__status-select" data-id="${row.id}" data-status="${escapeHtml(
      row.status,
    )}">${options}</select>`;
  }

  function renderRows(rows) {
    el.rows.innerHTML = "";
    el.empty.hidden = rows.length > 0;
    rowCache.clear();

    rows.forEach((row) => {
      rowCache.set(String(row.id), row);
      const tr = document.createElement("tr");
      tr.className = "admin__row";
      tr.dataset.id = row.id;
      tr.innerHTML = [
        `<td>${escapeHtml(formatDate(row.created_at))}</td>`,
        `<td>${escapeHtml(row.email)}</td>`,
        `<td>${escapeHtml(productLabel(row.product))}</td>`,
        `<td>${escapeHtml(row.reason)}</td>`,
        `<td>${escapeHtml(row.location)}</td>`,
        `<td class="cell-comment">${escapeHtml(row.comment)}</td>`,
        `<td data-stop>${statusSelect(row)}</td>`,
      ].join("");
      el.rows.appendChild(tr);
    });

    el.rows.querySelectorAll(".admin__status-select").forEach((select) => {
      select.addEventListener("change", onStatusChange);
    });

    el.rows.querySelectorAll(".admin__row").forEach((tr) => {
      tr.addEventListener("click", (event) => {
        if (event.target.closest("[data-stop]")) return;
        const row = rowCache.get(tr.dataset.id);
        if (row) openDetail(row);
      });
    });
  }

  function updatePager() {
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    el.pageInfo.textContent = `${currentPage + 1} / ${totalPages}`;
    el.pagePrev.disabled = currentPage <= 0;
    el.pageNext.disabled = currentPage >= totalPages - 1;
    el.meta.textContent = `Найдено заявок: ${totalRows}`;
  }

  async function loadRows() {
    try {
      const data = await callAdmin({
        action: "list",
        filters: buildFilters({ page: currentPage }),
      });
      totalRows = data.total || 0;
      pageSize = data.pageSize || pageSize;
      currentPage = data.page || 0;
      renderRows(data.rows || []);
      updatePager();
    } catch (error) {
      if (error.code === 401) return handleUnauthorized();
      el.meta.textContent = error.message;
    }
  }

  async function onStatusChange(event) {
    const select = event.target;
    await changeStatus(select.dataset.id, select.value, select);
    select.dataset.status = select.value;
  }

  async function changeStatus(id, status, control) {
    if (control) control.disabled = true;
    try {
      await callAdmin({ action: "updateStatus", id, status });
      const cached = rowCache.get(String(id));
      if (cached) cached.status = status;
    } catch (error) {
      if (error.code === 401) return handleUnauthorized();
      el.meta.textContent = error.message;
    } finally {
      if (control) control.disabled = false;
    }
  }

  // ---------- Stats + charts ----------
  function setKpis(stats) {
    const map = {
      total: stats.total ?? 0,
      new: stats.byStatus?.new ?? 0,
      in_progress: stats.byStatus?.in_progress ?? 0,
      done: stats.byStatus?.done ?? 0,
      spam: stats.byStatus?.spam ?? 0,
      today: stats.kpi?.today ?? 0,
      week: stats.kpi?.week ?? 0,
      doneShare: `${stats.kpi?.doneShare ?? 0}%`,
    };
    Object.entries(map).forEach(([field, value]) => {
      const node = el.kpis.querySelector(`[data-field="${field}"]`);
      if (node) node.textContent = value;
    });
  }

  // Fills a continuous range of days so the time series has no gaps.
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
            label: "Заявки",
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

    const statusKeys = ["new", "in_progress", "done", "spam"];
    upsertChart("chart-status", {
      type: "doughnut",
      data: {
        labels: statusKeys.map((k) => STATUS_LABELS[k]),
        datasets: [
          {
            data: statusKeys.map((k) => stats.byStatus?.[k] ?? 0),
            backgroundColor: statusKeys.map((k) => PALETTE[k]),
            borderWidth: 0,
          },
        ],
      },
      options: baseOptions({ cutout: "62%" }),
    });

    const productEntries = Object.entries(stats.byProduct || {});
    upsertChart("chart-product", {
      type: "bar",
      data: {
        labels: productEntries.map(([k]) => productLabel(k)),
        datasets: [
          {
            label: "Заявки",
            data: productEntries.map(([, v]) => v),
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

    const reasonEntries = Object.entries(stats.byReason || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    upsertChart("chart-reason", {
      type: "bar",
      data: {
        labels: reasonEntries.map(([k]) => k),
        datasets: [
          {
            label: "Заявки",
            data: reasonEntries.map(([, v]) => v),
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

    const locations = stats.topLocations || [];
    upsertChart("chart-location", {
      type: "bar",
      data: {
        labels: locations.map((l) => l.name),
        datasets: [
          {
            label: "Заявки",
            data: locations.map((l) => l.count),
            backgroundColor: PALETTE.bars,
            borderRadius: 6,
          },
        ],
      },
      options: baseOptions({
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: axisOptions(),
      }),
    });
  }

  async function loadStats() {
    try {
      const stats = await callAdmin({ action: "stats", filters: buildFilters() });
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
      if (!el.meta.textContent?.startsWith("Найдено заявок:")) {
        el.meta.textContent = message;
      }
    }
  }

  function refreshAll() {
    loadStats();
    loadRows();
  }

  // ---------- Drawer ----------
  function detailRow(label, value, isLink) {
    if (value == null || value === "") return "";
    const content = isLink
      ? `<a href="${escapeHtml(value)}" target="_blank" rel="noopener">${escapeHtml(value)}</a>`
      : escapeHtml(value);
    return `<div class="drawer__row"><span class="drawer__key">${label}</span><span class="drawer__val">${content}</span></div>`;
  }

  function openDetail(row) {
    activeRow = row;
    el.drawerBody.innerHTML = [
      detailRow("Дата", formatDate(row.created_at)),
      detailRow("Email", row.email),
      detailRow("Продукт", productLabel(row.product)),
      detailRow("Причина", row.reason),
      detailRow("Локация", row.location),
      detailRow("Источник", row.source_url, true),
      detailRow("User-Agent", row.user_agent),
      detailRow("ID", row.id),
      row.comment
        ? `<div class="drawer__comment"><span class="drawer__key">Комментарий</span><p>${escapeHtml(
            row.comment,
          )}</p></div>`
        : "",
    ].join("");

    el.drawerStatus.innerHTML = Object.entries(STATUS_LABELS)
      .map(
        ([value, label]) =>
          `<option value="${value}"${value === row.status ? " selected" : ""}>${label}</option>`,
      )
      .join("");

    el.drawer.hidden = false;
    document.body.classList.add("is-drawer-open");
  }

  function closeDetail() {
    el.drawer.hidden = true;
    activeRow = null;
    document.body.classList.remove("is-drawer-open");
  }

  el.drawerClose.addEventListener("click", closeDetail);
  el.drawerBackdrop.addEventListener("click", closeDetail);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !el.drawer.hidden) closeDetail();
  });

  el.drawerStatus.addEventListener("change", async () => {
    if (!activeRow) return;
    await changeStatus(activeRow.id, el.drawerStatus.value, el.drawerStatus);
    activeRow.status = el.drawerStatus.value;
    const select = el.rows.querySelector(`.admin__status-select[data-id="${activeRow.id}"]`);
    if (select) {
      select.value = activeRow.status;
      select.dataset.status = activeRow.status;
    }
    loadStats();
  });

  el.drawerDelete.addEventListener("click", async () => {
    if (!activeRow) return;
    if (!window.confirm("Удалить заявку безвозвратно?")) return;
    el.drawerDelete.disabled = true;
    try {
      await callAdmin({ action: "delete", id: activeRow.id });
      closeDetail();
      refreshAll();
    } catch (error) {
      if (error.code === 401) return handleUnauthorized();
      el.meta.textContent = error.message;
    } finally {
      el.drawerDelete.disabled = false;
    }
  });

  // ---------- CSV export ----------
  function csvCell(value) {
    const str = value == null ? "" : String(value);
    return `"${str.replace(/"/g, '""')}"`;
  }

  async function exportCsv() {
    el.export.disabled = true;
    const original = el.export.textContent;
    el.export.textContent = "Готовим…";
    try {
      const header = [
        "created_at",
        "email",
        "product",
        "reason",
        "location",
        "comment",
        "status",
        "source_url",
        "user_agent",
      ];
      const lines = [header.join(",")];
      let page = 0;
      let total = Infinity;
      while (page * pageSize < total) {
        const data = await callAdmin({
          action: "list",
          filters: buildFilters({ page }),
        });
        total = data.total || 0;
        (data.rows || []).forEach((row) => {
          lines.push(header.map((key) => csvCell(row[key])).join(","));
        });
        if (!data.rows || data.rows.length === 0) break;
        page += 1;
      }
      const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error.code === 401) return handleUnauthorized();
      el.meta.textContent = error.message;
    } finally {
      el.export.disabled = false;
      el.export.textContent = original;
    }
  }

  // ---------- Auth / panel ----------
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

  // ---------- Events ----------
  el.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    el.loginError.hidden = true;
    sessionStorage.setItem(STORAGE_KEY, el.password.value);
    try {
      await callAdmin({ action: "list", filters: { page: 0 } });
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

  el.refresh.addEventListener("click", refreshAll);

  el.period.addEventListener("click", (event) => {
    const chip = event.target.closest(".admin__chip");
    if (!chip) return;
    periodDays = Number(chip.dataset.days) || 0;
    el.period.querySelectorAll(".admin__chip").forEach((node) => {
      node.classList.toggle("is-active", node === chip);
    });
    currentPage = 0;
    refreshAll();
  });

  el.filters.addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 0;
    refreshAll();
  });

  el.reset.addEventListener("click", () => {
    el.search.value = "";
    el.status.value = "";
    el.from.value = "";
    el.to.value = "";
    currentPage = 0;
    refreshAll();
  });

  el.export.addEventListener("click", exportCsv);

  el.pagePrev.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage -= 1;
      loadRows();
    }
  });

  el.pageNext.addEventListener("click", () => {
    currentPage += 1;
    loadRows();
  });

  // Restore session if a password is already stored.
  if (getPassword()) {
    showPanel();
    refreshAll();
  } else {
    showLogin();
  }
})();
