# Writing for the voice

The voice reads exactly what's written, and it guesses at anything ambiguous.

## Words it gets wrong

- **Words spelled the same but said differently as a noun and a verb**: record, present, permit, project, lead, live, content, object, close, produce, refuse. "Every tap records the time" can come out as "REC-ords". Rewrite: "captures", "saves".
- **Names**: the business name, people, places and products. If one comes out wrong, add it to `sayAs` in `brand/brand.json` with a spelling that sounds right (e.g. `"Wakata": "Wakarta"`, `"Nguyen": "Win"`). Every line containing it then gets three takes: A as written, B and C respelled. The screen still shows the real spelling.
  - Avoid hyphens in respellings ("Wa-karta" over-stresses the first part). Try a plain respelling first.
- **Numbers and symbols**: write them as spoken. "Forty-five dollars", "two thousand and twenty-six", "nine to five", "twenty-four seven", "R and R". Not "$45", "2026", "9–5", "24/7".
- **Acronyms**: ones people say as words or letters (CEO, NDIS, GST) are usually fine; listen to check.
- **"Can't"** may come out American with some voices; "cannot" or a rephrase is safer.

## Style

- Write how people talk: short sentences, "you" and "we", contractions.
- One idea per line; each line is one scene.
- About 150 words a minute including pauses.
- Hook in the first line (a problem, a surprising fact, or a promise). End with what to do next.

## Choosing a voice

The kit starts with **Charlie** (Australian, conversational), one of ElevenLabs' default voices.
`npm run voices` lists the voices that work on their plan, each with a "listen" link: open the links in the browser pane.
- **Free plan:** only the default voices work through the kit. Voice Library voices need a paid plan.
- **Paid plan:** they can also browse https://elevenlabs.io/app/voice-library, click **Add to my voices**, and it then shows in `npm run voices`.

Put the ID and name in `voice` in `brand/brand.json`, run `npm run doctor -- --voice`, and record one test line before a whole video.

## Costs (ElevenLabs characters)

Every character of text sent to the voice counts, and a line with a tricky word costs three times its length.
A 60-second video is about 1,000 characters, or up to 2,500 with takes and a few re-records.
The free plan has 10,000 a month. `npm run doctor` shows what's left.
Free-plan audio is for practice: business use needs a paid plan (Starter, about US$6/month), and the voice re-recorded on it.
