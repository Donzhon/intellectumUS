/* First-visit boot screen for the home page.
   Waits only for the hero <img> (no duplicate fetch, no font gate) so the
   main visual appears as soon as it is decoded. Boot logo is already in DOM. */
(() => {
  const STORAGE_KEY = "intellectum-us-index-boot-v1";
  const MIN_VISIBLE_MS = 400;
  const MAX_VISIBLE_MS = 2000;
  const FADE_MS = 400;

  const root = document.documentElement;

  let firstVisit = false;
  try {
    firstVisit = !localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    firstVisit = false;
  }

  if (!firstVisit) {
    root.classList.remove("is-boot-loading");
    return;
  }

  const bootScreen = document.getElementById("boot-screen");
  if (!bootScreen) {
    root.classList.remove("is-boot-loading");
    return;
  }

  bootScreen.hidden = false;

  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const waitForImage = (img) => {
    if (!img) {
      return Promise.resolve();
    }
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    });
  };

  const heroImageReady = waitForImage(document.querySelector(".hero-art__img"));

  let finished = false;

  const finish = () => {
    if (finished) {
      return;
    }
    finished = true;

    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (_) {
      /* ignore storage failures */
    }

    root.classList.remove("is-boot-loading");
    bootScreen.classList.add("is-leaving");

    window.setTimeout(() => {
      bootScreen.hidden = true;
    }, FADE_MS);
  };

  Promise.all([heroImageReady, sleep(MIN_VISIBLE_MS)]).then(finish);
  window.setTimeout(finish, MAX_VISIBLE_MS);
})();
