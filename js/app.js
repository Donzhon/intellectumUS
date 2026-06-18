/* ---------- Keep the address bar clean (no index.html, no trailing #) ---------- */
(() => {
  const { pathname, search, hash } = window.location;
  let nextPath = pathname;

  if (nextPath.endsWith("/index.html")) {
    nextPath = nextPath.slice(0, -"/index.html".length) || "/";
  }

  const cleaned = nextPath + search + hash;
  const current = pathname + search + hash;

  try {
    if (cleaned !== current) {
      history.replaceState(null, "", cleaned);
    } else if (hash === "" && window.location.href.endsWith("#")) {
      history.replaceState(null, "", pathname + search);
    }
  } catch (_) {
    /* replaceState can throw on file:// — safe to ignore */
  }
})();

document.addEventListener("click", (event) => {
  if (event.target.closest('a[href="#"]')) {
    event.preventDefault();
  }
});sdfgsdf

const menuPill = document.querySelector(".menu-pill");
const navMenu = document.getElementById("nav-menu");
const siteActionsMenuHost = navMenu?.closest(".site-actions");

const MOBILE_NAV_MENU_MQ = window.matchMedia("(max-width: 720px)");

let navMenuPortalAnchor = null;

const mountNavMenuOverlay = () => {
  if (!navMenu || !MOBILE_NAV_MENU_MQ.matches) {
    return;
  }

  const wrap = navMenu.parentElement;
  if (!wrap) {
    return;
  }

  if (!navMenuPortalAnchor) {
    navMenuPortalAnchor = document.createComment("nav-menu-portal");
    wrap.insertBefore(navMenuPortalAnchor, navMenu);
  }

  if (navMenu.parentElement !== document.body) {
    document.body.appendChild(navMenu);
  }

  navMenu.classList.add("nav-menu--overlay");
};

const unmountNavMenuOverlay = () => {
  if (!navMenu) {
    return;
  }

  navMenu.classList.remove("nav-menu--overlay");

  if (navMenuPortalAnchor?.parentElement) {
    navMenuPortalAnchor.parentElement.insertBefore(navMenu, navMenuPortalAnchor);
  }
};

const clearNavMenuInlineLayout = () => {
  if (!navMenu) {
    return;
  }

  navMenu.style.top = "";
  navMenu.style.right = "";
  navMenu.style.left = "";
  navMenu.style.bottom = "";
  navMenu.style.width = "";
  navMenu.style.maxHeight = "";
  navMenu.style.height = "";
};

const getNavMenuBottomGap = () => {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;bottom:max(1rem, env(safe-area-inset-bottom));visibility:hidden;pointer-events:none;";
  document.body.appendChild(probe);
  const gap = window.innerHeight - probe.getBoundingClientRect().top;
  probe.remove();
  return Math.max(16, Math.round(gap));
};

const positionSiteActionsNavMenu = () => {
  if (!menuPill || !navMenu || !siteActionsMenuHost) {
    return;
  }

  if (MOBILE_NAV_MENU_MQ.matches) {
    clearNavMenuInlineLayout();
    return;
  }

  const rect = menuPill.getBoundingClientRect();
  const top = rect.bottom + 10;
  const bottomGap = getNavMenuBottomGap();
  const maxHeight = Math.max(160, window.innerHeight - top - bottomGap);

  navMenu.style.top = `${top}px`;
  navMenu.style.maxHeight = `${maxHeight}px`;
  navMenu.style.right = `${Math.max(16, window.innerWidth - rect.right)}px`;
  navMenu.style.left = "auto";
  navMenu.style.bottom = "";
  navMenu.style.width = "";
  navMenu.style.height = "";
};

const setNavMenuOpen = (open) => {
  if (!menuPill || !navMenu) {
    return;
  }

  menuPill.setAttribute("aria-expanded", String(open));
  menuPill.classList.toggle("is-open", open);
  navMenu.hidden = !open;
  document.documentElement.classList.toggle("is-nav-menu-open", open);

  if (open) {
    if (MOBILE_NAV_MENU_MQ.matches) {
      mountNavMenuOverlay();
    } else {
      unmountNavMenuOverlay();
    }
    positionSiteActionsNavMenu();
    return;
  }

  unmountNavMenuOverlay();
  clearNavMenuInlineLayout();
};

window.addEventListener("resize", () => {
  if (menuPill?.getAttribute("aria-expanded") !== "true") {
    return;
  }

  if (MOBILE_NAV_MENU_MQ.matches) {
    mountNavMenuOverlay();
  } else {
    unmountNavMenuOverlay();
  }

  positionSiteActionsNavMenu();
});

MOBILE_NAV_MENU_MQ.addEventListener("change", () => {
  if (menuPill?.getAttribute("aria-expanded") !== "true") {
    unmountNavMenuOverlay();
    clearNavMenuInlineLayout();
    return;
  }

  if (MOBILE_NAV_MENU_MQ.matches) {
    mountNavMenuOverlay();
  } else {
    unmountNavMenuOverlay();
  }

  positionSiteActionsNavMenu();
});

menuPill?.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = menuPill.getAttribute("aria-expanded") === "true";
  setNavMenuOpen(!isOpen);
});

navMenu?.querySelector(".nav-menu__close")?.addEventListener("click", (event) => {
  event.stopPropagation();
  setNavMenuOpen(false);
});

document.addEventListener("click", (event) => {
  if (!menuPill || !navMenu || navMenu.hidden) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (menuPill.contains(target) || navMenu.contains(target)) {
    return;
  }

  setNavMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavMenuOpen(false);
  }
});

/* ---------- Site nav Products: scroll or go to products block ---------- */
const PRODUCTS_SCROLL_TARGET = "bento-showcase";
const productsNavToggle = document.querySelector(".site-nav__toggle");
const productsScrollTargetId =
  productsNavToggle?.dataset.scrollTo || PRODUCTS_SCROLL_TARGET;
const productsScrollSection = document.getElementById(productsScrollTargetId);
const productsScrollHref =
  productsNavToggle?.dataset.scrollHref || `/#${productsScrollTargetId}`;

