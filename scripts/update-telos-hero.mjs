import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(".");
const CURSOR_ASSETS = path.resolve(
  "C:/Users/Mardon/.cursor/projects/d-Projects-CursorAI-EduVector-IntellectumUS/assets",
);

const DESKTOP_SOURCE = path.join(
  CURSOR_ASSETS,
  "c__Users_Mardon_AppData_Roaming_Cursor_User_workspaceStorage_9856b9235b89d0fb40b1f5b00b222b3f_images_telos-user-5777308b-2f45-4cb8-a117-e73df10b4f6a.png",
);

const MOBILE_SOURCE = path.join(
  CURSOR_ASSETS,
  "c__Users_Mardon_AppData_Roaming_Cursor_User_workspaceStorage_9856b9235b89d0fb40b1f5b00b222b3f_images_telos-mob-eaa16341-8493-48af-9e48-c4dddc761703.png",
);

const HERO_DIR = path.join(ROOT, "assets/telos");
const HERO_PNG = path.join(HERO_DIR, "hero.png");
const HERO_MOBILE_PNG = path.join(HERO_DIR, "hero-mobile.png");

const HERO_WEBP_QUALITY = 95;

async function writePngMaster(inputPath, outputPath) {
  await sharp(inputPath).png({ compressionLevel: 6, effort: 7 }).toFile(outputPath);
}

async function writeHeroWebp(inputPath, prefix, widths) {
  const meta = await sharp(inputPath).metadata();

  await sharp(inputPath)
    .webp({ quality: HERO_WEBP_QUALITY, effort: 6, smartSubsample: false })
    .toFile(path.join(HERO_DIR, `${prefix}.webp`));

  for (const width of widths) {
    if (width > meta.width) {
      continue;
    }

    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: HERO_WEBP_QUALITY, effort: 6, smartSubsample: false })
      .toFile(path.join(HERO_DIR, `${prefix}-${width}.webp`));
  }
}

for (const source of [DESKTOP_SOURCE, MOBILE_SOURCE]) {
  if (!fs.existsSync(source)) {
    throw new Error(`Source image not found: ${source}`);
  }
}

await writePngMaster(DESKTOP_SOURCE, HERO_PNG);
await writePngMaster(MOBILE_SOURCE, HERO_MOBILE_PNG);

await writeHeroWebp(HERO_PNG, "hero", [800, 1024]);
await writeHeroWebp(HERO_MOBILE_PNG, "hero-mobile", [400, 576, 800]);

const desktopMeta = await sharp(HERO_PNG).metadata();
const mobileMeta = await sharp(HERO_MOBILE_PNG).metadata();

console.log(
  JSON.stringify(
    {
      desktop: { width: desktopMeta.width, height: desktopMeta.height },
      mobile: { width: mobileMeta.width, height: mobileMeta.height },
      webpQuality: HERO_WEBP_QUALITY,
    },
    null,
    2,
  ),
);
