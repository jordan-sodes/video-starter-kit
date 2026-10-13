# Writing for the voice

The voice reads exactly what's written, and it guesses at anything ambiguous.

## Words it gets wrong

- **Words spelled the same but said differently as a noun and a verb**: record, present, permit, project, lead, live, content, object, close, produce, refuse. "Every tap records the time" can come out as "REC-ords". Rewrite: "captures", "saves".
- **Names**: the business name, people, places and products. If one comes out wrong, add it to `sayAs` in `brand/brand.json` with a spelling that sounds right (e.g. `"Wakata": "Wakarta"`, `"Nguyen": "Win"`). Every line containing it then gets three takes: A as written, B and C respelled. The screen still shows the real spelling.
  - Avoid hyphens in respellings ("Wa-karta" over-stresses the first part). Try a plain respelling first.
- **Numbers and symbols**: write them as spoken. "Forty-five dollars", "two thousand and twenty-six", "nine to five", "twenty-four seven", "R and R". Not "$45", "2026", "9–5", "24/7".
- **Acronyms**: ones people say as words or letters (CEO, NDIS, GST) are usually fine; check the transcript.
- **"Can't"** may come out American with some voices; "cannot" or a rephrase is safer.

## Style

- Write how people talk: short sentences, "you" and "we", contractions.
- One idea per line; each line is one scene.
- About 150 words a minute including pauses.
- Hook in the first line (a problem, a surprising fact, or a promise). End with what to do next.

## Choosing a voice

The kit starts with **Charlie** (Australian, conversational), a stock voice every ElevenLabs account has.
To change it, open https://elevenlabs.io/app/voice-library with them and listen for one that fits.
They click **Add to my voices**, then give you its name. `npm run voices` lists every voice in their account with its ID.

Then update `voice` in `brand/brand.json` and run `npm run doctor`. Record one test line before a whole video.

## Costs (ElevenLabs characters)

Every character of text sent to the voice counts, and a line with a tricky word costs three times its length.
A 60-second video is about 1,000 characters, or up to 2,500 with takes and a few re-records.
The free plan has about 10,000 a month. `npm run doctor` shows what's left.