productsNavToggle?.addEventListener("click", (event) => {
  event.preventDefault();
  productsNavToggle.setAttribute("aria-expanded", "false");

  if (productsScrollSection) {
    productsScrollSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  window.location.assign(productsScrollHref);
});

const DESKTOP_NODI_INTRO_VIDEO = "assets/video/nodi-in.mp4";
const DESKTOP_NODI_LOOP_VIDEO = "assets/video/nodi-main.mp4";
const DESKTOP_NODI_EXIT_VIDEO = "assets/video/nodi-intellectum.mp4";
const DESKTOP_INTELLECTUM_MAIN_IMAGE = "assets/video/intellectum.jpg";
const MOBILE_NODI_INTRO_VIDEO = "assets/video/mobile-video/mob-nodi-input.mp4";
const MOBILE_NODI_LOOP_VIDEO = "assets/video/mobile-video/mob-nodi-2.mp4";
const MOBILE_NODI_EXIT_VIDEO = "assets/video/mobile-video/mob-nodi-change-intellectum.mp4";
const MOBILE_INTELLECTUM_EXIT_VIDEO = "assets/video/mobile-video/intellecum-out.mp4";
const MOBILE_INTELLECTUM_MAIN_IMAGE = "assets/video/mobile-video/intellectum-2.jpg";
const mobileBackgroundQuery = window.matchMedia?.("(max-width: 720px)");
const useMobileBackgroundSources = mobileBackgroundQuery?.matches ?? false;
const pickBackgroundVideo = (desktopSrc, mobileSrc) =>
  useMobileBackgroundSources ? mobileSrc : desktopSrc;
const pickBackgroundAsset = pickBackgroundVideo;
const NODI_INTRO_VIDEO = pickBackgroundVideo(DESKTOP_NODI_INTRO_VIDEO, MOBILE_NODI_INTRO_VIDEO);
const NODI_LOOP_VIDEO = pickBackgroundVideo(DESKTOP_NODI_LOOP_VIDEO, MOBILE_NODI_LOOP_VIDEO);
const NODI_EXIT_VIDEO = pickBackgroundVideo(DESKTOP_NODI_EXIT_VIDEO, MOBILE_NODI_EXIT_VIDEO);
const INTELLECTUM_MAIN_IMAGE = pickBackgroundAsset(
  DESKTOP_INTELLECTUM_MAIN_IMAGE,
  MOBILE_INTELLECTUM_MAIN_IMAGE
);
const INTELLECTUM_EXIT_VIDEO = useMobileBackgroundSources ? MOBILE_INTELLECTUM_EXIT_VIDEO : null;
const responsiveBackgroundFallbacks = new Map([
  [MOBILE_NODI_INTRO_VIDEO, DESKTOP_NODI_INTRO_VIDEO],
  [MOBILE_NODI_LOOP_VIDEO, DESKTOP_NODI_LOOP_VIDEO],
  [MOBILE_NODI_EXIT_VIDEO, DESKTOP_NODI_EXIT_VIDEO],
  [MOBILE_INTELLECTUM_EXIT_VIDEO, DESKTOP_NODI_INTRO_VIDEO],
  [MOBILE_INTELLECTUM_MAIN_IMAGE, DESKTOP_INTELLECTUM_MAIN_IMAGE],
]);

const videoLayers = Array.from(document.querySelectorAll(".bg-video"));
const heroBackgroundStage = document.querySelector(".hero-stage");
const bgCanvas = document.querySelector(".bg-canvas");
const bgCtx = bgCanvas ? bgCanvas.getContext("2d") : null;
const CROSSFADE_MS = 700;
const useNativeTouchVideo =
  window.matchMedia?.("(hover: none) and (pointer: coarse)").matches ?? false;
let currentBackgroundSrc = NODI_INTRO_VIDEO;
let visibleLayerIndex = 0;
let isShowingImage = false;
let isTransitioning = false;
let failedAttempts = 0;
let videoDisabled = false;
let galleryActiveIndex = 0;
let videoAfterEndSrc = null;
let intellectumIntroLayoutHook = null;
let intellectumLayoutOffHook = null;
const backgroundImages = new Map();

const isImageSrc = (src) => /\.(jpe?g|png|webp|gif)$/i.test(src);

const maybeStartIntellectumLayout = (src) => {
  if (src === INTELLECTUM_MAIN_IMAGE) {
    intellectumIntroLayoutHook?.();
  }
};

const setActiveVideoLayer = (activeLayer) => {
  videoLayers.forEach((layer) => {
    layer.classList.toggle("is-active", layer === activeLayer);
  });
};

const setHeroImageBackground = (src) => {
  if (!heroBackgroundStage) {
    return;
  }

  heroBackgroundStage.style.backgroundImage = `url("${src}")`;
  heroBackgroundStage.classList.add("is-image-background");
};

const clearHeroImageBackground = () => {
  if (!heroBackgroundStage) {
    return;
  }

  heroBackgroundStage.style.backgroundImage = "";
  heroBackgroundStage.classList.remove("is-image-background");
};

// Canvas crossfade state.
let fadeFrom = null;
let fadeTo = null;
let fadeStart = 0;

const resizeCanvas = () => {
  if (!bgCanvas) {
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  bgCanvas.width = Math.max(1, Math.round(bgCanvas.clientWidth * dpr));
  bgCanvas.height = Math.max(1, Math.round(bgCanvas.clientHeight * dpr));
};

const getSourceDimensions = (source) => {
  if (source instanceof HTMLVideoElement) {
    if (source.readyState < 2) {
      return null;
    }

    return { width: source.videoWidth, height: source.videoHeight };
  }

  if (source instanceof HTMLImageElement) {
    if (!source.complete || !source.naturalWidth) {
      return null;
    }

    return { width: source.naturalWidth, height: source.naturalHeight };
  }

  return null;
};

// Draw a video frame or still image with object-fit: cover behaviour.
const drawCoverSource = (source, alpha) => {
  if (!bgCtx || !source) {
    return;
  }

  const dimensions = getSourceDimensions(source);
  if (!dimensions) {
    return;
  }

  const { width: sw, height: sh } = dimensions;
  const cw = bgCanvas.width;
  const ch = bgCanvas.height;
  const scale = Math.max(cw / sw, ch / sh);
  const dw = sw * scale;
  const dh = sh * scale;

  bgCtx.globalAlpha = alpha;
  bgCtx.drawImage(source, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  bgCtx.globalAlpha = 1;
};

const getVisibleBackgroundSource = () => {
  if (isShowingImage) {
    return backgroundImages.get(currentBackgroundSrc) ?? null;
  }

  return videoLayers[visibleLayerIndex] ?? null;
};

const renderFrame = () => {
  if (!useNativeTouchVideo && bgCtx && !videoDisabled && videoLayers.length > 0) {
    if (fadeTo) {
      const t = Math.min(1, (performance.now() - fadeStart) / CROSSFADE_MS);
      drawCoverSource(fadeFrom, 1);
      drawCoverSource(fadeTo, t);
    } else {
      drawCoverSource(getVisibleBackgroundSource(), 1);
    }
  }

  requestAnimationFrame(renderFrame);
};

const tryPlay = (layer) => {
  if (!layer) {
    return;
  }

  const playPromise = layer.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay may be blocked until user interaction; hero overlay remains visible.
    });
  }
};

const mediaSrcMatches = (media, src) => {
  if (!media?.src) {
    return false;
  }

  try {
    return media.src.endsWith(src) || new URL(media.src).pathname.endsWith(src);
  } catch {
    return media.src.endsWith(src);
  }
};

const layerSrcMatches = (layer, src) => mediaSrcMatches(layer, src);
const backgroundSrcMatches = (actualSrc, expectedSrc) =>
  actualSrc === expectedSrc || responsiveBackgroundFallbacks.get(expectedSrc) === actualSrc;
const backgroundLayerSrcMatches = (layer, expectedSrc) =>
  layerSrcMatches(layer, expectedSrc) ||
  layerSrcMatches(layer, responsiveBackgroundFallbacks.get(expectedSrc));

const pauseAllVideoLayers = () => {
  videoLayers.forEach((layer) => layer.pause());
};

const getCurrentVideoLayer = () => (isShowingImage ? null : videoLayers[visibleLayerIndex]);

// Always load the requested clip and rewind to the first frame before playback.
const prepareLayerSrc = (layer, src) =>
  new Promise((resolve, reject) => {
    const needsSrcChange = !layerSrcMatches(layer, src);

    const onReady = () => {
      layer.pause();
      layer.currentTime = 0;
      resolve(layer);
    };

    if (!needsSrcChange && layer.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      onReady();
      return;
    }

    layer.addEventListener("loadeddata", onReady, { once: true });
    layer.addEventListener(
      "error",
      () => reject(new Error(`Failed to load ${src}`)),
      { once: true }
    );

    if (needsSrcChange) {
      layer.src = src;
    }

    layer.load();
  });

const prepareBackgroundImage = (src) => {
  const cached = backgroundImages.get(src);

  if (cached?.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = cached ?? new Image();

    if (!cached) {
      backgroundImages.set(src, img);
    }

    const onReady = () => resolve(img);

    img.addEventListener("load", onReady, { once: true });
    img.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });

    if (!mediaSrcMatches(img, src)) {
      img.src = src;
    } else if (img.complete && img.naturalWidth > 0) {
      onReady();
    }
  });
};

