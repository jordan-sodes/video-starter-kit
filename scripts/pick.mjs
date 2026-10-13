// Use the takes the person chose, then re-time the video.
//   npm run pick -- <slug> 02B 05C
import fs from "node:fs";
import path from "node:path";
import { fail, need, paths, readJson } from "./lib.mjs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [slug, ...choices] = process.argv.slice(2);
need(slug, "npm run pick -- <slug> 02B 05C");
if (!choices.length)
  fail("Which takes? e.g. npm run pick -- " + slug + " 02B 05C");
const P = paths(slug);
const keys = Object.keys(readJson(P.lines));
const ids = [];
for (const c of choices) {
  const m = c.toUpperCase().match(/^(\d+)([ABC])$/);
  if (!m)
    fail(`"${c}" isn't a take. Use the line number and letter, e.g. 02B.`);
  const k = keys.find((x) => x.startsWith(m[1].padStart(2, "0")));
  const take = k && path.join(P.takes, `${k}-${m[2]}.mp3`);
  if (!take || !fs.existsSync(take))
    fail(
      `There's no take ${c}. Only lines with tricky words have A/B/C takes.`,
    );
  fs.copyFileSync(take, path.join(P.vo, `${k}.mp3`));
  ids.push(k);
  console.log(`  ${k}: using take ${m[2]}`);
}
// Re-transcribe the swapped clips (no new recording) and rebuild the timing.
const voice = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "voice.mjs",
);
const r = spawnSync(
  process.execPath,
  [voice, slug, "--retime", "--only", ids.join(",")],
  { stdio: "inherit" },
);
if (r.status !== 0) process.exit(r.status);
