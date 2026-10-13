// List the voices in your ElevenLabs account, with the ID to put in brand/brand.json.
//   npm run voices
// To use a voice from the ElevenLabs Voice Library, click "Add to my voices" there first.
import { brand, eleven, elevenKey, fail } from "./lib.mjs";

const key = elevenKey();
if (!key) fail("No ElevenLabs key yet (run: npm run doctor).");
const { voices } = await eleven("/v1/voices", { key });
const current = brand().voice.voiceId;
for (const v of voices.sort((a, b) => a.name.localeCompare(b.name))) {
  const l = v.labels || {};
  const about = [l.accent, l.gender, l.age, l.use_case || l["use case"]]
    .filter(Boolean)
    .join(", ");
  console.log(
    `${v.voice_id === current ? "→" : " "} ${v.voice_id}  ${v.name}${about ? `  (${about})` : ""}`,
  );
}
console.log("\n→ = the voice in brand/brand.json now");
