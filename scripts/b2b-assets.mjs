// Builds the /b2b page assets from the raw product captures.
//   node scripts/b2b-assets.mjs /path/to/bugdr-b2b-rec
// Screenshots are 2880×1800 PNGs. Output in public/b2b/:
//   <name>-720.webp, <name>-1440.webp, <name>-2160.webp  full view
//   <name>-m.webp / <name>.webp                           panel crops (see shots.json)
//   og.png                                                1200×630 from 03
// Videos are copied as WebM and, if FFMPEG is set, also encoded to MP4 for Safari:
//   FFMPEG=$(which ffmpeg) node scripts/b2b-assets.mjs ...
import { mkdirSync, copyFileSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("usage: node scripts/b2b-assets.mjs <bugdr-b2b-rec dir>");
const out = new URL("../public/b2b/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

// Shot list + crop rects (x, y, w, h in source px) live in app/b2b/shots.json,
// which the page also reads for image dimensions.
//   { m: rect }    full view + a phone crop (<name>-m.webp)
//   { crop: rect } crop only (<name>.webp), used at every width
//   { src }        source PNG name when it differs from the key
const shots = JSON.parse(readFileSync(new URL("../app/b2b/shots.json", import.meta.url)));
const cut = (file, [left, top, width, height], to) =>
  sharp(file).extract({ left, top, width, height }).resize({ width: Math.min(width, 1200) })
    .webp({ quality: 84 }).toFile(to);

for (const [name, s] of Object.entries(shots)) {
  const file = `${src}/${s.src ?? name}.png`;
  if (s.crop) { await cut(file, s.crop, `${out}${name}.webp`); continue; }
  for (const w of [720, 1440, 2160]) {
    await sharp(file).resize(w).webp({ quality: 82 }).toFile(`${out}${name}-${w}.webp`);
  }
  if (s.m) await cut(file, s.m, `${out}${name}-m.webp`);
}

await sharp(`${src}/03-live-command-center.png`)
  .extract({ left: 446, top: 170, width: 2434, height: 1278 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(`${out}og.png`);

for (const v of ["rec-live-command-center", "rec-session-replay", "rec-contest-live-ranking"]) {
  copyFileSync(`${src}/${v}.webm`, `${out}${v}.webm`);
  if (process.env.FFMPEG) {
    const r = spawnSync(process.env.FFMPEG, ["-y", "-loglevel", "error", "-i", `${src}/${v}.webm`,
      "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
      `${out}${v}.mp4`], { stdio: "inherit" });
    if (r.status !== 0) throw new Error(`ffmpeg failed on ${v}`);
  }
}
console.log("done →", out);
