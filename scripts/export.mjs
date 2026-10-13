// Render the finished video and make the two files people share:
//   exports/<Name> (full).mp4      full quality: website, YouTube, presentations
//   exports/<Name> (phone).mp4     smaller: email, WhatsApp, text messages
//   npm run export -- <slug> "<Name>"        e.g. npm run export -- spring-sale "Spring sale v1"
import fs from "node:fs";
import path from "node:path";
import {
  credits,
  elevenKey,
  need,
  pascal,
  readJson,
  paths,
  remotion,
  ROOT,
} from "./lib.mjs";

const [slug, nameArg] = process.argv.slice(2);
need(slug, 'npm run export -- <slug> "<Name>"');
const name = (nameArg || readJson(paths(slug).meta).title).replace(
  /[\\/:*?"<>|]/g,
  "-",
);
const comp = pascal(slug);
fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "exports"), { recursive: true });
const raw = path.join("out", `${slug}.mp4`);
const full = path.join("exports", `${name} (full).mp4`);
const phone = path.join("exports", `${name} (phone).mp4`);

remotion(["render", comp, raw]);
fs.copyFileSync(path.join(ROOT, raw), path.join(ROOT, full));
remotion(
  [
    "ffmpeg",
    "-loglevel",
    "error",
    "-y",
    "-i",
    raw,
    "-vf",
    "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'",
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "25",
    "-preset",
    "slow",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    phone,
  ],
  { quiet: true },
);
const mb = (f) =>
  (fs.statSync(path.join(ROOT, f)).size / 1e6).toFixed(1) + " MB";
console.log(
  `\n✓ Ready to share:\n  ${full}  (${mb(full)})\n  ${phone}  (${mb(phone)})`,
);
// Free ElevenLabs voices are for practice only.
const key = elevenKey();
if (key && !readJson(paths(slug).meta).silent) {
  const c = await credits(key).catch(() => null);
  if (c?.tier === "free")
    console.log(`\n! The voice was made on a free ElevenLabs plan: fine for practice and sharing with friends,
  not for business use. Credit "elevenlabs.io" if you post it. To use it for your business, upgrade
  (Starter, about US$6/month), then ask Claude to "re-record the voice and export again".`);
}
