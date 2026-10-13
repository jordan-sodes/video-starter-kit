// Record the voiceover: one clip per line of work/<slug>/lines.json, timed word by word.
//   npm run voice -- <slug>                  record every line (asks ElevenLabs; uses credits)
//   npm run voice -- <slug> --only 03,05     re-record just those lines
//   npm run voice -- <slug> --silent         no voice: a timed draft with on-screen words only (free)
//
// Lines containing a word from "sayAs" in brand/brand.json get three takes to choose from:
//   A  spelled as written       B  spelled the "sayAs" way       C  "sayAs" again, different seed
// Then it times the video and makes the listening page (work/<slug>/takes/index.html).
import fs from "node:fs";
import path from "node:path";
import {
  brand,
  credits,
  eleven,
  elevenKey,
  fail,
  fmt,
  need,
  paths,
  readJson,
  write,
  writeJson,
  writeTimeline,
} from "./lib.mjs";

const args = process.argv.slice(2);
const slug = args[0];
need(slug, "npm run voice -- <slug> [--only 03,05] [--silent]");
const P = paths(slug);
const only = (args.includes("--only") ? args[args.indexOf("--only") + 1] : "")
  .split(",")
  .filter(Boolean);
const silent = args.includes("--silent");
const retime = args.includes("--retime");
const B = brand();
const lines = readJson(P.lines);
const meta = readJson(P.meta);
const pick = (k) =>
  !only.length ||
  only.some((o) => k === o || k.startsWith(`${o}-`) || k.startsWith(o));

const empty = Object.entries(lines).filter(([, t]) => !t.trim());
if (empty.length)
  fail(
    `These lines in work/${slug}/lines.json are empty: ${empty.map(([k]) => k).join(", ")}. Fill them in (or delete them) first.`,
  );

const sayAs = B.sayAs || {};
const respell = (t) =>
  Object.entries(sayAs).reduce((s, [w, r]) => s.replaceAll(w, r), t);
const tricky = (t) => Object.keys(sayAs).some((w) => t.includes(w));

for (const d of [P.vo, P.takes, P.words]) fs.mkdirSync(d, { recursive: true });

if (silent) {
  // Rough timings at ~150 words a minute, with pauses at commas and full stops.
  for (const [k, t] of Object.entries(lines)) {
    if (!pick(k)) continue;
    let s = 0;
    const words = t
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => {
        const d = 0.32 + w.length * 0.015;
        const out = { w, s: +s.toFixed(2), e: +(s + d).toFixed(2) };
        s += d + (/[,;:]$/.test(w) ? 0.25 : /[.!?]$/.test(w) ? 0.45 : 0.05);
        return out;
      });
    writeJson(path.join(P.words, `${k}.json`), words);
  }
  writeJson(P.meta, { ...meta, silent: true });
  const { total } = writeTimeline(slug);
  console.log(
    `✓ Silent draft timed: ${fmt(total)}. No voice yet. Record it later with: npm run voice -- ${slug}`,
  );
  process.exit(0);
}

const key = elevenKey();
if (!key)
  fail(
    'No ElevenLabs key yet. Ask Claude: "Help me add my ElevenLabs key". Or make a silent draft first: npm run voice -- ' +
      slug +
      " --silent",
  );

const todo = Object.entries(lines).filter(([k]) => pick(k));
const chars = retime
  ? 0
  : todo.reduce((n, [, t]) => n + t.length * (tricky(t) ? 3 : 1), 0);
if (chars) {
  const c = await credits(key);
  if (c.left < chars)
    fail(
      `This needs about ${chars} ElevenLabs characters but only ${c.left} are left this month (${c.tier} plan). Top up, or record fewer lines with --only.`,
    );
  console.log(
    `Recording ${todo.length} line(s), about ${chars} characters (${c.left} left on your ${c.tier} plan).\n`,
  );
}

const tts = async (text, seed) =>
  eleven(`/v1/text-to-speech/${B.voice.voiceId}?output_format=mp3_44100_128`, {
    key,
    method: "POST",
    json: { text, model_id: B.voice.model || "eleven_multilingual_v2", seed },
    raw: true,
  });

const transcribe = async (file) => {
  const form = new FormData();
  form.append("model_id", "scribe_v1");
  form.append("file", new Blob([fs.readFileSync(file)]), path.basename(file));
  const d = await eleven("/v1/speech-to-text", { key, method: "POST", form });
  const words = d.words
    .filter((w) => w.type === "word")
    .map((w) => ({ w: w.text, s: +w.start.toFixed(2), e: +w.end.toFixed(2) }));
  return { said: d.text, words };
};

