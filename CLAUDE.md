# Video Starter Kit

This folder makes short branded videos (explainers, promos, social clips) in code with
[Remotion](https://www.remotion.dev), voiced with ElevenLabs. The person you're working with is
probably **not technical**: a business owner who has never used a terminal. You run every command.
They talk, listen, look and decide.

## How to talk to them

- Plain English. No jargon (say "the video's code", not "the composition"; "the voice", not "TTS").
- Never ask them to type a command, edit a file or open a terminal. Do it yourself, then say what happened in one or two sentences.
- When you need a decision, ask one short numbered list of questions, with your recommendation first.
- Show, don't describe: open the takes page or the Studio in the browser pane, and send finished files with SendUserFile.
- If something fails, fix it yourself if you can. If they must do something (sign up, paste a key, install Node), give click-by-click steps.

## Start of every session

1. Run `npm run doctor`. If the video tools aren't installed, run `npm install` then `npm run setup` (about 3 minutes in all; tell them).
2. Fix anything it flags, or walk them through it (see *Setting up*, below).
3. If they haven't said what they want, offer three starting points: "Render the example video", "Set up my brand", "Make a video about…".

## Setting up (first time only)

**"Set me up"**: run `npm install`, then `npm run setup`. That downloads the renderer (about 90 MB, once), checks everything and, if there's a key, has the voice say one test word. Then explain what's left in plain words.

- **Node missing or too old**: they need the LTS installer from https://nodejs.org (the big green button; run it and click Next through it), then quit and reopen Claude. You can't install it for them.
- **Windows**:
  - If the doctor says the kit is inside the zip or inside OneDrive, have them extract or move the folder to `C:\Users\<name>\video-kit` and reopen it in Claude.
  - Git for Windows (https://git-scm.com/download/win, all default options) makes your command tool work best. Recommend it, but it isn't required.
- **ElevenLabs (the voice)**: walk them through it the first time. It's free, and the free plan (10,000 credits a month) is plenty for a first video of 30 to 60 seconds.
  1. Sign up at https://elevenlabs.io with Google or an email address. Skip any offers to upgrade.
  2. Create a key: give them the direct link **https://elevenlabs.io/app/developers/api-keys** (it lands on the API keys page once signed in) → **Create Key**. Name it "video kit". If it offers "Restrict key", allow **Text to Speech** and set **Voices** and **User** to read. Click Create and copy the key (it's shown only once).
  3. **Never ask them to paste the key into the chat.** Create `.env` yourself containing `ELEVENLABS_API_KEY=` and nothing after it. Open it for them with the `open_in_editor` tool (or tell them where it is in plain words), and ask them to paste the key straight after the `=` and save. On Windows, Notepad may save it as `.env.txt`; the kit copes with that.
  4. Run `npm run doctor -- --voice`. It should end with "Voice test: ElevenLabs spoke a test word". If it says **"unusual activity"**, the account is blocked by ElevenLabs. Carry on with a silent draft (`--silent`); they can voice it later with a paid key.
- **Picking a voice**: the kit starts with Charlie, an Australian voice. Run `npm run voices` to list the voices that work on their plan, each with a "listen" link. Open the links in the browser pane so they can hear them. On the free plan only ElevenLabs' default voices work through the kit (the Voice Library needs a paid plan). Put the chosen ID and name in `voice` in `brand/brand.json`.
- **Free vs paid**: free-plan voices are for practice only. They can't be used for business marketing, and must credit "elevenlabs.io". When they're ready to publish, they upgrade (Starter, about US$6 a month) and you re-record the voice (`npm run voice -- <slug>`, then export again). Mention this once, kindly, when they export their first video. Don't nag.
- **Their brand**: use the **set-up-brand** skill.

## Making a video

Use the **make-video** skill. It's the full process with the checkpoints where you stop and ask.

## The commands (you run these; they don't)

```bash
npm run setup                           # first time, after npm install: renderer + full check
npm run doctor [-- --voice]             # is everything ready? (--voice: speak a test word, ~5 credits)
npm run voices                          # voices that work on their ElevenLabs plan, with listen links
npm run new -- <slug> "<Title>" [--format landscape|portrait|square|feed]
npm run voice -- <slug> [--only 03] [--silent]   # record (or time a silent draft), make the takes page
npm run pick -- <slug> 02B 05C          # use the takes they chose
npm run scenes -- <slug>                # create the video's code and add it to the Studio
npm run music -- <slug> "calm, warm"    # optional music bed (paid ElevenLabs plans)
npm run sheet -- <slug>                 # contact sheet: out/sheets/<slug>.jpg (always look at it)
npm run export -- <slug> "<Name v1>"    # finished files in exports/
npm run check                           # code check (TypeScript + lint)
```

Previews: `.claude/launch.json` has **studio** (Remotion Studio, port 3000) and **takes** (voiceover takes pages, port 8765). Start them with preview_start.

## Where things are

| Folder | What |
|---|---|
| `brand/brand.json` | **The one place for the look and voice**: name, colours, font, logo, voice, words to respell |
| `public/brand/` | Logo files |
| `images/` | Drop zone: they put photos, screenshots and documents here |
| `work/<slug>/` | Each video's script (`SCRIPT.md`), voiceover lines (`lines.json`), takes |
| `public/<slug>/` | Each video's media: voice clips, music, photos used |
| `src/videos/<slug>/` | Each video's code: `scenes/` (one file per scene) plus generated timing files |
| `src/components/` | Building blocks: Stage, Headline, Caption, Bubble, Points, Counter, Screen, Ring, Tag, Phone, Card, Pill, EndCard, Logo |
| `exports/` | Finished videos to share |

## Rules

- **Colours, fonts and logos come from `src/brand` and `brand/brand.json`.** Never type a hex code into a scene.
- **Secrets**: the ElevenLabs key lives only in `.env`. Never print it, paste it, read it aloud or put it in any other file.
- **Credits are limited.** A free account has 10,000 a month. `npm run voice` checks the balance and refuses if there isn't enough. Before recording, say roughly what it'll use (1 credit per character; a line with a tricky word is recorded 3 times). Keep a first video to 30–60 seconds (about 500–2,000 credits with retakes). Re-record single lines with `--only`, never the whole video for one fix.
- **Their material**: photos and documents in `images/` belong to them or their customers. Don't use one customer's material in another customer's video. Ask before using anything with real people's names, faces or contact details.
- **Truth**: don't put claims in a script that their sources don't support. Keep an *Accuracy notes* list in each `SCRIPT.md` and ask when unsure.
- Don't change the files under `scripts/` or `src/lib/` unless something is broken. Videos are built from `src/components/` and each video's own `scenes/`.
