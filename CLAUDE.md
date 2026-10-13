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

1. Run `npm run doctor`. If the video tools aren't installed, run `npm install` first (takes about 2 minutes; tell them).
2. Fix anything it flags, or walk them through it (see *Setting up*, below).
3. If they haven't said what they want, offer three starting points: "Render the example video", "Set up my brand", "Make a video about…".

## Setting up (first time only)

- **"Set me up" / "Install the kit"**: `npm install`, then `npm run doctor`, then explain what's left in plain words.
- **Node missing or too old**: they need the LTS installer from https://nodejs.org (click the big green button, run it, then quit and reopen Claude). You can't install it for them.
- **ElevenLabs key** (for the voice): it's optional to start, since videos work as silent drafts. To add one:
  1. Sign up at https://elevenlabs.io (the free plan works for trying it; Starter or higher for music and commercial use).
  2. Click their name or Developers → **API Keys** → Create. Give it access to Text to Speech, Speech to Text, Voices, User and (if available) Music.
  3. **Never ask them to paste the key into the chat.** Create the `.env` file yourself with `ELEVENLABS_API_KEY=` and nothing after it, open it for them with the `open_in_editor` tool (or tell them where it is), and ask them to paste the key after the `=` and save. Then run `npm run doctor` to check it.
- **Their brand**: use the **set-up-brand** skill.

## Making a video

Use the **make-video** skill. It's the full process with the checkpoints where you stop and ask.

## The commands (you run these; they don't)

```bash
npm run doctor                          # is everything ready?
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
- **Credits cost money.** `npm run voice` checks the balance and refuses if there isn't enough. Before recording a whole video, say roughly how many characters it'll use (about 1,000–2,500 for 60 seconds, including takes). Re-record single lines with `--only`.
- **Their material**: photos and documents in `images/` belong to them or their customers. Don't use one customer's material in another customer's video. Ask before using anything with real people's names, faces or contact details.
- **Truth**: don't put claims in a script that their sources don't support. Keep an *Accuracy notes* list in each `SCRIPT.md` and ask when unsure.
- Don't change the files under `scripts/` or `src/lib/` unless something is broken. Videos are built from `src/components/` and each video's own `scenes/`.
