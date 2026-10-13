// Use the takes the person chose, then re-time the video. Free: nothing is re-recorded.
//   npm run pick -- <slug> 02B 05C
import fs from "node:fs";
import path from "node:path";
import { fail, fmt, need, paths, readJson, writeTimeline } from "./lib.mjs";

const [slug, ...choices] = process.argv.slice(2);
need(slug, "npm run pick -- <slug> 02B 05C");
if (!choices.length) fail(`Which takes? e.g. npm run pick -- ${slug} 02B 05C`);
const P = paths(slug);
const keys = Object.keys(readJson(P.lines));
for (const c of choices) {
  const m = c.toUpperCase().match(/^(\d+)([ABC])$/);
  if (!m)
    fail(`"${c}" isn't a take. Use the line number and letter, e.g. 02B.`);
  const k = keys.find((x) => x.startsWith(m[1].padStart(2, "0")));
  const take = k && path.join(P.takes, `${k}-${m[2]}`);
  if (!take || !fs.existsSync(`${take}.mp3`))
    fail(
      `There's no take ${c}. Only lines with tricky words have A/B/C takes.`,
    );
  fs.copyFileSync(`${take}.mp3`, path.join(P.vo, `${k}.mp3`));
  fs.copyFileSync(`${take}.json`, path.join(P.words, `${k}.json`));
  console.log(`  ${k}: using take ${m[2]}`);
}
const { total } = writeTimeline(slug);
console.log(`✓ Re-timed: the video runs ${fmt(total)}.`);
