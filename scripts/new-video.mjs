// Start a new video.
//   npm run new -- <slug> "<Title>" [--format landscape|portrait|square|feed]
// Creates work/<slug>/SCRIPT.md, lines.json and video.json. Write the script first, then
// put one line of voiceover per scene in lines.json and run: npm run voice -- <slug>
import fs from "node:fs";
import path from "node:path";
import { fail, paths, write, writeJson } from "./lib.mjs";

const args = process.argv.slice(2);
const flag = (n, d) =>
  args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d;
const [slug, title] = args.filter(
  (a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"),
);
const format = flag("format", "landscape");

if (!slug || !title)
  fail(
    'Usage: npm run new -- my-video "My video title" [--format landscape|portrait|square|feed]',
  );
if (!/^[a-z0-9-]+$/.test(slug))
  fail(
    `"${slug}" won't work as a name. Use lower case and dashes, e.g. spring-sale.`,
  );
if (!["landscape", "portrait", "square", "feed"].includes(format))
  fail(`Format must be landscape, portrait, square or feed (got "${format}").`);
const P = paths(slug);
if (fs.existsSync(P.meta))
  fail(
    `There's already a video called "${slug}" (work/${slug}). Pick another name.`,
  );

writeJson(P.meta, {
  slug,
  title,
  format,
  timing: { lead: 12, gap: 15, tail: 90 },
});
write(
  path.join(P.work, "SCRIPT.md"),
  `# ${title}: script v1 (draft)

Format: ${format} · Length: (target) · Voice: (from brand.json)

**The idea:** (one line: the single thing a viewer should remember)

| # | Voiceover | On screen | Source |
|---|---|---|---|
| 1 Hook | | | |

## Decided

## Accuracy notes (claims to check or avoid)

## Pictures needed
`,
);
writeJson(P.lines, { "01-hook": "", "02-close": "" });
console.log(`✓ Started "${title}" (work/${slug}).
Next: write work/${slug}/SCRIPT.md, then one voiceover line per scene in work/${slug}/lines.json.`);
