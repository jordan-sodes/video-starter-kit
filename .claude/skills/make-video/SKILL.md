---
name: make-video
description: Make a short branded video end to end in this kit (explainer, promo, how-to, social clip): brief, script, voiceover, scenes, checking and export, stopping for the person at each checkpoint. Use whenever someone asks to make, script, voice, build, change, re-time or export a video.
---

# Making a video

The person is probably not technical. You do all the work and run every command. They decide at
the ✋ checkpoints. Don't skip a checkpoint to save time: each one saves a re-do later.

## Before you start

- `npm run doctor` must pass. If the brand still says "Your Company", offer to set it up first
  (the **set-up-brand** skill). It takes five minutes and makes every video look like theirs.
- No ElevenLabs key yet? Offer to set it up now (see *Setting up* in `CLAUDE.md`: a free account is enough),
  or make the whole video as a **silent draft** (`--silent`) and add the voice later.

## The process

1. **Brief.** Find out, in one friendly message:
   - what it's about
   - who it's for
   - where it'll be shown (website, LinkedIn, Instagram, a presentation)
   - how long it should be
   - what the viewer should do afterwards.

   Suggest the format: website or presentation → `landscape`; Reels, TikTok or Stories → `portrait`;
   LinkedIn or Facebook feed → `feed` or `square`. Suggest a length: 30–60 seconds for social, 60–120 for an
   explainer. Ask them to drop any photos, screenshots, logos or documents into `images/`. Read `brand/brand.json`
   (about, audience, tone) and anything they gave you. If they have a website, read the relevant page.
   **Voice:** if they haven't chosen one, offer two or three that suit the audience from `npm run voices`, and play the listen links in the browser pane.
   **Budget:** check their credits (`npm run doctor`). On a free account, keep the first video to 30–60 seconds.

2. ✋ **Agree the angle.** Before writing the script, send a short numbered list: the one idea the video hangs on, the scene-by-scene outline (one line each), what's on screen in each scene, which of their pictures you'll use and what you'll make with motion graphics, and anything you're unsure is true. Wait for their OK.

3. **Script.** `npm run new -- <slug> "<Title>" --format <format>` (slug: lower case with dashes, e.g. `spring-sale`).
   - Write `work/<slug>/SCRIPT.md`: a table of # · Voiceover · On screen · Source, plus *Accuracy notes*.
   - One voiceover line per scene. Allow about 150 words a minute, so 30 s ≈ 70 words and 60 s ≈ 140.
   - Follow `references/voice.md` (writing for a voice: the words it gets wrong).
   - Show them the script as a simple numbered list of the lines. ✋ **Get the wording approved.** Changing words after recording costs credits.

4. **Voice.** Put the approved lines in `work/<slug>/lines.json` (`{"01-hook": "…", "02-problem": "…"}`; the key is the line number plus a short name).
   - Say roughly how many characters it'll use, then run `npm run voice -- <slug>`. It checks credits, records, times everything and writes the takes page.
   - Start the **takes** preview and open `http://localhost:8765/<slug>/takes/index.html` in the browser pane. Tell them to press "Play the whole thing".
   - ✋ **They listen.** Lines with tricky words have takes A/B/C; they pick (e.g. "02A 05C") → `npm run pick -- <slug> 02A 05C`. A line they want said differently: edit `lines.json`, then `npm run voice -- <slug> --only 05`.
   - No key yet: `npm run voice -- <slug> --silent` and carry on. Record properly later. The scenes re-time themselves.

5. **Scenes.** `npm run scenes -- <slug>` creates a placeholder file per scene and adds the video to the Studio. Then build each scene in `src/videos/<slug>/scenes/` from the building blocks: see `references/building.md`. Start the **studio** preview so they can watch it come together if they like.
   - Animate on the words: `cue("scene", "word")` is the frame where that word is spoken. The words are the script's own words (see `src/videos/<slug>/words/*.json`).
   - Their photos: copy the ones you use from `images/` into `public/<slug>/` with clear names.
   - Optional music: `npm run music -- <slug> "<feel>"` (paid ElevenLabs plans; ask first, since it uses credits).

6. **Check.** `npm run check` must pass. Then `npm run sheet -- <slug>` and **open `out/sheets/<slug>.jpg` and look at it properly.** Look for:
   - text cut off or running off the edge
   - two things on top of each other
   - empty frames
   - text you can't read on a photo
   - highlights that miss their target.

   Fix and re-sheet until it's clean. Then send them the sheet (SendUserFile) as a preview.

7. **Export.** `npm run export -- <slug> "<Title> v1"`, which makes `(full)` and `(phone)` files in `exports/`. If it prints the free-plan note, pass it on once: practice is fine, but business use needs a paid ElevenLabs plan and a re-record. Send the phone file with SendUserFile (the full file may be too big to send). ✋ **They watch it.** Notes come back as "at 0:12 the…": find the scene from the time (the Studio timeline or `npm run sheet -- <slug> <frame>`; frame = seconds × 30), fix it, and export "v2".

8. **Afterwards.** Tell them where the files are (`exports/`), and that they can ask for other versions (e.g. "Make a 9:16 version for Instagram": a new video with the same lines, re-laid out for portrait).

## Lessons that save a re-do

- **Wording first, then voice, then scenes.** Every word change after recording costs credits and re-timing.
- **One idea per scene.** The picture changes on the word that names it. Hold the most important shot longest.
- **Measure on the real image.** When ringing part of a screenshot, use the image's real pixel size (`Screen`/`Ring` work in image pixels). Never guess positions from the contact sheet.
- **Long pauses feel slow.** If a take has a long gap, record it again with `--only` rather than living with it.
- **A line that lifts at the end like a question** sounds unsure. Re-record just that line (`--only 03`); each recording is a slightly different read.
- **Contact sheet before every export.** A full render takes minutes. A sheet takes seconds.
- **Keep text big.** At least 40 px for anything they must read. Headlines 80–110 px. Four to eight words on screen at a time.
- If a sheet frame fails to draw, it's almost always a `cue()` word that isn't in that line: the error names it.