try {
  for (const [k, t] of todo) {
    const clip = path.join(P.vo, `${k}.mp3`);
    if (!retime) {
      if (tricky(t)) {
        fs.writeFileSync(path.join(P.takes, `${k}-A.mp3`), await tts(t, 11));
        fs.writeFileSync(
          path.join(P.takes, `${k}-B.mp3`),
          await tts(respell(t), 11),
        );
        fs.writeFileSync(
          path.join(P.takes, `${k}-C.mp3`),
          await tts(respell(t), 22),
        );
        fs.copyFileSync(path.join(P.takes, `${k}-B.mp3`), clip);
      } else {
        fs.writeFileSync(clip, await tts(t, 11));
      }
    }
    const { said, words } = await transcribe(clip);
    writeJson(path.join(P.words, `${k}.json`), words);
    const end = words.at(-1)?.e ?? 0;
    const flag =
      said.trim().endsWith("?") && !t.trim().endsWith("?")
        ? "   ⚠ sounds like a question: re-record with a different seed"
        : "";
    console.log(
      `  ${k.padEnd(18)} ${end.toFixed(1).padStart(5)}s  ${said}${tricky(t) ? "   (3 takes)" : ""}${flag}`,
    );
  }
} catch (e) {
  fail(
    `${e.message}\n  Check the key and the voice in brand/brand.json (run: npm run doctor).`,
  );
}

writeJson(P.meta, { ...meta, silent: false });
const { scenes, total } = writeTimeline(slug);
takesPage();
console.log(`\n✓ Voice done. The video will run ${fmt(total)} (${scenes.length} scenes).
Listen: start "takes" in the browser pane, then open http://localhost:8765/${slug}/takes/index.html`);

function takesPage() {
  let rows = "";
  const picks = [];
  for (const [k, t] of Object.entries(lines)) {
    rows += `<section><h2>${k}</h2><p class=line>${t.replace(/</g, "&lt;")}</p>`;
    if (fs.existsSync(path.join(P.takes, `${k}-A.mp3`))) {
      picks.push(k.slice(0, 2));
      for (const [v, d] of [
        ["A", "As written"],
        ["B", "Spelled out (in the video now)"],
        ["C", "Spelled out, another read"],
      ])
        rows += `<div class=t><b>${v}</b><audio controls preload=none src="${k}-${v}.mp3"></audio><span>${d}</span></div>`;
    } else {
      fs.copyFileSync(
        path.join(P.vo, `${k}.mp3`),
        path.join(P.takes, `${k}.mp3`),
      );
      rows += `<div class=t><b>·</b><audio controls preload=none src="${k}.mp3?${Date.now()}"></audio><span>Single take</span></div>`;
    }
    rows += "</section>";
  }
  const ask = picks.length
    ? `Tell Claude which take you like for ${picks.join(", ")}, e.g. "${picks.map((p) => p + "B").join(" ")}". `
    : "";
  write(
    path.join(P.takes, "index.html"),
    `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>${meta.title}: voiceover</title>
<style>body{font:16px system-ui,sans-serif;background:${B.colors.dark};color:#fff;max-width:900px;margin:40px auto;padding:0 16px}h1{font-size:26px}h2{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:${B.colors.primaryLight};margin:28px 0 4px}.line{margin:0 0 10px;font-size:18px}.t{display:flex;align-items:center;gap:14px;margin:6px 0}.t b{width:18px}span{color:#ffffffaa;font-size:14px}audio{height:36px}button{background:${B.colors.primary};color:#fff;border:0;border-radius:999px;padding:12px 22px;font:600 16px system-ui;cursor:pointer}</style>
<h1>${meta.title}: voiceover</h1><p><button id=all>▶ Play the whole thing</button></p><p>${ask}Anything you'd like said differently? Tell Claude the line number and what to change.</p>${rows}
<script>document.getElementById('all').onclick=()=>{const as=[...document.querySelectorAll('section')].map(s=>s.querySelector('audio'));let i=0;const next=()=>{if(i>=as.length)return;const a=as[i++];a.currentTime=0;a.play();a.onended=()=>setTimeout(next,400)};next()}</script>`,
  );
}
