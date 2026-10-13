# Video Starter Kit

Make short branded videos (explainers, promos, social clips) by talking to Claude.
Claude writes the script, makes the voiceover, builds every scene in your colours and renders the video.
It checks with you at each step.

## What you need

- A Mac or Windows computer
- The **Claude desktop app** with a paid Claude plan (Pro or Max): https://claude.ai/download
- **Node.js** (free): https://nodejs.org. Download the LTS version, run the installer, and click through.
- Optional, for the voice: an **ElevenLabs** account (free to try): https://elevenlabs.io

## Get started

1. Unzip this folder somewhere you'll find it again, e.g. your Documents folder.
2. Open the Claude desktop app, click the **Code** tab, and choose this folder.
3. Type: **Set me up.**

Claude installs everything (about 2 minutes) and tells you if anything is missing. Then try these:

- **Render the example video.** This proves it all works.
- **Set up my brand from www.yourwebsite.com.** Now the videos use your colours, font and logo.
- **Make a 30-second video about…** Your first real one.

## Where your videos end up

The `exports` folder. Each video comes as a full-quality file (for a website, YouTube or presentations) and a smaller
phone file (for email, WhatsApp and texts).

## Good to know

- Put your photos, screenshots and documents in the `images` folder, then tell Claude they're there.
- The voice uses ElevenLabs credits. Claude checks your balance before recording and tells you what a video will cost.
  Without a key you can still make a full video as a silent draft and add the voice later.
- Your ElevenLabs key lives in a file called `.env` in this folder. Don't share that file, and never paste the key into a chat.