const preloadBackgroundSrc = (src) => {
  if (!src || isTransitioning) {
    return;
  }

  if (isImageSrc(src)) {
    prepareBackgroundImage(src).catch(() => {
      // Preload errors are handled when the asset becomes active.
    });
    return;
  }

  if (videoLayers.length < 2) {
    return;
  }

  const hiddenLayer = videoLayers[visibleLayerIndex ^ 1];
  prepareLayerSrc(hiddenLayer, src).catch(() => {
    // Preload errors are handled when the clip becomes active.
  });
};

const schedulePreloadBackgroundSrc = (src) => {
  if (!src) {
    return;
  }

  const run = () => {
    if (isTransitioning) {
      window.setTimeout(run, 50);
      return;
    }

    preloadBackgroundSrc(src);
  };

  run();
};

// Run the callback only once a real video frame is painted, so we never
// fade a not-yet-decoded (black) frame over the current video.
const whenFrameReady = (layer, callback) => {
  let done = false;

  const run = () => {
    if (done) {
      return;
    }
    done = true;
    callback();
  };

  if (typeof layer.requestVideoFrameCallback === "function") {
    layer.requestVideoFrameCallback(() => run());
  } else {
    layer.addEventListener("playing", run, { once: true });
  }

  window.setTimeout(run, 500);
};

const whenImageReady = (image, callback) => {
  let done = false;

  const run = () => {
    if (done) {
      return;
    }
    done = true;
    callback();
  };

  if (image.complete && image.naturalWidth > 0) {
    run();
    return;
  }

  image.addEventListener("load", run, { once: true });
  window.setTimeout(run, 500);
};

const beginCrossfade = (fromSource, toSource, nextSrc, onComplete) => {
  maybeStartIntellectumLayout(nextSrc);

  if (useNativeTouchVideo) {
    if (isImageSrc(nextSrc)) {
      setHeroImageBackground(nextSrc);
      setActiveVideoLayer(null);
    } else if (toSource instanceof HTMLVideoElement) {
      heroBackgroundStage?.classList.remove("is-image-background");
      setActiveVideoLayer(toSource);
    }

    window.setTimeout(() => {
      onComplete();

      if (!isImageSrc(nextSrc)) {
        clearHeroImageBackground();
      }

      isTransitioning = false;
    }, CROSSFADE_MS);
    return;
  }

  fadeFrom = fromSource;
  fadeTo = toSource;
  fadeStart = performance.now();

  window.setTimeout(() => {
    onComplete();
    fadeFrom = null;
    fadeTo = null;
    isTransitioning = false;
  }, CROSSFADE_MS);
};

const crossfadeToImage = (nextSrc) => {
  const fromSource = isShowingImage
    ? backgroundImages.get(currentBackgroundSrc)
    : videoLayers[visibleLayerIndex];

  prepareBackgroundImage(nextSrc)
    .then((image) => {
      whenImageReady(image, () => {
        beginCrossfade(fromSource, image, nextSrc, () => {
          isShowingImage = true;
          currentBackgroundSrc = nextSrc;
          pauseAllVideoLayers();
        });
      });
    })
    .catch(() => {
      isTransitioning = false;
      handleVideoError(nextSrc);
    });
};

const crossfadeFromImageToVideo = (nextSrc) => {
  const fromImage = backgroundImages.get(currentBackgroundSrc);
  const nextLayer = videoLayers[visibleLayerIndex ^ 1];

  prepareLayerSrc(nextLayer, nextSrc)
    .then(() => {
      tryPlay(nextLayer);

      whenFrameReady(nextLayer, () => {
        beginCrossfade(fromImage, nextLayer, nextSrc, () => {
          isShowingImage = false;
          visibleLayerIndex ^= 1;
          currentBackgroundSrc = nextSrc;
          tryPlay(videoLayers[visibleLayerIndex]);
        });
      });
    })
    .catch(() => {
      isTransitioning = false;
      handleVideoError(nextSrc);
    });
};

const crossfadeToVideo = (nextSrc) => {
  const currentLayer = videoLayers[visibleLayerIndex];
  const nextLayer = videoLayers[visibleLayerIndex ^ 1];

  prepareLayerSrc(nextLayer, nextSrc)
    .then(() => {
      tryPlay(nextLayer);

      whenFrameReady(nextLayer, () => {
        beginCrossfade(currentLayer, nextLayer, nextSrc, () => {
          visibleLayerIndex ^= 1;
          currentBackgroundSrc = nextSrc;
          currentLayer.pause();
          tryPlay(videoLayers[visibleLayerIndex]);
        });
      });
    })
    .catch(() => {
      isTransitioning = false;
      handleVideoError(nextSrc);
    });
};

const crossfadeToSrc = (nextSrc) => {
  if (isTransitioning || videoLayers.length === 0 || !nextSrc) {
    return;
  }

  if (isImageSrc(nextSrc)) {
    isTransitioning = true;
    crossfadeToImage(nextSrc);
    return;
  }

  if (videoLayers.length < 2) {
    isTransitioning = true;
    const onlyLayer = videoLayers[0];

    prepareLayerSrc(onlyLayer, nextSrc)
      .then(() => {
        isShowingImage = false;
        currentBackgroundSrc = nextSrc;
        setActiveVideoLayer(onlyLayer);
        tryPlay(onlyLayer);
        whenFrameReady(onlyLayer, () => maybeStartIntellectumLayout(nextSrc));
      })
      .catch(() => handleVideoError(nextSrc))
      .finally(() => {
        isTransitioning = false;
      });
    return;
  }

  isTransitioning = true;

  if (isShowingImage) {
    crossfadeFromImageToVideo(nextSrc);
    return;
  }

  crossfadeToVideo(nextSrc);
};

const resetBackgroundTransition = () => {
  isTransitioning = false;
  fadeFrom = null;
  fadeTo = null;
};

const playBackgroundSrc = (src, { force = false } = {}) => {
  if (videoDisabled || !src) {
    return;
  }

  if (force) {
    resetBackgroundTransition();
  }

  crossfadeToSrc(src);
};

const replayBackgroundSrc = (src) => {
  if (videoDisabled || !src || isImageSrc(src)) {
    return;
  }

  if (isShowingImage) {
    playBackgroundSrc(src);
    return;
  }

  const layer = getCurrentVideoLayer();
  if (!layer || !backgroundLayerSrcMatches(layer, src)) {
    playBackgroundSrc(src);
    return;
  }

  currentBackgroundSrc = layerSrcMatches(layer, src)
    ? src
    : responsiveBackgroundFallbacks.get(src) || src;
  layer.currentTime = 0;
  setActiveVideoLayer(layer);
  tryPlay(layer);
};

const handleBackgroundEnded = () => {
  if (isShowingImage) {
    return;
  }

  if (videoAfterEndSrc) {
    const nextSrc = videoAfterEndSrc;
    videoAfterEndSrc = null;
    playBackgroundSrc(nextSrc);
    return;
  }

  if (galleryActiveIndex === 0) {
    const visibleLayer = getCurrentVideoLayer();
    const onIntro =
      backgroundSrcMatches(currentBackgroundSrc, NODI_INTRO_VIDEO) ||
      (visibleLayer && backgroundLayerSrcMatches(visibleLayer, NODI_INTRO_VIDEO));

    if (onIntro) {
      playBackgroundSrc(NODI_LOOP_VIDEO);
      return;
    }

    if (
      backgroundSrcMatches(currentBackgroundSrc, NODI_LOOP_VIDEO) ||
      (visibleLayer && backgroundLayerSrcMatches(visibleLayer, NODI_LOOP_VIDEO))
    ) {
      replayBackgroundSrc(NODI_LOOP_VIDEO);
    }

    return;
  }

  if (galleryActiveIndex === 1 && !isShowingImage) {
    playBackgroundSrc(INTELLECTUM_MAIN_IMAGE);
  }
};

