// List the voices in your ElevenLabs account, with the ID to put in brand/brand.json.
//   npm run voices
// "free ✓" voices are ElevenLabs' default voices: they work on every plan, including free.
// Voice Library voices need a paid plan to use through the kit ("Add to my voices" on elevenlabs.io first).
import { brand, credits, eleven, elevenKey, fail } from "./lib.mjs";

const key = elevenKey();
if (!key) fail("No ElevenLabs key yet (run: npm run doctor).");
const [{ voices }, c] = await Promise.all([
  eleven("/v1/voices", { key }),
  credits(key),
]);
const current = brand().voice.voiceId;
const free = c.tier === "free";
const rows = voices
  .filter((v) => !free || v.category === "premade")
  .sort(
    (a, b) =>
      (a.category === "premade") - (b.category === "premade") ||
      a.name.localeCompare(b.name),
  )
  .reverse();
for (const v of rows) {
  const l = v.labels || {};
  const about = [
    l.accent,
    l.gender,
    l.age?.replace("_", " "),
    (l.use_case || l["use case"])?.replace(/_/g, " "),
  ]
    .filter(Boolean)
    .join(", ");
  const tag = v.category === "premade" ? "free ✓" : "paid  ";
  console.log(
    `${v.voice_id === current ? "→" : " "} ${tag}  ${v.voice_id}  ${v.name}${about ? `  (${about})` : ""}`,
  );
  if (v.preview_url) console.log(`            listen: ${v.preview_url}`);
}
console.log(
  `\n→ = the voice in brand/brand.json now.${free ? " You're on the free plan, so only default voices are listed." : ""}`,
);
