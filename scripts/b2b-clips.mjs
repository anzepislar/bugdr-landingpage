// Cuts the /b2b feature loops out of the product tour video.
//   FFMPEG=$(which ffmpeg) node scripts/b2b-clips.mjs bugdr-b2b.mp4
// Each clip drops the tour's caption band (it repeats the section heading),
// keeps the app window and its callouts, 1440×660 @30fps H.264 + a webp poster.
// Output in public/b2b/: clip-<name>.mp4, clip-<name>.webp
import { spawnSync } from "node:child_process";

const [src] = process.argv.slice(2);
const ff = process.env.FFMPEG ?? "ffmpeg";
if (!src) throw new Error("usage: node scripts/b2b-clips.mjs <tour.mp4>");
const out = new URL("../public/b2b/", import.meta.url).pathname;

// [name, start s, end s], timed between the tour's caption changes.
const CLIPS = [
  ["portal", 5.25, 10.75], // sign in + business agreement
  ["overview", 11.5, 14.75],
  ["codebase", 15.25, 24.75], // upload, AI writes problem, checks prove the bug
  ["room", 25.25, 33.75], // open a role, create a room, invite
  ["join", 34.25, 37.9],
  ["live", 38.75, 44.75],
  ["solve", 45.5, 50.75],
  ["watch", 51.25, 54.75],
  ["integrity", 55.25, 58.75],
  ["report", 59.25, 62.9],
  ["replay", 63.3, 65.75],
  ["shortlist", 67.5, 69.9],
  ["analytics", 70.25, 72.4],
  ["contest", 72.8, 74.9],
  ["employees", 75.3, 76.9],
  ["roles", 77.25, 78.9],
  ["audit", 79.25, 80.9],
];
const VF = "crop=1920:880:0:160,scale=1440:-2";

const run = (args) => {
  const r = spawnSync(ff, ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
};

for (const [name, a, b] of CLIPS) {
  run(["-ss", `${a}`, "-to", `${b}`, "-i", src, "-vf", `${VF},fps=30`, "-an",
    "-c:v", "libx264", "-crf", "27", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${out}clip-${name}.mp4`]);
  run(["-ss", `${Math.min(a + 1.5, b)}`, "-i", src, "-frames:v", "1", "-vf", VF,
    "-c:v", "libwebp", "-quality", "80", `${out}clip-${name}.webp`]);
}
console.log("done →", out);