const onGalleryProductChange = (prevIndex, nextIndex) => {
  galleryActiveIndex = nextIndex;
  videoAfterEndSrc = null;

  if (prevIndex === 0 && nextIndex === 1) {
    videoAfterEndSrc = INTELLECTUM_MAIN_IMAGE;
    playBackgroundSrc(NODI_EXIT_VIDEO, { force: true });
    schedulePreloadBackgroundSrc(INTELLECTUM_MAIN_IMAGE);
    intellectumIntroLayoutHook?.();
    return;
  }

  if (nextIndex === 0) {
    if (prevIndex === 1 && INTELLECTUM_EXIT_VIDEO) {
      videoAfterEndSrc = NODI_INTRO_VIDEO;
      playBackgroundSrc(INTELLECTUM_EXIT_VIDEO, { force: true });
      schedulePreloadBackgroundSrc(NODI_LOOP_VIDEO);
      intellectumLayoutOffHook?.();
      return;
    }

    playBackgroundSrc(NODI_INTRO_VIDEO, { force: true });
    schedulePreloadBackgroundSrc(NODI_LOOP_VIDEO);
    intellectumLayoutOffHook?.();
    return;
  }

  if (nextIndex === 1 && prevIndex !== 0) {
    playBackgroundSrc(INTELLECTUM_MAIN_IMAGE, { force: true });
    schedulePreloadBackgroundSrc(INTELLECTUM_MAIN_IMAGE);
    intellectumIntroLayoutHook?.();
  }
};

const handleVideoError = (failedSrc = currentBackgroundSrc) => {
  const fallbackSrc = responsiveBackgroundFallbacks.get(failedSrc);

  if (fallbackSrc) {
    resetBackgroundTransition();
    videoAfterEndSrc = null;
    if (fallbackSrc === currentBackgroundSrc) {
      replayBackgroundSrc(fallbackSrc);
    } else {
      playBackgroundSrc(fallbackSrc, { force: true });
    }
    schedulePreloadBackgroundSrc(fallbackSrc);
    return;
  }

  failedAttempts += 1;

  if (failedAttempts >= 6) {
    videoDisabled = true;
    if (bgCtx) {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    }
    if (bgCanvas) {
      bgCanvas.style.display = "none";
    }
    return;
  }

  if (galleryActiveIndex === 0) {
    if (backgroundSrcMatches(currentBackgroundSrc, NODI_INTRO_VIDEO)) {
      playBackgroundSrc(NODI_LOOP_VIDEO);
    } else {
      replayBackgroundSrc(NODI_LOOP_VIDEO);
    }
  } else if (galleryActiveIndex === 1) {
    playBackgroundSrc(INTELLECTUM_MAIN_IMAGE);
  }
};

if (videoLayers.length > 0 && (bgCtx || useNativeTouchVideo)) {
  if (!useNativeTouchVideo) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  videoLayers.forEach((layer) => {
    layer.disablePictureInPicture = true;

    layer.addEventListener("ended", () => {
      if (isShowingImage) {
        return;
      }

      if (layer === videoLayers[visibleLayerIndex] && !isTransitioning) {
        handleBackgroundEnded();
      }
    });

    layer.addEventListener("error", () => {
      if (isShowingImage) {
        return;
      }

      if (layer === videoLayers[visibleLayerIndex] && !isTransitioning) {
        handleVideoError();
      }
    });

    layer.addEventListener("loadeddata", () => {
      failedAttempts = 0;
    });
  });

  const firstLayer = videoLayers[0];

  prepareLayerSrc(firstLayer, NODI_INTRO_VIDEO)
    .then(() => {
      isShowingImage = false;
      currentBackgroundSrc = NODI_INTRO_VIDEO;
      setActiveVideoLayer(firstLayer);
      tryPlay(firstLayer);
      schedulePreloadBackgroundSrc(NODI_LOOP_VIDEO);
      schedulePreloadBackgroundSrc(INTELLECTUM_MAIN_IMAGE);
    })
    .catch(() => handleVideoError(NODI_INTRO_VIDEO));

  if (!useNativeTouchVideo) {
    requestAnimationFrame(renderFrame);
  }
}

const PRESETS_STORAGE_KEY = "intellectum-us-glass-presets";
const ACTIVE_PRESET_KEY = "intellectum-us-active-preset";
const DEFAULT_PRESET_ID = "user-5";
const LEFT_GLASS_SETTINGS_KEY = "intellectum-us-left-glass-settings";
const LEFT_GLASS_BLUR_LEGACY_KEY = "intellectum-us-left-glass-blur";

const BUILTIN_PRESETS = {
  "user-1": {
    id: "user-1",
    label: "Пользовательские параметры №1",
    blur: 10,
    shadow: 20,
    overlay: 100,
    panelDim: 30,
    panelColor: "#1a264c",
    textColor: "#ffffff",
    heroTextColor: "#ffffff",
    leadFieldOpacity: 70,
  },
  "user-2": {
    id: "user-2",
    label: "Пользовательские параметры №2",
    blur: 12,
    shadow: 20,
    overlay: 6,
    panelDim: 16,
    panelColor: "#cac6d2",
    textColor: "#413546",
    heroTextColor: "#0f1412",
    leadFieldOpacity: 58,
  },
  "user-3": {
    id: "user-3",
    label: "Настройка №3",
    blur: 10,
    shadow: 20,
    overlay: 4,
    panelDim: 14,
    panelColor: "#1a264c",
    textColor: "#343232",
    heroTextColor: "#3a3636",
    leadFieldOpacity: 64,
  },
  "user-4": {
    id: "user-4",
    label: "Настройка №4",
    blur: 5,
    shadow: 15,
    overlay: 0,
    panelDim: 10,
    panelColor: "#1a264c",
    textColor: "#000000",
    heroTextColor: "#000000",
    leadFieldOpacity: 64,
  },
  "user-5": {
    id: "user-5",
    label: "Настройка №5",
    blur: 50,
    shadow: 15,
    overlay: 0,
    panelDim: 10,
    panelColor: "#1a264c",
    textColor: "#000000",
    heroTextColor: "#000000",
    leadFieldOpacity: 64,
  },
};

const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

const bloomPage = document.querySelector(".bloom-page");
const heroStage = document.querySelector(".hero-stage");
const splitHeadline = document.querySelector("#site-hero-headline");
const splitHeadlineMirror = document.querySelector("#site-hero-headline-mirror");
const leftContent = document.querySelector(".left-content");
const leftContentGroup = document.querySelector(".left-content-group");
const PANEL_LAYOUT_MS = 1100;
let intellectumLayoutOn = false;

const updateHeroPanelArrowMode = (intellectum) => {
  const t = window.SiteI18n?.t;
  document.querySelectorAll(".hero-panel-arrow").forEach((btn) => {
    btn.dataset.dir = intellectum ? "-1" : "1";
    const key = intellectum ? "gallery.prev" : "gallery.next";
    btn.setAttribute("aria-label", t ? t(key) : intellectum ? "Previous product" : "Next product");
  });
};

document.addEventListener("site-language-change", () => {
  const intellectum = heroStage?.classList.contains("is-intellectum") ?? false;
  updateHeroPanelArrowMode(intellectum);
  updateLeadFormProduct(intellectum);
});

const updateHeadlineMirrorVisibility = (intellectum) => {
  splitHeadline?.setAttribute("aria-hidden", intellectum ? "true" : "false");
  splitHeadlineMirror?.setAttribute("aria-hidden", intellectum ? "false" : "true");
};

const updateLeadFormProduct = (intellectum) => {
  const t = window.SiteI18n?.t;
  if (!t) {
    return;
  }

  const prefix = intellectum ? "form.intellectum" : "form.nodi";
  const titleEl = document.getElementById("lead-form-title");
  const leadEl = document.querySelector(".lead-form__lead");

  if (titleEl) {
    titleEl.dataset.i18n = `${prefix}.title`;
    titleEl.textContent = t(titleEl.dataset.i18n);
  }

  if (leadEl) {
    leadEl.dataset.i18n = `${prefix}.lead`;
    leadEl.textContent = t(leadEl.dataset.i18n);
  }
};

