// Create the video's code once the voice exists: one placeholder scene per line, plus the
// master file, and add it to the Studio.
//   npm run scenes -- <slug>
// Safe to re-run: existing scene files are never overwritten (new lines get new scenes).
import fs from "node:fs";
import path from "node:path";
import {
  computeScenes,
  fmt,
  need,
  pascal,
  paths,
  readJson,
  write,
  writeRegistry,
  writeTimeline,
} from "./lib.mjs";

const slug = process.argv[2];
need(slug, "npm run scenes -- <slug>");
const P = paths(slug);
const meta = readJson(P.meta);
const scenes = computeScenes(slug);
const comp = pascal(slug);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9&']/g, "");
let made = 0;

for (const s of scenes) {
  const C = s.id[0].toUpperCase() + s.id.slice(1);
  const f = path.join(P.src, "scenes", `${C}.tsx`);
  if (fs.existsSync(f)) continue;
  const first = norm(s.words[0]?.w ?? "");
  write(
    f,
    `import React from "react";
import { Headline, Stage } from "../../../components";
import { cue } from "../cues";

/** Placeholder. Voiceover: "${s.words
      .map((w) => w.w)
      .join(" ")
      .replace(/"/g, "'")}" */
export const ${C}: React.FC = () => (
  <Stage eyebrow="${s.id}">
    <div style={{ position: "absolute", left: 110, top: 420 }}>
      <Headline title="${s.id}" at={cue("${s.id}", "${first}")} />
    </div>
  </Stage>
);
`,
  );
  made++;
}

const imports = scenes.map((s) => {
  const C = s.id[0].toUpperCase() + s.id.slice(1);
  return [s.id, C];
});
write(
  path.join(P.src, `${comp}.tsx`),
  `// Made by the kit (npm run scenes). Add music with: music="music/bed.mp3"
import React from "react";
import { Video } from "../../lib/Video";
import { scenes, SceneId } from "./timeline";
${imports.map(([, C]) => `import { ${C} } from "./scenes/${C}";`).join("\n")}

const components: Record<SceneId, React.FC> = {
${imports.map(([id, C]) => `  ${id}: ${C},`).join("\n")}
};

/** ${meta.title} */
export const ${comp}: React.FC = () => <Video slug="${slug}" scenes={scenes} components={components}${fs.existsSync(path.join(P.pub, "music", "bed.mp3")) ? ' music="music/bed.mp3"' : ""} />;
`,
);
write(
  path.join(P.src, "video.ts"),
  `import type { VideoEntry } from "../../lib/entry";
import { ${comp} } from "./${comp}";
import { DURATION } from "./timeline";

export const video: VideoEntry = { id: "${comp}", component: ${comp}, durationInFrames: DURATION, format: "${meta.format}" };
`,
);
const { total } = writeTimeline(slug);
writeRegistry();
console.log(`✓ ${comp}: ${scenes.length} scenes (${made} new placeholders), ${fmt(total)} long.
It's in the Studio as "${comp}". Build each scene in src/videos/${slug}/scenes/.`);
