// Checks the kit is ready to make videos, and says in plain English how to fix anything that isn't.
//   npm run doctor
import fs from "node:fs";
import path from "node:path";
import { brand, credits, eleven, elevenKey, ROOT } from "./lib.mjs";

const ok = (m) => console.log(`  ✓ ${m}`);
const warn = (m, fix) =>
  console.log(`  ! ${m}${fix ? `\n      → ${fix}` : ""}`);
const bad = (m, fix) => {
  problems++;
  console.log(`  ✗ ${m}${fix ? `\n      → ${fix}` : ""}`);
};
let problems = 0;

console.log("\nChecking your video kit…\n");

// 1. Node
const major = +process.versions.node.split(".")[0];
if (major >= 18) ok(`Node ${process.versions.node}`);
else
  bad(
    `Node ${process.versions.node} is too old`,
    "Install the LTS version from https://nodejs.org, then quit and reopen Claude.",
  );

// 2. Packages
if (fs.existsSync(path.join(ROOT, "node_modules", "@remotion", "cli")))
  ok("Video tools installed");
else
  bad(
    "Video tools not installed yet",
    'Ask Claude: "Install the kit" (it runs npm install, about 2 minutes).',
  );

// 3. Brand
let B;
try {
  B = brand();
  const hex = /^#[0-9a-fA-F]{6}$/;
  const badColours = Object.entries(B.colors).filter(([, v]) => !hex.test(v));
  if (badColours.length)
    bad(
      `Colours that aren't #RRGGBB in brand/brand.json: ${badColours.map(([k]) => k).join(", ")}`,
      "Use six-digit hex codes like #3D5AFE.",
    );
  for (const k of ["onDark", "onLight"])
    if (!fs.existsSync(path.join(ROOT, "public", B.logo[k] ?? "")))
      bad(
        `Logo "${k}" is missing (public/${B.logo[k]})`,
        'Ask Claude: "Set up my brand" and give it your logo.',
      );
  const fontsTs = fs.readFileSync(
    path.join(ROOT, "src", "brand", "fonts.ts"),
    "utf8",
  );
  const loaded = fontsTs.match(/@remotion\/google-fonts\/(\w+)/)?.[1];
  if (loaded !== B.font.replace(/\s+/g, ""))
    bad(
      `brand.json says the font is "${B.font}" but the video loads "${loaded}"`,
      'Ask Claude: "Fix the font to match brand.json".',
    );
  if (B.name === "Your Company")
    warn(
      'Your brand isn\'t set up yet (it still says "Your Company")',
      'Ask Claude: "Set up my brand from <your website>".',
    );
  else ok(`Brand: ${B.name} (${B.font}, ${B.colors.primary})`);
} catch (e) {
  bad(
    `brand/brand.json can't be read: ${e.message}`,
    'Ask Claude: "Fix brand.json".',
  );
}

// 4. Voice
const key = elevenKey();
if (!key) {
  warn(
    "No ElevenLabs key (needed for the voiceover)",
    'Optional to start: videos work as silent drafts. To add one, ask Claude: "Help me add my ElevenLabs key".',
  );
} else {
  try {
    const c = await credits(key);
    const msg = `ElevenLabs connected: ${c.left.toLocaleString()} of ${c.limit.toLocaleString()} characters left this month (${c.tier} plan)`;
    if (c.left < 2000)
      warn(
        msg,
        "That's less than one short video. Top up at elevenlabs.io or wait for the monthly reset.",
      );
    else ok(msg + `. A 60-second video uses about 1,000–2,500.`);
    if (B?.voice?.voiceId) {
      try {
        const v = await eleven(`/v1/voices/${B.voice.voiceId}`, { key });
        ok(`Voice: ${v.name}`);
      } catch {
        bad(
          `The voice in brand/brand.json (${B.voice.voiceId}) isn't in your ElevenLabs account`,
          'Ask Claude: "Help me pick a voice". Library voices must be added to "My Voices" on elevenlabs.io first.',
        );
      }
    }
  } catch (e) {
    bad(
      `ElevenLabs didn't accept the key in .env (${e.message})`,
      "Copy the key again from elevenlabs.io → Developers → API Keys, and give it Text to Speech, Speech to Text, Voices and User access.",
    );
  }
}

// 5. Example
if (fs.existsSync(path.join(ROOT, "src", "videos", "example", "video.ts")))
  ok('Example video present (try: "Render the example video")');

console.log(
  problems
    ? `\n${problems} thing(s) to fix before making a video.\n`
    : "\nAll good. You're ready to make a video.\n",
);
process.exit(problems ? 1 : 0);
