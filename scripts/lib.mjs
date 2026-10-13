// Shared helpers for the kit's commands. Plain Node (18+), no other installs, Mac and Windows.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const FPS = 30;

export const readJson = (p, fallback) =>
  fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback;
export const writeJson = (p, v) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
};
export const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};

export const brand = () => readJson(path.join(ROOT, "brand", "brand.json"));

/** Paths for one video. `work` = script, lines, takes. `pub` = media used in the video. `src` = code. */
export const paths = (slug) => ({
  work: path.join(ROOT, "work", slug),
  lines: path.join(ROOT, "work", slug, "lines.json"),
  meta: path.join(ROOT, "work", slug, "video.json"),
  takes: path.join(ROOT, "work", slug, "takes"),
  pub: path.join(ROOT, "public", slug),
  vo: path.join(ROOT, "public", slug, "vo"),
  src: path.join(ROOT, "src", "videos", slug),
  words: path.join(ROOT, "src", "videos", slug, "words"),
});

export const fail = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

export const need = (slug, usage) => {
  if (!slug) fail(`Which video? Usage: ${usage}`);
  if (!fs.existsSync(paths(slug).work))
    fail(
      `There's no video called "${slug}". Videos: ${listVideos().join(", ") || "(none yet)"}`,
    );
};

export const listVideos = () =>
  fs.existsSync(path.join(ROOT, "work"))
    ? fs
        .readdirSync(path.join(ROOT, "work"))
        .filter((d) => fs.existsSync(path.join(ROOT, "work", d, "video.json")))
    : [];

/** The ElevenLabs key from .env, or null. */
export const elevenKey = () => {
  // Windows Notepad likes to save ".env" as ".env.txt": accept either.
  const env = [".env", ".env.txt"]
    .map((f) => path.join(ROOT, f))
    .find((f) => fs.existsSync(f));
  if (!env) return null;
  const line = fs
    .readFileSync(env, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.startsWith("ELEVENLABS_API_KEY"));
  const k = line
    ?.split("=")[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");
  return k || null;
};

export const eleven = async (
  route,
  { key, method = "GET", json, form, raw = false } = {},
) => {
  const res = await fetch(`https://api.elevenlabs.io${route}`, {
    method,
    headers: {
      "xi-api-key": key,
      ...(json ? { "Content-Type": "application/json" } : {}),
    },
    body: json ? JSON.stringify(json) : form,
  });
  if (!res.ok) {
    const body = await res.text();
    let detail = body.slice(0, 300);
    try {
      const d = JSON.parse(body).detail;
      detail = typeof d === "string" ? d : d?.message || detail;
    } catch {}
    throw new Error(`ElevenLabs said ${res.status}: ${detail}`);
  }
  return raw ? Buffer.from(await res.arrayBuffer()) : res.json();
};

/** Characters left this month, and the plan name. */
export const credits = async (key) => {
  const s = await eleven("/v1/user/subscription", { key });
  return {
    left: s.character_limit - s.character_count,
    limit: s.character_limit,
    tier: s.tier,
    resets: s.next_character_count_reset_unix,
  };
};

/** "01-hook" -> "hook"; "02-how-it-works" -> "howItWorks". */
const RESERVED = new Set(
  "for if do new case class default delete else export import in is return switch this var void while with function const let".split(
    " ",
  ),
);
export const sceneId = (key) => {
  const p = key.replace(/^\d+-/, "").split("-");
  const c =
    p[0] +
    p
      .slice(1)
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join("");
  return RESERVED.has(c) ? c + "Scene" : c;
};
export const pascal = (s) =>
  s.replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_, __, c) => c.toUpperCase());

/** Run the Remotion command line (works the same on Mac and Windows). */
export const remotion = (args, { quiet = false } = {}) => {
  const cli = path.join(
    ROOT,
    "node_modules",
    "@remotion",
    "cli",
    "remotion-cli.js",
  );
  if (!fs.existsSync(cli))
    fail(
      'The kit isn\'t installed yet. Ask Claude: "Set me up" (it runs npm install).',
    );
  const r = spawnSync(process.execPath, [cli, ...args], {
    cwd: ROOT,
    stdio: quiet ? "pipe" : "inherit",
    encoding: "utf8",
  });
  if (r.status !== 0)
    fail(
      `Remotion failed: ${quiet ? (r.stderr || r.stdout || "").slice(-1500) : "see the output above"}`,
    );
  return r;
};

