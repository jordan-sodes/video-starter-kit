// A contact sheet: stills from through the video tiled into one image, to check the
// layout before a full render. Claude should open the image and look at it.
//   npm run sheet -- <slug>                 two frames per scene
//   npm run sheet -- <slug> 120 480 900     these frames
// Output: out/sheets/<slug>.jpg
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { computeScenes, fail, need, pascal, ROOT } from "./lib.mjs";

const [slug, ...frameArgs] = process.argv.slice(2);
need(slug, "npm run sheet -- <slug> [frames…]");
let renderer, bundler;
try {
  renderer = await import("@remotion/renderer");
  bundler = await import("@remotion/bundler");
} catch {
  fail('The kit isn\'t installed yet. Ask Claude: "Set me up".');
}
const comp = pascal(slug);
let shots;
if (frameArgs.length) {
  shots = frameArgs.map((f) => ({ frame: +f, label: `frame ${f}` }));
} else {
  shots = computeScenes(slug).flatMap((s) => [
    { frame: s.from + Math.round(s.dur * 0.5), label: `${s.id} · mid` },
    { frame: s.from + s.dur - 14, label: `${s.id} · end` },
  ]);
}

process.stdout.write("Preparing… ");
const serveUrl = await bundler.bundle({
  entryPoint: path.join(ROOT, "src", "index.ts"),
});
const target = await renderer.selectComposition({
  serveUrl,
  id: comp,
  inputProps: {},
});
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sheet-"));
const images = [];
const failed = [];
for (const [i, s] of shots.entries()) {
  process.stdout.write(`${i + 1}/${shots.length} `);
  const out = path.join(tmp, `${i}.jpg`);
  try {
    await renderer.renderStill({
      serveUrl,
      composition: target,
      output: out,
      frame: Math.min(s.frame, target.durationInFrames - 1),
      imageFormat: "jpeg",
      jpegQuality: 80,
      scale: 0.5,
    });
    images.push(
      `data:image/jpeg;base64,${fs.readFileSync(out).toString("base64")}`,
    );
  } catch (e) {
    failed.push(`${s.label}: ${e.message.split("\n")[0]}`);
    images.push("");
  }
}
const portrait = target.height > target.width;
const cols = portrait ? 6 : 4;
const tileW = portrait ? 270 : 480;
const tileH = Math.round((tileW * target.height) / target.width);
const sheet = await renderer.selectComposition({
  serveUrl,
  id: "ContactSheet",
  inputProps: { images, labels: shots.map((s) => s.label), cols, tileW, tileH },
});
fs.mkdirSync(path.join(ROOT, "out", "sheets"), { recursive: true });
const output = path.join(ROOT, "out", "sheets", `${slug}.jpg`);
await renderer.renderStill({
  serveUrl,
  composition: sheet,
  output,
  imageFormat: "jpeg",
  jpegQuality: 85,
  inputProps: { images, labels: shots.map((s) => s.label), cols, tileW, tileH },
});
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n✓ ${path.relative(ROOT, output)}`);
if (failed.length)
  console.log(
    `\n✗ Some frames failed to draw (usually a cue word that isn't in the voiceover):\n  ${failed.join("\n  ")}`,
  );
