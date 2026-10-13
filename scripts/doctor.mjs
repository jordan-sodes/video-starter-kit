// Checks the kit is ready to make videos, and says in plain English how to fix anything that isn't.
//   npm run doctor             quick check (free)
//   npm run doctor -- --voice  also says one word with the voice, to prove ElevenLabs works (about 5 credits)
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
const testVoice = process.argv.includes("--voice");

console.log("\nChecking your video kit…\n");

// 1. Where the folder is. These trip people up on Windows.
if (/[\\/]AppData[\\/]Local[\\/]Temp[\\/]|\.zip[\\/]/i.test(ROOT))
  bad(
    "The kit is running from inside the zip file",
    'Right-click the zip → "Extract All…", pick a folder like C:\\Users\\<you>\\video-kit, and open that folder in Claude instead.',
  );
if (/[\\/]OneDrive[^\\/]*[\\/]/i.test(ROOT))
  warn(
    "The kit is inside OneDrive",
    "OneDrive will try to sync thousands of files and can slow things down or lock them. Move the folder to e.g. C:\\Users\\<you>\\video-kit.",
  );

// 2. Node
const major = +process.versions.node.split(".")[0];
if (major >= 18) ok(`Node ${process.versions.node}`);
else
  bad(
    `Node ${process.versions.node} is too old`,
    "Install the LTS version from https://nodejs.org, then quit and reopen Claude.",
  );

// 3. Packages
if (fs.existsSync(path.join(ROOT, "node_modules", "@remotion", "cli")))
  ok("Video tools installed");
else
  bad(
    "Video tools not installed yet",
    'Ask Claude: "Set me up" (it runs npm install, about 2 minutes).',
  );

// 4. Brand
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

// 5. Voice
if (
  fs.existsSync(path.join(ROOT, ".env.txt")) &&
  !fs.existsSync(path.join(ROOT, ".env"))
) {
  fs.renameSync(path.join(ROOT, ".env.txt"), path.join(ROOT, ".env"));
  ok('Renamed ".env.txt" to ".env" (Notepad adds .txt)');
}
const unusual = (m) => /unusual.activity/i.test(m);
const PAUSED =
  "It happens when several free accounts sign up from one network, or over a VPN, and can't be undone on that account. Use a paid plan, or a key from someone with a paid plan. Silent drafts still work.";
const key = elevenKey();
if (!key) {
  warn(
    "No ElevenLabs key yet (needed for the voiceover)",
    'Videos work as silent drafts without one. To add it, ask Claude: "Help me set up ElevenLabs".',
  );
} else {
  try {
    const c = await credits(key);
    const free = c.tier === "free";
    const msg = `ElevenLabs connected: ${c.left.toLocaleString()} of ${c.limit.toLocaleString()} credits left this month (${c.tier} plan)`;
    if (c.left < 1500)
      warn(
        msg,
        "That's less than one short video. It resets monthly, or upgrade at elevenlabs.io.",
      );
    else ok(msg + ". A 30–60 second video uses about 500–2,000.");
    if (free)
      warn(
        "Free plan: fine for practice videos",
        'For business use (website, social media, ads) you need a paid plan (Starter is about US$6/month), then re-record the voice. Free videos must credit "elevenlabs.io".',
      );
    if (B?.voice?.voiceId) {
      try {
        const v = await eleven(`/v1/voices/${B.voice.voiceId}`, { key });
        if (free && v.category !== "premade")
          bad(
            `The voice "${v.name}" is a Voice Library voice, which free plans can't use through the kit`,
            'Pick one of ElevenLabs\' default voices: ask Claude "Help me pick a voice" (npm run voices lists them).',
          );
        else
          ok(
            `Voice: ${v.name}${v.category === "premade" ? " (a default voice: works on every plan)" : ""}`,
          );
      } catch {
        bad(
          `The voice in brand/brand.json (${B.voice.voiceId}) isn't in your ElevenLabs account`,
          'Ask Claude: "Help me pick a voice".',
        );
      }
    }
    if (testVoice && !problems) {
      try {
        await eleven(
          `/v1/text-to-speech/${B.voice.voiceId}?output_format=mp3_22050_32`,
          {
            key,
            method: "POST",
            json: {
              text: "Ready.",
              model_id: B.voice.model || "eleven_multilingual_v2",
            },
            raw: true,
          },
        );
        ok("Voice test: ElevenLabs spoke a test word");
      } catch (e) {
        if (unusual(e.message))
          bad(
            'ElevenLabs has paused free use on this account ("unusual activity")',
            PAUSED,
          );
        else
          bad(
            `Voice test failed: ${e.message}`,
            "Check the key has Text to Speech access (elevenlabs.io → Developers → API Keys).",
          );
      }
    }
  } catch (e) {
    if (unusual(e.message))
      bad(
        'ElevenLabs has paused free use on this account ("unusual activity")',
        PAUSED,
      );
    else
      bad(
        `ElevenLabs didn't accept the key (${e.message})`,
        "Copy the key again from elevenlabs.io → Developers → API Keys. If it's restricted, give it Text to Speech, Voices (read) and User (read).",
      );
  }
}

// 6. Example
if (fs.existsSync(path.join(ROOT, "src", "videos", "example", "video.ts")))
  ok('Example video present (try: "Render the example video")');

console.log(
  problems
    ? `\n${problems} thing(s) to fix before making a video.\n`
    : "\nAll good. You're ready to make a video.\n",
);
process.exit(problems ? 1 : 0);
