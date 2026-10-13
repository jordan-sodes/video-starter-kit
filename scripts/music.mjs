// Make a music bed with ElevenLabs Music, a little longer than the video.
//   npm run music -- <slug> "<what it should feel like>"
// Saves public/<slug>/music/bed.mp3 and turns it on in the video. Needs a paid ElevenLabs plan.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  computeScenes,
  eleven,
  elevenKey,
  fail,
  need,
  paths,
  ROOT,
  FPS,
} from "./lib.mjs";

const [slug, feel] = process.argv.slice(2);
need(slug, 'npm run music -- <slug> "calm, warm, confident"');
if (!feel)
  fail(
    "Describe the music, e.g. npm run music -- " +
      slug +
      ' "calm, warm acoustic, confident"',
  );
const key = elevenKey();
if (!key) fail("No ElevenLabs key yet (run: npm run doctor).");
const sc = computeScenes(slug);
const secs = Math.ceil((sc.at(-1).from + sc.at(-1).dur) / FPS) + 4;
const prompt = `Instrumental underscore for a short business video: ${feel}. No vocals. Even energy that sits under a voiceover, lifts a little in the last ten seconds and ends cleanly.`;
console.log(`Making ${secs}s of music…`);
let mp3;
try {
  mp3 = await eleven("/v1/music?output_format=mp3_44100_128", {
    key,
    method: "POST",
    json: { prompt, music_length_ms: secs * 1000 },
    raw: true,
  });
} catch (e) {
  fail(
    `${e.message}\n  Music needs a paid ElevenLabs plan. The video works fine without it.`,
  );
}
const out = path.join(paths(slug).pub, "music", "bed.mp3");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, mp3);
spawnSync(process.execPath, [path.join(ROOT, "scripts", "scenes.mjs"), slug], {
  stdio: "inherit",
});
console.log(
  `✓ Music saved (public/${slug}/music/bed.mp3) and added to the video.`,
);