/**
 * Scene timings, the same maths as src/lib/voTimeline.ts.
 * Each scene = its clip up to the last spoken word + 0.25 s, then a gap.
 */
export const computeScenes = (slug) => {
  const P = paths(slug);
  const meta = readJson(P.meta);
  const lines = readJson(P.lines);
  const { lead = 12, gap = 15, tail = 90 } = meta.timing || {};
  let cursor = 0;
  const keys = Object.keys(lines);
  return keys.map((k, i) => {
    const words = readJson(path.join(P.words, `${k}.json`), null);
    if (!words)
      fail(`No voice yet for line ${k}. Run: npm run voice -- ${slug}`);
    const secs = Math.round(((words.at(-1)?.e ?? 1) + 0.25) * 100) / 100;
    const voFrames = Math.ceil(secs * FPS);
    const voFrom = i === 0 ? lead : 0;
    const dur = voFrom + voFrames + (i === keys.length - 1 ? tail : gap);
    const s = {
      key: k,
      id: sceneId(k),
      secs,
      from: cursor,
      dur,
      voFrom,
      voFrames,
      words,
    };
    cursor += dur;
    return s;
  });
};

/** Writes src/videos/<slug>/timeline.ts and cues.ts from the recorded (or silent) voice. */
export const writeTimeline = (slug) => {
  const P = paths(slug);
  const meta = readJson(P.meta);
  const scenes = computeScenes(slug);
  const { lead = 12, gap = 15, tail = 90 } = meta.timing || {};
  const silent = meta.silent === true;
  const rows = scenes
    .map(
      (s) =>
        `  { id: "${s.id}", file: ${silent ? "null" : `"${s.key}.mp3"`}, secs: ${s.secs} },`,
    )
    .join("\n");
  write(
    path.join(P.src, "timeline.ts"),
    `// Made by the kit from the voiceover. Don't edit: run "npm run voice -- ${slug}" or "npm run pick" instead.
import { buildTimeline } from "../../lib/voTimeline";

const VO = [
${rows}
] as const;

export type SceneId = (typeof VO)[number]["id"];

const t = buildTimeline<SceneId>(VO, { leadIn: ${lead}, gap: ${gap}, tail: ${tail} });

export const scenes = t.scenes;
export const scene = t.scene;
export const DURATION = t.duration;
`,
  );
  write(
    path.join(P.src, "cues.ts"),
    `// Made by the kit. cue("scene", "word") gives the frame in that scene where the word is spoken.
import { makeCue, Word } from "../../lib/voTimeline";
import { scene, SceneId } from "./timeline";
${scenes.map((s) => `import ${s.id} from "./words/${s.key}.json";`).join("\n")}

export const words: Record<SceneId, Word[]> = { ${scenes.map((s) => s.id).join(", ")} };

export const cue = makeCue<SceneId>(words, scene);
`,
  );
  const total = scenes.at(-1).from + scenes.at(-1).dur;
  return { scenes, total };
};

export const fmt = (frames) => {
  const s = Math.round(frames / FPS);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Rewrites src/videos/index.ts so every built video shows up in the Studio. */
export const writeRegistry = () => {
  const dir = path.join(ROOT, "src", "videos");
  const built = fs
    .readdirSync(dir)
    .filter((d) => fs.existsSync(path.join(dir, d, "video.ts")));
  const name = (d) => "v_" + d.replace(/[^a-zA-Z0-9]/g, "_");
  write(
    path.join(dir, "index.ts"),
    `// Made by the kit: every folder here with a video.ts. Don't edit by hand.
import type { VideoEntry } from "../lib/entry";
${built.map((d) => `import { video as ${name(d)} } from "./${d}/video";`).join("\n")}

export const videos: VideoEntry[] = [${built.map(name).join(", ")}];
`,
  );
};
