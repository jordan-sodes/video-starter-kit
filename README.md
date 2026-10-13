# Video Starter Kit

Make short branded videos (explainers, promos, social clips) by talking to Claude.
Claude writes the script, makes the voiceover, builds every scene in your colours and renders the video.
It checks with you at each step.

**Cost:** a Claude Pro plan (US$20/month, or $17/month billed yearly). Everything else is free to start.

## Before you start (about 15 minutes, at home or work)

Do these on your home or work internet, not shared Wi-Fi at an event.

1. **Claude**: sign up for Claude Pro at https://claude.ai, then install the desktop app: https://claude.ai/download
2. **Node.js**: https://nodejs.org. Click the big **LTS** download, run it, and click Next until it's done.
3. **Windows only: Git for Windows**: https://git-scm.com/download/win. Run it and keep all the default options.
4. **ElevenLabs** (the voice, free): sign up at https://elevenlabs.io.
   Then **Developers → API Keys → Create Key**, name it "video kit", and keep that page open. You'll paste the key in later, when Claude asks.
   *Signing up at home matters: ElevenLabs blocks free accounts when lots of people sign up from the same network.*
5. **This kit**: download the zip.
   - **Windows:** right-click it → **Extract All…** and put it in `C:\Users\<your name>\video-kit`. Not inside OneDrive.
   - **Mac:** double-click the zip and move the folder to your home folder.

## Get started

1. Open the Claude desktop app, click the **Code** tab, and choose the kit folder.
2. Type: **Set me up.**

   Claude installs everything (about 3 minutes), helps you add your ElevenLabs key, and checks it all works.
   When it asks permission to run a command, click **Allow**.
3. Then, one at a time:
   - **Render the example video.** This proves it all works.
   - **Set up my brand from www.yourwebsite.com.** Your colours, font and logo.
   - **Make a 30-second video about…** Your first real one.

## Where your videos end up

The `exports` folder. Each video comes as a full-quality file (for a website, YouTube or presentations) and a smaller
phone file (for email, WhatsApp and texts).

## Good to know

- Put your photos, screenshots and documents in the `images` folder, then tell Claude they're there.
- **The free ElevenLabs plan** gives 10,000 credits a month, enough for a first video with a few retakes.
  Free voices are for practice: to use a video for your business (website, social media, ads), upgrade to
  ElevenLabs Starter (about US$6/month) and ask Claude to re-record the voice.
- No key, or out of credits? Claude can still make the whole video as a silent draft and add the voice later.
- Your ElevenLabs key lives in a file called `.env` in this folder. Don't share that file, and never paste the key into a chat.
