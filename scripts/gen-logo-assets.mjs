import sharp from "sharp";

const src = "assets/icon/intellectum-256.png";
const sizes = [128, 256];
const formats = [
  ["webp", { quality: 85 }],
  ["png", { compressionLevel: 9 }],
];

for (const size of sizes) {
  for (const [format, options] of formats) {
    const out = `assets/icon/intellectum-${size}.${format}`;
    await sharp(src)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      [format](options)
      .toFile(out);
    console.log("created", out);
  }
}
