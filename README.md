# Video Starter Kit

Make short branded videos (explainers, promos, social clips) by talking to Claude.
Claude writes the script, makes the voiceover, builds every scene in your colours and renders the video.
It checks with you at each step.

**Cost:** a Claude Pro plan (US$20/month, or $17/month billed yearly). Everything else is free to start.

## Before you start (about 15 minutes)

1. **Claude**: sign up for Claude Pro at https://claude.ai, then install the desktop app: https://claude.ai/download
2. **Node.js**: https://nodejs.org. Click the big **LTS** download, run it, and click Next until it's done.
   **Windows: on the "Tools for Native Modules" screen, leave the box unticked.** Ticking it runs a PowerShell script that installs Chocolatey and build tools. The kit doesn't need them, and work security software often blocks that script (it can cut your computer off the network).
   **Using a work computer?** Check with your IT team before installing anything, or use a personal laptop.
3. **Windows only: Git for Windows**: https://git-scm.com/download/win. Run it and keep all the default options.
4. **ElevenLabs** (the voice, free): sign up at https://elevenlabs.io.
   Then open **https://elevenlabs.io/app/developers/api-keys**, click **Create Key**, name it "video kit", click **Create**, then **Copy**.
   The key starts with `sk_` and is only shown once, so keep it in a note until Claude asks for it.
5. **This kit**: go to https://github.com/jordan-sodes/video-starter-kit, click the green **Code** button, then **Download ZIP**.
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
