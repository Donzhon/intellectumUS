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

  const el = {
    login: document.getElementById("admin-login"),
    loginForm: document.getElementById("admin-login-form"),
    password: document.getElementById("admin-password"),
    loginError: document.getElementById("admin-login-error"),
    panel: document.getElementById("admin-panel"),
    logout: document.getElementById("admin-logout"),
    filters: document.getElementById("admin-filters"),
    search: document.getElementById("filter-search"),
    status: document.getElementById("filter-status"),
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
  let pageSize = 50;

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

    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = [
        `<td>${escapeHtml(formatDate(row.created_at))}</td>`,
        `<td>${escapeHtml(row.email)}</td>`,
        `<td>${escapeHtml(row.product)}</td>`,
        `<td>${escapeHtml(row.reason)}</td>`,
        `<td>${escapeHtml(row.location)}</td>`,
        `<td class="cell-comment">${escapeHtml(row.comment)}</td>`,
        `<td>${statusSelect(row)}</td>`,
      ].join("");
      el.rows.appendChild(tr);
    });

    el.rows.querySelectorAll(".admin__status-select").forEach((select) => {
      select.addEventListener("change", onStatusChange);
    });
  }

  function buildFilters() {
    const filters = { page: currentPage };
    if (el.search.value.trim()) filters.search = el.search.value.trim();
    if (el.status.value) filters.status = el.status.value;
    if (el.from.value) filters.from = new Date(el.from.value).toISOString();
    if (el.to.value) {
      const to = new Date(el.to.value);
      to.setHours(23, 59, 59, 999);
      filters.to = to.toISOString();
    }
    return filters;
  }

  function updatePager() {
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    el.pageInfo.textContent = `${currentPage + 1} / ${totalPages}`;
    el.pagePrev.disabled = currentPage <= 0;
    el.pageNext.disabled = currentPage >= totalPages - 1;
    el.meta.textContent = `Всего заявок: ${totalRows}`;
  }

  async function loadRows() {
    try {
      const data = await callAdmin({ action: "list", filters: buildFilters() });
      totalRows = data.total || 0;
      pageSize = data.pageSize || pageSize;
      currentPage = data.page || 0;
      renderRows(data.rows || []);
      updatePager();
    } catch (error) {
      if (error.code === 401) {
        handleUnauthorized();
        return;
      }
      el.meta.textContent = error.message;
    }
  }

  async function onStatusChange(event) {
    const select = event.target;
    const id = select.dataset.id;
    const status = select.value;
    select.disabled = true;
    try {
      await callAdmin({ action: "updateStatus", id, status });
      select.dataset.status = status;
    } catch (error) {
      if (error.code === 401) {
        handleUnauthorized();
        return;
      }
      el.meta.textContent = error.message;
    } finally {
      select.disabled = false;
    }
  }

  function showPanel() {
    el.login.hidden = true;
    el.panel.hidden = false;
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

  el.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    el.loginError.hidden = true;
    sessionStorage.setItem(STORAGE_KEY, el.password.value);
    try {
      await callAdmin({ action: "list", filters: { page: 0 } });
      el.password.value = "";
      showPanel();
      await loadRows();
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

  el.filters.addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 0;
    loadRows();
  });

  el.reset.addEventListener("click", () => {
    el.search.value = "";
    el.status.value = "";
    el.from.value = "";
    el.to.value = "";
    currentPage = 0;
    loadRows();
  });

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
    loadRows();
  } else {
    showLogin();
  }
})();
