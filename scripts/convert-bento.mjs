import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WEBP_QUALITY = 90;
const DEFAULT_WIDTHS = [400, 800, 1200];

/** @type {{ dir: string; input: string; prefix: string; widths?: number[]; fullWebp?: boolean }[]} */
const sources = [
  { dir: "assets/intellectum/bento", input: "intellectum_25-24.png", prefix: "intellectum_25-24" },
  { dir: "assets/nodi/bento", input: "nodi_25-24.png", prefix: "nodi_25-24" },
  { dir: "assets/labo/bento", input: "labo_25-16.png", prefix: "labo_25-16" },
  { dir: "assets/neiry/bento", input: "neyri_25-16.png", prefix: "neyri_25-16" },
  { dir: "assets/neiry/bento", input: "neiry 11.png", prefix: "neiry-11" },
  { dir: "assets/pasco/bento", input: "pasco 25-24.png", prefix: "pasco_25-24" },
  { dir: "assets/pasco/bento", input: "pasco11.png", prefix: "pasco11" },
  { dir: "assets/telos/bento", input: "telos 1250-800.png", prefix: "telos_1250-800" },
  { dir: "assets/telos/bento", input: "telos-bento.png", prefix: "telos-bento" },
  {
    dir: "assets/hero",
    input: "hero-full.png",
    prefix: "hero-full",
    widths: [800, 1200, 1734],
    fullWebp: true,
  },
  {
    dir: "assets/hero",
    input: "hero-mobile.png",
    prefix: "hero-mobile",
    widths: [400, 800],
    fullWebp: true,
  },
];

const results = [];

for (const { dir, input, prefix, widths = DEFAULT_WIDTHS, fullWebp = false } of sources) {
  const root = path.resolve(dir);
  const inputPath = path.join(root, input);
  const meta = await sharp(inputPath).metadata();
  const originalBytes = fs.statSync(inputPath).size;

  results.push({
    file: path.join(dir, input),
    type: "original-png",
    width: meta.width,
    height: meta.height,
    bytes: originalBytes,
  });

  if (fullWebp) {
    const outName = `${prefix}.webp`;
    const outPath = path.join(root, outName);

    await sharp(inputPath).webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(outPath);

    const outMeta = await sharp(outPath).metadata();
    results.push({
      file: path.join(dir, outName),
      type: "webp-full",
      width: outMeta.width,
      height: outMeta.height,
      bytes: fs.statSync(outPath).size,
      source: input,
    });
  }

  for (const width of widths) {
    if (width > meta.width) {
      continue;
    }

    const outName = `${prefix}-${width}.webp`;
    const outPath = path.join(root, outName);

    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outPath);

    const outMeta = await sharp(outPath).metadata();

    results.push({
      file: path.join(dir, outName),
      type: "webp",
      width: outMeta.width,
      height: outMeta.height,
      bytes: fs.statSync(outPath).size,
      source: input,
    });
  }
}

console.log(JSON.stringify(results, null, 2));
