/* First-visit boot screen for the home page.
   Shows a short loading screen (1–2.5s) while the hero image and fonts
   warm up, so the hero never appears with a black canvas or unstyled text. */
(() => {
  const STORAGE_KEY = "intellectum-us-index-boot-v1";
  const MIN_VISIBLE_MS = 1000;
  const MAX_VISIBLE_MS = 2500;
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

  const fontsReady = document.fonts?.ready
    ? document.fonts.ready.catch(() => {})
    : Promise.resolve();

  const heroImageSrc = window.matchMedia("(max-width: 720px)").matches
    ? "assets/hero/full-mob.png"
    : "assets/hero-perple.png";
  const heroImageReady = new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
    img.src = heroImageSrc;
  });

  const bootLogoReady = new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
    if (img.srcset !== undefined) {
      img.srcset = "assets/icon/intellectum-256.webp";
      img.src = "assets/icon/intellectum-256.png";
    } else {
      img.src = "assets/icon/intellectum-256.png";
    }
  });

  const assetsReady = Promise.all([fontsReady, bootLogoReady, heroImageReady]);

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

  Promise.all([assetsReady, sleep(MIN_VISIBLE_MS)]).then(finish);
  window.setTimeout(finish, MAX_VISIBLE_MS);
})();
