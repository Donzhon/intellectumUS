import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");

const moves = [
  // Bento: intellectum
  ["assets/intellectum_25-24.png", "assets/intellectum/bento/intellectum_25-24.png"],
  ["assets/intellectum_25-24-400.webp", "assets/intellectum/bento/intellectum_25-24-400.webp"],
  ["assets/intellectum_25-24-800.webp", "assets/intellectum/bento/intellectum_25-24-800.webp"],
  ["assets/intellectum_25-24-1200.webp", "assets/intellectum/bento/intellectum_25-24-1200.webp"],

  // Bento: nodi
  ["assets/nodi_25-24.png", "assets/nodi/bento/nodi_25-24.png"],
  ["assets/nodi_25-24-400.webp", "assets/nodi/bento/nodi_25-24-400.webp"],
  ["assets/nodi_25-24-800.webp", "assets/nodi/bento/nodi_25-24-800.webp"],
  ["assets/nodi_25-24-1200.webp", "assets/nodi/bento/nodi_25-24-1200.webp"],

  // Bento: labo (equipment)
  ["assets/labo_25-16.png", "assets/labo/bento/labo_25-16.png"],
  ["assets/labo_25-16-400.webp", "assets/labo/bento/labo_25-16-400.webp"],
  ["assets/labo_25-16-800.webp", "assets/labo/bento/labo_25-16-800.webp"],
  ["assets/labo_25-16-1200.webp", "assets/labo/bento/labo_25-16-1200.webp"],

  // Bento: neiry
  ["assets/neiry/neiry 11.png", "assets/neiry/bento/neiry 11.png"],
  ["assets/neiry/neyri_25-16.png", "assets/neiry/bento/neyri_25-16.png"],
  ["assets/neiry/neiry-11-400.webp", "assets/neiry/bento/neiry-11-400.webp"],
  ["assets/neiry/neiry-11-800.webp", "assets/neiry/bento/neiry-11-800.webp"],
  ["assets/neiry/neiry-11-1200.webp", "assets/neiry/bento/neiry-11-1200.webp"],
  ["assets/neiry/neyri_25-16-400.webp", "assets/neiry/bento/neyri_25-16-400.webp"],
  ["assets/neiry/neyri_25-16-800.webp", "assets/neiry/bento/neyri_25-16-800.webp"],
  ["assets/neiry/neyri_25-16-1200.webp", "assets/neiry/bento/neyri_25-16-1200.webp"],

  // Bento: pasco
  ["assets/pasco/pasco 25-24.png", "assets/pasco/bento/pasco 25-24.png"],
  ["assets/pasco/pasco11.png", "assets/pasco/bento/pasco11.png"],
  ["assets/pasco/pasco_25-24-400.webp", "assets/pasco/bento/pasco_25-24-400.webp"],
  ["assets/pasco/pasco_25-24-800.webp", "assets/pasco/bento/pasco_25-24-800.webp"],
  ["assets/pasco/pasco_25-24-1200.webp", "assets/pasco/bento/pasco_25-24-1200.webp"],
  ["assets/pasco/pasco11-400.webp", "assets/pasco/bento/pasco11-400.webp"],
  ["assets/pasco/pasco11-800.webp", "assets/pasco/bento/pasco11-800.webp"],
  ["assets/pasco/pasco11-1200.webp", "assets/pasco/bento/pasco11-1200.webp"],

  // Bento: telos
  ["assets/telos/telos 1250-800.png", "assets/telos/bento/telos 1250-800.png"],
  ["assets/telos/telos-bento.png", "assets/telos/bento/telos-bento.png"],
  ["assets/telos/telos_1250-800-400.webp", "assets/telos/bento/telos_1250-800-400.webp"],
  ["assets/telos/telos_1250-800-800.webp", "assets/telos/bento/telos_1250-800-800.webp"],
  ["assets/telos/telos_1250-800-1200.webp", "assets/telos/bento/telos_1250-800-1200.webp"],
  ["assets/telos/telos-bento-400.webp", "assets/telos/bento/telos-bento-400.webp"],
  ["assets/telos/telos-bento-800.webp", "assets/telos/bento/telos-bento-800.webp"],

  // Page heroes
  ["assets/video/intellectum.jpg", "assets/intellectum/hero.jpg"],
  ["assets/intellectumuc-pc.jpg", "assets/nodi/hero.jpg"],
  ["assets/Pasco-home-page-science-stem.jpg", "assets/telos/hero.jpg"],
];

const unusedMoves = [
  ["assets/Cycle of Vitality.jpg", "assets/unused/Cycle of Vitality.jpg"],
  ["assets/hero/full-mob.png", "assets/unused/hero/full-mob.png"],
  ["assets/hero/hero-1080×720.png", "assets/unused/hero/hero-1080×720.png"],
  ["assets/hero/hero-perple.png", "assets/unused/hero/hero-perple.png"],
  ["assets/intellectum.png", "assets/unused/intellectum.png"],
  ["assets/intellectum_11-5.png", "assets/unused/intellectum_11-5.png"],
  ["assets/intellectum_25-16.png", "assets/unused/intellectum_25-16.png"],
  ["assets/intellectum_3-2.png", "assets/unused/intellectum_3-2.png"],
  ["assets/intellectum-1.mp4", "assets/unused/intellectum-1.mp4"],
  ["assets/intellectumus-mob.jpg", "assets/unused/intellectumus-mob.jpg"],
  ["assets/neyri.png", "assets/unused/neyri.png"],
  ["assets/nodi.png", "assets/unused/nodi.png"],
  ["assets/nodi_3-2.png", "assets/unused/nodi_3-2.png"],
  ["assets/neiry/neyri_11-5.png", "assets/unused/neiry/neyri_11-5.png"],
  ["assets/og/og-image2.png", "assets/unused/og/og-image2.png"],
  ["assets/og/og-image4.png", "assets/unused/og/og-image4.png"],
  ["assets/og/og-imagePRO.png", "assets/unused/og/og-imagePRO.png"],
  ["assets/pasco/pasco_25-24.png", "assets/unused/pasco/pasco_25-24.png"],
  ["assets/pasco/pasco_5-8.png", "assets/unused/pasco/pasco_5-8.png"],
  ["assets/video/mobile-video/intellectum-2.jpg", "assets/unused/video/intellectum-2.jpg"],
  ["assets/Intellectum logoguide (3).pdf", "assets/unused/Intellectum logoguide (3).pdf"],
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function moveFile(from, to) {
  const src = path.join(ROOT, from);
  const dest = path.join(ROOT, to);
  if (!fs.existsSync(src)) {
    console.warn("skip missing:", from);
    return;
  }
  ensureDir(dest);
  fs.renameSync(src, dest);
  console.log("moved:", from, "->", to);
}

for (const [from, to] of moves) {
  moveFile(from, to);
}

for (const [from, to] of unusedMoves) {
  moveFile(from, to);
}

// Move unused icon SVGs if present
for (const icon of ["assets/icon/eduvector.svg", "assets/icon/favicon.svg"]) {
  if (fs.existsSync(path.join(ROOT, icon))) {
    moveFile(icon, icon.replace("assets/icon/", "assets/unused/icon/"));
  }
}

console.log("done");
