// Record the voiceover: one clip per line of work/<slug>/lines.json, timed word by word.
//   npm run voice -- <slug>                  record every line (uses ElevenLabs credits)
//   npm run voice -- <slug> --only 03,05     re-record just those lines
//   npm run voice -- <slug> --silent         no voice: a timed draft with on-screen words only (free)
//
// Lines containing a word from "sayAs" in brand/brand.json get three takes to choose from:
//   A  spelled as written       B  spelled the "sayAs" way       C  "sayAs" again, different seed
// One API call per take: the audio comes back with its own word timings (works on free accounts).
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
const B = brand();
const lines = readJson(P.lines);
const meta = readJson(P.meta);
const wanted = (k) =>
  !only.length || only.some((o) => k === o || k.startsWith(o));

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
    if (!wanted(k)) continue;
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
    `No ElevenLabs key yet. Ask Claude: "Help me set up ElevenLabs". Or make a silent draft first: npm run voice -- ${slug} --silent`,
  );

const todo = Object.entries(lines).filter(([k]) => wanted(k));
const chars = todo.reduce((n, [, t]) => n + t.length * (tricky(t) ? 3 : 1), 0);
let c;
try {
  c = await credits(key);
} catch (e) {
  fail(`${e.message}\n  Run: npm run doctor`);
}
if (c.left < chars)
  fail(
    `This needs about ${chars.toLocaleString()} ElevenLabs credits but only ${c.left.toLocaleString()} are left this month (${c.tier} plan). Shorten the script, record fewer lines with --only, or upgrade at elevenlabs.io.`,
  );
console.log(
  `Recording ${todo.length} line(s): about ${chars.toLocaleString()} credits of the ${c.left.toLocaleString()} left on your ${c.tier} plan.\n`,
);

/** Speak `text`; returns the mp3 and word timings. `shown` is the script's spelling, used for the words. */
const speak = async (text, seed, shown) => {
  const d = await eleven(
    `/v1/text-to-speech/${B.voice.voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      key,
      method: "POST",
      json: { text, model_id: B.voice.model || "eleven_multilingual_v2", seed },
    },
  );
  const {
    characters: ch,
    character_start_times_seconds: st,
    character_end_times_seconds: en,
  } = d.alignment;
  const words = [];
  let cur = null;
  ch.forEach((x, i) => {
    if (/\s/.test(x)) {
      if (cur) words.push(cur);
      cur = null;
    } else if (!cur) cur = { w: x, s: st[i], e: en[i] };
    else {
      cur.w += x;
      cur.e = en[i];
    }
  });
  if (cur) words.push(cur);
  // Show the script's spelling, not the respelling from sayAs, when the word counts line up.
  const orig = shown.split(/\s+/).filter(Boolean);
  const out = words.map((w, i) => ({
    w: orig.length === words.length ? orig[i] : w.w,
    s: +w.s.toFixed(2),
    e: +w.e.toFixed(2),
  }));
  return { mp3: Buffer.from(d.audio_base64, "base64"), words: out };
};

const save = (base, r) => {
  fs.writeFileSync(`${base}.mp3`, r.mp3);
  writeJson(`${base}.json`, r.words);
};

try {
  for (const [k, t] of todo) {
    let used;
    if (tricky(t)) {
      const takes = {
        A: await speak(t, 11, t),
        B: await speak(respell(t), 11, t),
        C: await speak(respell(t), 22, t),
      };
      for (const [v, r] of Object.entries(takes))
        save(path.join(P.takes, `${k}-${v}`), r);
      used = takes.B;
    } else {
      used = await speak(t, 11, t);
    }
    fs.writeFileSync(path.join(P.vo, `${k}.mp3`), used.mp3);
    writeJson(path.join(P.words, `${k}.json`), used.words);
    const end = used.words.at(-1)?.e ?? 0;
    console.log(
      `  ${k.padEnd(18)} ${end.toFixed(1).padStart(5)}s  ${t}${tricky(t) ? "   (3 takes)" : ""}`,
    );
  }
} catch (e) {
  const free = /library voices|payment_required|free users/i.test(e.message);
  fail(
    `${e.message}\n  ` +
      (free
        ? "Free accounts can only use ElevenLabs' default voices through the kit. Run: npm run voices (it marks the ones that work on free)."
        : /unusual activity/i.test(e.message)
          ? "ElevenLabs has paused this free account (it happens when several free accounts sign up from one network). Try again from home or a phone hotspot, or upgrade."
          : "Check the key and the voice in brand/brand.json (run: npm run doctor)."),
  );
}

writeJson(P.meta, { ...meta, silent: false });
const { scenes, total } = writeTimeline(slug);
takesPage();
const after = await credits(key).catch(() => null);
console.log(`\n✓ Voice done. The video will run ${fmt(total)} (${scenes.length} scenes).${after ? ` ${after.left.toLocaleString()} credits left.` : ""}
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
        rows += `<div class=t><b>${v}</b><audio controls preload=none src="${k}-${v}.mp3?${Date.now()}"></audio><span>${d}</span></div>`;
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
