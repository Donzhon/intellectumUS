import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("assets/neiry");
const WEBP_QUALITY = 90;
const WIDTHS = [400, 800, 1200];

const sources = [
  { input: "neyri_25-16.png", prefix: "neyri_25-16" },
  { input: "neiry 11.png", prefix: "neiry-11" },
];

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const results = [];

for (const { input, prefix } of sources) {
  const inputPath = path.join(ROOT, input);
  const meta = await sharp(inputPath).metadata();
  const originalBytes = fs.statSync(inputPath).size;

  results.push({
    file: input,
    type: "original-png",
    width: meta.width,
    height: meta.height,
    bytes: originalBytes,
  });

  for (const width of WIDTHS) {
    if (width > meta.width) {
      continue;
    }

    const outName = `${prefix}-${width}.webp`;
    const outPath = path.join(ROOT, outName);

    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outPath);

    const outMeta = await sharp(outPath).metadata();
    const outBytes = fs.statSync(outPath).size;

    results.push({
      file: outName,
      type: "webp",
      width: outMeta.width,
      height: outMeta.height,
      bytes: outBytes,
      source: input,
    });
  }
}

console.log(JSON.stringify(results, null, 2));