const animatePanelMirror = (enableIntellectum) => {
  if (!leftContentGroup || !heroStage) {
    return;
  }

  const firstRect = leftContentGroup.getBoundingClientRect();
  heroStage.classList.toggle("is-intellectum", enableIntellectum);
  updateHeadlineMirrorVisibility(enableIntellectum);
  updateHeroPanelArrowMode(enableIntellectum);
  updateLeadFormProduct(enableIntellectum);
  const lastRect = leftContentGroup.getBoundingClientRect();
  const invertX = firstRect.left - lastRect.left;

  leftContentGroup.style.transition = "none";
  leftContentGroup.style.transform = `translateX(${invertX}px)`;
  leftContentGroup.getBoundingClientRect();

  requestAnimationFrame(() => {
    leftContentGroup.style.transition = `transform ${PANEL_LAYOUT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    leftContentGroup.style.transform = "";

    const cleanup = (event) => {
      if (event.propertyName !== "transform") {
        return;
      }

      leftContentGroup.style.transition = "";
      leftContentGroup.removeEventListener("transitionend", cleanup);
    };

    leftContentGroup.addEventListener("transitionend", cleanup);
  });
};

const setIntellectumLayout = (active) => {
  if (!heroStage || intellectumLayoutOn === active) {
    return;
  }

  intellectumLayoutOn = active;
  animatePanelMirror(active);
};

intellectumIntroLayoutHook = () => setIntellectumLayout(true);
intellectumLayoutOffHook = () => setIntellectumLayout(false);
const siteChrome = document.querySelector(".site-chrome");
const siteBrand = document.querySelector(".site-brand");
const siteNav = document.querySelector(".site-nav");
const siteActions = document.querySelector(".site-actions");
const innerActions = document.querySelector(".inner-actions");
const productGallery = document.querySelector(".product-gallery");
const presetSelect = document.getElementById("settings-preset");
const blurRange = document.getElementById("left-glass-blur");
const blurValue = document.getElementById("left-glass-blur-value");
const shadowRange = document.getElementById("left-glass-shadow");
const shadowValue = document.getElementById("left-glass-shadow-value");
const overlayRange = document.getElementById("video-overlay-strength");
const overlayValue = document.getElementById("video-overlay-strength-value");
const panelDimRange = document.getElementById("panel-dim-strength");
const panelDimValue = document.getElementById("panel-dim-strength-value");
const leadFieldOpacityRange = document.getElementById("lead-field-opacity");
const leadFieldOpacityValue = document.getElementById("lead-field-opacity-value");
const panelColorInput = document.getElementById("panel-tint-color");
const panelColorHex = document.getElementById("panel-tint-color-hex");
const textColorInput = document.getElementById("panel-text-color");
const textColorHex = document.getElementById("panel-text-color-hex");
const heroColorInput = document.getElementById("hero-text-color");
const heroColorHex = document.getElementById("hero-text-color-hex");
const saveGlassDefault = document.getElementById("save-left-glass-default");

const clamp = (value, min, max) => Math.min(max, Math.max(min, Math.round(value)));

const normalizeRange = (value, min, max, fallback) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  return clamp(num, min, max);
};

const normalizeHexColor = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (!HEX_COLOR_RE.test(withHash)) {
    return fallback;
  }

  return withHash.toLowerCase();
};

const normalizeSettings = (raw, fallback) => {
  const leadFromOpacity = normalizeRange(raw?.leadFieldOpacity, 0, 100, null);
  const leadFromIntensity = normalizeRange(raw?.leadFieldIntensity, 0, 100, null);

  return {
    blur: normalizeRange(raw?.blur, 0, 50, fallback.blur),
    shadow: normalizeRange(raw?.shadow, 0, 60, fallback.shadow),
    overlay: normalizeRange(raw?.overlay, 0, 100, fallback.overlay),
    panelDim: normalizeRange(raw?.panelDim, 0, 100, fallback.panelDim),
    leadFieldOpacity:
      leadFromOpacity !== null
        ? leadFromOpacity
        : leadFromIntensity !== null
          ? leadFromIntensity
          : fallback.leadFieldOpacity,
    panelColor: normalizeHexColor(raw?.panelColor, fallback.panelColor),
    textColor: normalizeHexColor(raw?.textColor, fallback.textColor),
    heroTextColor: normalizeHexColor(raw?.heroTextColor, fallback.heroTextColor),
  };
};

const readPresetsFromStorage = () => {
  const merged = {};

  Object.keys(BUILTIN_PRESETS).forEach((id) => {
    merged[id] = { ...BUILTIN_PRESETS[id] };
  });

  const savedJson = localStorage.getItem(PRESETS_STORAGE_KEY);

  if (savedJson) {
    try {
      const parsed = JSON.parse(savedJson);
      Object.keys(parsed).forEach((id) => {
        if (merged[id]) {
          merged[id] = {
            ...merged[id],
            ...parsed[id],
            id,
            label: parsed[id].label || merged[id].label,
          };
        } else if (parsed[id]?.label) {
          merged[id] = {
            ...normalizeSettings(parsed[id], BUILTIN_PRESETS["user-2"]),
            id,
            label: parsed[id].label,
          };
        }
      });
    } catch {
      // Keep built-in presets.
    }
  }

  return merged;
};

const writePresetsToStorage = (presets) => {
  const payload = {};

  Object.keys(presets).forEach((id) => {
    const preset = presets[id];
    payload[id] = {
      label: preset.label,
      blur: preset.blur,
      shadow: preset.shadow,
      overlay: preset.overlay,
      panelDim: preset.panelDim,
      leadFieldOpacity: preset.leadFieldOpacity,
      panelColor: preset.panelColor,
      textColor: preset.textColor,
      heroTextColor: preset.heroTextColor,
    };
  });

  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(payload));
};

const migrateLegacySettings = (presets) => {
  const legacyJson = localStorage.getItem(LEFT_GLASS_SETTINGS_KEY);

  if (!legacyJson || localStorage.getItem(PRESETS_STORAGE_KEY)) {
    return presets;
  }

  try {
    const legacy = JSON.parse(legacyJson);
    presets["user-2"] = {
      ...presets["user-2"],
      ...normalizeSettings(legacy, presets["user-2"]),
      label: presets["user-2"].label,
      id: "user-2",
    };
    writePresetsToStorage(presets);
  } catch {
    // Ignore invalid legacy data.
  }

  return presets;
};

const getActivePresetId = (presets) => {
  const savedId = localStorage.getItem(ACTIVE_PRESET_KEY);

  if (savedId && presets[savedId]) {
    return savedId;
  }

  return DEFAULT_PRESET_ID;
};

const applyLeftGlassSettings = (settings) => {
  const visualBlur = Math.round(settings.blur * 1.8);
  const backdropFilter = `blur(${visualBlur}px) saturate(${112 + settings.blur * 2}%) contrast(${104 + Math.round(
    settings.blur * 0.5
  )}%)`;

  [leftContent, siteChrome, siteBrand, siteNav, siteActions, innerActions, productGallery].forEach((el) => {
    if (!el) {
      return;
    }

    el.style.setProperty("--left-glass-backdrop-filter", backdropFilter);
    el.style.setProperty("--left-glass-shadow", String(settings.shadow));
    el.style.setProperty("--panel-dim-strength", String(settings.panelDim));
    el.style.setProperty("--panel-tint-color", settings.panelColor);
    el.style.setProperty("--panel-text-color", settings.textColor);
  });

  if (leftContent) {
    leftContent.style.setProperty("--left-glass-blur", `${settings.blur}px`);
    leftContent.style.setProperty("--lead-field-opacity", String(settings.leadFieldOpacity));
  }

  if (leftContentGroup) {
    leftContentGroup.style.setProperty("--panel-text-color", settings.textColor);
  }

  if (bloomPage) {
    bloomPage.style.setProperty("--video-overlay-strength", String(settings.overlay));
  }

  if (splitHeadline) {
    splitHeadline.style.setProperty("--hero-text-color", settings.heroTextColor);
  }

  if (splitHeadlineMirror) {
    splitHeadlineMirror.style.setProperty("--hero-text-color", settings.heroTextColor);
  }

  if (blurRange) {
    blurRange.value = String(settings.blur);
  }

  if (blurValue) {
    blurValue.textContent = `${settings.blur} px`;
  }

  if (shadowRange) {
    shadowRange.value = String(settings.shadow);
  }

  if (shadowValue) {
    shadowValue.textContent = String(settings.shadow);
  }

  if (overlayRange) {
    overlayRange.value = String(settings.overlay);
  }

  if (overlayValue) {
    overlayValue.textContent = `${settings.overlay}%`;
  }

  if (panelDimRange) {
    panelDimRange.value = String(settings.panelDim);
  }

  if (panelDimValue) {
    panelDimValue.textContent = `${settings.panelDim}%`;
  }

  if (leadFieldOpacityRange) {
    leadFieldOpacityRange.value = String(settings.leadFieldOpacity);
  }

  if (leadFieldOpacityValue) {
    leadFieldOpacityValue.textContent = `${settings.leadFieldOpacity}%`;
  }

  if (panelColorInput) {
    panelColorInput.value = settings.panelColor;
  }

  if (panelColorHex) {
    panelColorHex.value = settings.panelColor;
  }

  if (textColorInput) {
    textColorInput.value = settings.textColor;
  }

  if (textColorHex) {
    textColorHex.value = settings.textColor;
  }

  if (heroColorInput) {
    heroColorInput.value = settings.heroTextColor;
  }

  if (heroColorHex) {
    heroColorHex.value = settings.heroTextColor;
  }
};

const fillPresetSelect = (presets, activeId) => {
  if (!presetSelect) {
    return;
  }

  presetSelect.innerHTML = "";

  Object.keys(presets).forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = presets[id].label;
    presetSelect.appendChild(option);
  });

  presetSelect.value = activeId;
};

const bindColorControl = (colorInput, hexInput, applyColor) => {
  colorInput?.addEventListener("input", () => {
    const color = normalizeHexColor(colorInput.value, null);
    if (!color) {
      return;
    }
    applyColor(color);
  });

  hexInput?.addEventListener("change", () => {
    const color = normalizeHexColor(hexInput.value, null);
    if (!color) {
      hexInput.value = colorInput?.value ?? "";
      return;
    }
    applyColor(color);
  });

  hexInput?.addEventListener("input", () => {
    const color = normalizeHexColor(hexInput.value, null);
    if (!color) {
      return;
    }
    applyColor(color);
  });
};

const hasGlassChrome = Boolean(siteChrome || siteBrand || siteNav || siteActions || innerActions);
const hasGlassTuner =
  leftContent && blurRange && shadowRange && overlayRange && panelDimRange && leadFieldOpacityRange;

let glassPresets = null;
let glassActivePresetId = DEFAULT_PRESET_ID;
let glassSettings = normalizeSettings({}, BUILTIN_PRESETS[DEFAULT_PRESET_ID]);

const loadGlassSettings = () => {
  glassPresets = migrateLegacySettings(readPresetsFromStorage());

  if (!localStorage.getItem(PRESETS_STORAGE_KEY)) {
    writePresetsToStorage(glassPresets);
  }

  glassActivePresetId = getActivePresetId(glassPresets);
  glassSettings = normalizeSettings(
    glassPresets[glassActivePresetId],
    BUILTIN_PRESETS[DEFAULT_PRESET_ID]
  );

  if (!localStorage.getItem(ACTIVE_PRESET_KEY)) {
    localStorage.setItem(ACTIVE_PRESET_KEY, DEFAULT_PRESET_ID);
    glassActivePresetId = DEFAULT_PRESET_ID;
    glassSettings = normalizeSettings(
      glassPresets[glassActivePresetId],
      BUILTIN_PRESETS[DEFAULT_PRESET_ID]
    );
  }
};

if (hasGlassChrome || hasGlassTuner) {
  loadGlassSettings();
  applyLeftGlassSettings(glassSettings);
}

if (hasGlassTuner) {
  const presets = glassPresets;
  let activePresetId = glassActivePresetId;
  let settings = glassSettings;

  fillPresetSelect(presets, activePresetId);

  presetSelect?.addEventListener("change", () => {
    activePresetId = presetSelect.value;
    settings = normalizeSettings(presets[activePresetId], BUILTIN_PRESETS[DEFAULT_PRESET_ID]);
    localStorage.setItem(ACTIVE_PRESET_KEY, activePresetId);
    applyLeftGlassSettings(settings);
  });

  blurRange.addEventListener("input", () => {
    settings = { ...settings, blur: Number(blurRange.value) };
    applyLeftGlassSettings(settings);
  });

  shadowRange.addEventListener("input", () => {
    settings = { ...settings, shadow: Number(shadowRange.value) };
    applyLeftGlassSettings(settings);
  });

  overlayRange.addEventListener("input", () => {
    settings = { ...settings, overlay: Number(overlayRange.value) };
    applyLeftGlassSettings(settings);
  });

  panelDimRange.addEventListener("input", () => {
    settings = { ...settings, panelDim: Number(panelDimRange.value) };
    applyLeftGlassSettings(settings);
  });

  leadFieldOpacityRange.addEventListener("input", () => {
    settings = { ...settings, leadFieldOpacity: Number(leadFieldOpacityRange.value) };
    applyLeftGlassSettings(settings);
  });

  bindColorControl(panelColorInput, panelColorHex, (panelColor) => {
    settings = { ...settings, panelColor };
    applyLeftGlassSettings(settings);
  });

  bindColorControl(textColorInput, textColorHex, (textColor) => {
    settings = { ...settings, textColor };
    applyLeftGlassSettings(settings);
  });

  bindColorControl(heroColorInput, heroColorHex, (heroTextColor) => {
    settings = { ...settings, heroTextColor };
    applyLeftGlassSettings(settings);
  });

  saveGlassDefault?.addEventListener("click", () => {
    presets[activePresetId] = {
      ...presets[activePresetId],
      ...settings,
      id: activePresetId,
      label: presets[activePresetId].label,
    };
    writePresetsToStorage(presets);
    localStorage.setItem(ACTIVE_PRESET_KEY, activePresetId);

    saveGlassDefault.textContent = "Сохранено";
    saveGlassDefault.classList.add("is-saved");

    window.setTimeout(() => {
      saveGlassDefault.textContent = "Сохранить в набор";
      saveGlassDefault.classList.remove("is-saved");
    }, 1600);
  });
}

/* ---------- Lead form: focus email + shake submit when invalid ---------- */
const leadForm = document.getElementById("lead-form-body");
const leadEmailInput = leadForm?.querySelector('input[type="email"]');
const leadSubmitBtn = document.querySelector(".lead-form__submit");

const isLeadEmailValid = () =>
  Boolean(leadEmailInput?.value.trim() && leadEmailInput.checkValidity());

let leadFormToast = null;
let leadFormToastTimer = null;

const LEAD_TOAST_GLASS_VARS = [
  "--panel-tint-color",
  "--panel-dim-strength",
  "--panel-text-color",
  "--left-glass-shadow",
  "--left-glass-backdrop-filter",
];

const positionLeadFormToast = () => {
  if (!leadFormToast || !siteActions) {
    return;
  }

  const rect = siteActions.getBoundingClientRect();
  const gap = 9;
  leadFormToast.style.top = `${rect.bottom + gap}px`;
  leadFormToast.style.right = `${Math.max(0, window.innerWidth - rect.right)}px`;

  const hostStyle = getComputedStyle(siteActions);
  LEAD_TOAST_GLASS_VARS.forEach((prop) => {
    leadFormToast.style.setProperty(prop, hostStyle.getPropertyValue(prop));
  });
};

const onLeadFormToastReposition = () => {
  if (leadFormToast?.classList.contains("is-visible")) {
    positionLeadFormToast();
  }
};

window.addEventListener("resize", onLeadFormToastReposition, { passive: true });
window.addEventListener("scroll", onLeadFormToastReposition, { passive: true });

const showLeadFormSuccess = () => {
  const translate = window.SiteI18n?.t ?? ((key) => key);

  if (!leadFormToast) {
    leadFormToast = document.createElement("div");
    leadFormToast.className = "lead-form__toast liquid-glass";
    leadFormToast.setAttribute("role", "status");
    leadFormToast.setAttribute("aria-live", "polite");
    document.body.appendChild(leadFormToast);
  }

  leadFormToast.textContent = translate("form.success");
  positionLeadFormToast();
  leadFormToast.hidden = false;
  leadFormToast.classList.remove("is-visible");
  void leadFormToast.offsetWidth;
  leadFormToast.classList.add("is-visible");

  window.clearTimeout(leadFormToastTimer);
  leadFormToastTimer = window.setTimeout(() => {
    leadFormToast?.classList.remove("is-visible");
    window.setTimeout(() => {
      if (leadFormToast) {
        leadFormToast.hidden = true;
      }
    }, 320);
  }, 4200);
};

document.addEventListener("site-language-change", () => {
  if (leadFormToast?.classList.contains("is-visible")) {
    const translate = window.SiteI18n?.t ?? ((key) => key);
    leadFormToast.textContent = translate("form.success");
  }
});

const playLeadSubmitError = () => {
  if (!leadSubmitBtn) {
    return;
  }

  leadSubmitBtn.classList.remove("is-error");
  void leadSubmitBtn.offsetWidth;
  leadSubmitBtn.classList.add("is-error");
};

leadSubmitBtn?.addEventListener("animationend", (event) => {
  if (event.animationName === "lead-form-submit-shake") {
    leadSubmitBtn.classList.remove("is-error");
  }
});

/* ---------- Lead form: country list + custom location select ---------- */
const LEAD_COUNTRY_DEFAULT = "US";

const normalizeLeadCountryText = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();

const LEAD_LOCATION_MENU_ID = "lead-location-menu";

const populateLeadCountrySelect = (root) => {
  const menu = document.getElementById(LEAD_LOCATION_MENU_ID);
  const list = menu?.querySelector(".lead-form__select-list");
  const nativeSelect = root.querySelector(".lead-form__select-native");
  const valueEl = root.querySelector(".lead-form__select-value");
  const getCountries = window.getLeadCountries;
  const formatLabel = window.formatLeadCountryLabel;

  if (!menu || !list || !nativeSelect || !valueEl || typeof getCountries !== "function") {
    return false;
  }

  const countries = getCountries();
  const defaultCode = LEAD_COUNTRY_DEFAULT.toLowerCase();
  let defaultLabel = formatLabel?.(LEAD_COUNTRY_DEFAULT, "United States") || "US - United States";

  list.replaceChildren();
  nativeSelect.replaceChildren();

  countries.forEach(({ code, name }) => {
    const value = code.toLowerCase();
    const label = formatLabel?.(code, name) || `${code} - ${name}`;
    const isDefault = code === LEAD_COUNTRY_DEFAULT;

    if (isDefault) {
      defaultLabel = label;
    }

    const item = document.createElement("li");
    item.setAttribute("role", "option");
    item.dataset.value = value;
    item.dataset.code = code;
    item.dataset.name = name;
    item.dataset.label = label;
    item.tabIndex = -1;
    item.textContent = label;
    if (isDefault) {
      item.setAttribute("aria-selected", "true");
    }
    list.appendChild(item);

    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    if (isDefault) {
      option.selected = true;
    }
    nativeSelect.appendChild(option);
  });

  nativeSelect.value = defaultCode;
  valueEl.textContent = defaultLabel;
  return true;
};

const initLeadCountrySelect = (root) => {
  const field = root.closest(".lead-form__field--select");
  const trigger = root.querySelector(".lead-form__select-trigger");
  const menu = document.getElementById(LEAD_LOCATION_MENU_ID);
  const searchInput = menu?.querySelector(".lead-form__select-search");
  const list = menu?.querySelector(".lead-form__select-list");
  const emptyState = menu?.querySelector(".lead-form__select-empty");
  const valueEl = root.querySelector(".lead-form__select-value");
  const nativeSelect = root.querySelector(".lead-form__select-native");

  if (!field || !trigger || !menu || !searchInput || !list || !valueEl || !nativeSelect) {
    return;
  }

  if (menu.parentElement !== document.body) {
    document.body.appendChild(menu);
  }

  const panel = root.closest(".left-content");
  const leadFormBody = root.closest(".lead-form")?.querySelector(".lead-form__body");

  let options = Array.from(list.querySelectorAll('[role="option"]'));
  let isMenuOpen = false;
  let anchorUpdateQueued = false;

  const refreshOptions = () => {
    options = Array.from(list.querySelectorAll('[role="option"]'));
  };

  const getVisibleOptions = () =>
    options.filter((item) => !item.hidden);

  const countryMatchesQuery = (item, query) => {
    if (!query) {
      return true;
    }

    const haystack = normalizeLeadCountryText(
      `${item.dataset.label || ""} ${item.dataset.name || ""} ${item.dataset.code || ""}`
    );
    const tokens = normalizeLeadCountryText(query).split(/\s+/).filter(Boolean);

    return tokens.every((token) => haystack.includes(token));
  };

  const filterCountries = (query) => {
    let visibleCount = 0;

    options.forEach((item) => {
      const matches = countryMatchesQuery(item, query);
      item.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  };

  const resetCountryFilter = () => {
    searchInput.value = "";
    filterCountries("");
  };

  const syncMenuTheme = () => {
    if (!panel) {
      return;
    }

    const panelStyle = getComputedStyle(panel);
    const panelText = panelStyle.getPropertyValue("--panel-text-color").trim();
    const panelTint = panelStyle.getPropertyValue("--panel-tint-color").trim();

    if (panelText) {
      menu.style.setProperty("--lead-select-menu-text", panelText);
    }
    if (panelTint) {
      menu.style.setProperty("--panel-tint-color", panelTint);
      menu.style.setProperty(
        "--lead-select-menu-bg",
        `color-mix(in srgb, ${panelTint} 16%, rgba(255, 255, 255, 0.97))`
      );
    }
  };

  const scrollOptionInList = (option) => {
    if (!option) {
      return;
    }

    const optionTop = option.offsetTop;
    const optionBottom = optionTop + option.offsetHeight;
    const viewTop = list.scrollTop;
    const viewBottom = viewTop + list.clientHeight;

    if (optionTop < viewTop) {
      list.scrollTop = optionTop;
    } else if (optionBottom > viewBottom) {
      list.scrollTop = optionBottom - list.clientHeight;
    }
  };

  const positionCountryMenu = () => {
    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const viewportPadding = 8;
    const menuMaxHeight = Math.min(window.innerHeight * 0.44, 16 * 16);
    let top = rect.bottom + gap;
    let left = rect.left;
    let width = rect.width;

    if (top + menuMaxHeight > window.innerHeight - viewportPadding) {
      const aboveTop = rect.top - gap - menuMaxHeight;
      if (aboveTop >= viewportPadding) {
        top = aboveTop;
      } else {
        top = Math.max(viewportPadding, window.innerHeight - menuMaxHeight - viewportPadding);
      }
    }

    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - width - viewportPadding)
    );

    menu.style.position = "fixed";
    menu.style.right = "auto";
    menu.style.bottom = "auto";
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.width = `${width}px`;
  };

  const isTriggerOnScreen = () => {
    const rect = trigger.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const scheduleMenuAnchorUpdate = () => {
    if (!isMenuOpen || anchorUpdateQueued) {
      return;
    }

    anchorUpdateQueued = true;
    window.requestAnimationFrame(() => {
      anchorUpdateQueued = false;
      if (!isMenuOpen) {
        return;
      }

      if (!isTriggerOnScreen()) {
        setOpen(false);
        return;
      }

      positionCountryMenu();
    });
  };

  const clampLeadFormBodyScroll = () => {
    const body = root.closest(".lead-form")?.querySelector(".lead-form__body");
    if (!body) {
      return;
    }

    const maxScroll = body.scrollHeight - body.clientHeight;
    if (body.scrollTop > maxScroll) {
      body.scrollTop = maxScroll;
    }
  };

  const setOpen = (open) => {
    isMenuOpen = open;
    root.classList.toggle("is-open", open);
    field.classList.toggle("is-select-open", open);
    menu.classList.toggle("is-menu-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;

    if (open) {
      syncMenuTheme();
      resetCountryFilter();
      positionCountryMenu();
      window.requestAnimationFrame(() => {
        positionCountryMenu();
        searchInput.focus();
        const selected = list.querySelector('[role="option"][aria-selected="true"]:not([hidden])');
        scrollOptionInList(selected || getVisibleOptions()[0]);
      });
      return;
    }

    resetCountryFilter();
    menu.style.removeProperty("position");
    menu.style.removeProperty("top");
    menu.style.removeProperty("left");
    menu.style.removeProperty("width");
    menu.style.removeProperty("right");
    menu.style.removeProperty("bottom");
    window.requestAnimationFrame(clampLeadFormBodyScroll);
  };

  window.addEventListener("scroll", scheduleMenuAnchorUpdate, { capture: true, passive: true });
  window.addEventListener("resize", scheduleMenuAnchorUpdate, { passive: true });
  leadFormBody?.addEventListener("scroll", scheduleMenuAnchorUpdate, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleMenuAnchorUpdate);
    window.visualViewport.addEventListener("scroll", scheduleMenuAnchorUpdate);
  }

  const selectOption = (option) => {
    const value = option.dataset.value;
    const label = option.dataset.label || option.textContent?.trim() || "";

    options.forEach((item) => {
      item.setAttribute("aria-selected", String(item === option));
    });

    nativeSelect.value = value || "";
    valueEl.textContent = label;
    setOpen(false);
    trigger.focus();
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!isMenuOpen);
  });

  searchInput.addEventListener("input", () => {
    filterCountries(searchInput.value);
    scrollOptionInList(getVisibleOptions()[0]);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      trigger.focus();
      return;
    }

    if (event.key === "Enter") {
      const visible = getVisibleOptions();
      if (visible.length === 1) {
        event.preventDefault();
        selectOption(visible[0]);
      }
    }
  });

  list.addEventListener("click", (event) => {
    const option = event.target.closest('[role="option"]');
    if (!option || option.hidden) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selectOption(option);
  });

  list.addEventListener("keydown", (event) => {
    const option = event.target.closest('[role="option"]');
    if (!option || option.hidden) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(option);
    }
  });

  document.addEventListener("click", (event) => {
    if (!root.classList.contains("is-open")) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Node) || field.contains(target) || menu.contains(target)) {
      return;
    }
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("is-open")) {
      setOpen(false);
      trigger.focus();
    }
  });

  refreshOptions();
};

document.querySelectorAll("[data-lead-select]").forEach((root) => {
  populateLeadCountrySelect(root);
  initLeadCountrySelect(root);
});

leadForm?.addEventListener("submit", (event) => {
  if (!leadEmailInput || !leadSubmitBtn) {
    return;
  }

  event.preventDefault();

  if (isLeadEmailValid()) {
    showLeadFormSuccess();
    return;
  }

  leadEmailInput.focus({ preventScroll: false });
  leadEmailInput.scrollIntoView({ block: "nearest", behavior: "smooth" });
  playLeadSubmitError();
});

/* ---------- Site chrome + gallery: sync on scroll (30vh threshold) ---------- */
const NAV_MERGE_SCROLL_RATIO = 0.3;
const navMergeMode = siteChrome?.dataset.navMerge || "auto";
const heroStageForScroll = document.querySelector(".hero-stage");
let navMergeScrollThreshold = window.innerHeight * NAV_MERGE_SCROLL_RATIO;

const refreshNavMergeThreshold = () => {
  navMergeScrollThreshold =
    (heroStageForScroll?.offsetHeight || window.innerHeight) * NAV_MERGE_SCROLL_RATIO;
};

const updateSiteScrollUi = () => {
  const pastThreshold = window.scrollY > navMergeScrollThreshold;

  if (productGallery) {
    productGallery.classList.toggle("is-hidden", pastThreshold);
  }

  if (siteChrome && navMergeMode === "auto") {
    document.body.classList.toggle("is-nav-merged", pastThreshold);
  }
};

if (siteChrome && navMergeMode === "never") {
  document.body.classList.remove("is-nav-merged");
}

let siteScrollTicking = false;

refreshNavMergeThreshold();
window.addEventListener("orientationchange", () => {
  refreshNavMergeThreshold();
  updateSiteScrollUi();
});

if (siteChrome && navMergeMode === "auto") {
  window.addEventListener(
    "scroll",
    () => {
      if (!siteScrollTicking) {
        siteScrollTicking = true;
        window.requestAnimationFrame(() => {
          siteScrollTicking = false;
          updateSiteScrollUi();
        });
      }
    },
    { passive: true }
  );
  updateSiteScrollUi();
}

/* ---------- Product gallery: arrow selection + hide on scroll ---------- */
if (productGallery) {
  const cards = Array.from(productGallery.querySelectorAll(".product-gallery__card"));

  if (cards.length) {
    let activeIndex = 0;

    const setActive = (index) => {
      const total = cards.length;
      const nextIndex = ((index % total) + total) % total;

      if (nextIndex !== activeIndex) {
        onGalleryProductChange(activeIndex, nextIndex);
      }

      activeIndex = nextIndex;
      cards.forEach((card, i) => {
        card.classList.toggle("is-active", i === activeIndex);
      });
    };

    setActive(activeIndex);

    const bindProductStep = (arrow) => {
      arrow.addEventListener("click", () => {
        const dir = Number(arrow.dataset.dir) || 1;
        setActive(activeIndex + dir);
      });
    };

    productGallery.querySelectorAll(".product-gallery__arrow").forEach(bindProductStep);
    document.querySelectorAll(".hero-panel-arrow").forEach(bindProductStep);

    cards.forEach((card, i) => {
      card.addEventListener("click", () => setActive(i));
    });
  }
}

/* ---------- Bento showcase: mobile layout mode toggle ---------- */
const bentoShowcase = document.getElementById("bento-showcase");
const bentoModeButtons = bentoShowcase
  ? Array.from(bentoShowcase.querySelectorAll("[data-bento-mode]"))
  : [];

const setBentoShowcaseMode = (mode) => {
  if (!bentoShowcase || !mode) {
    return;
  }

  bentoShowcase.classList.remove("bento-showcase--app-grid", "bento-showcase--product-list");
  bentoShowcase.classList.add(`bento-showcase--${mode}`);

  bentoModeButtons.forEach((button) => {
    const isActive = button.dataset.bentoMode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

bentoModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setBentoShowcaseMode(button.dataset.bentoMode);
  });
});
