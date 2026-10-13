---
name: set-up-brand
description: Set the kit up with someone's brand (name, colours, font, logo, tone, voice) from their website and logo files, so every video looks like theirs. Use when someone says "set up my brand", gives their website, or wants to change colours, font, logo or voice.
---

# Setting up a brand

Goal: fill in `brand/brand.json`, the logo files and the font, then prove it by rendering the example video in their brand.

1. **Ask for** their website, and their logo if they have the file (SVG or a PNG with a transparent background are best; they can drop it in `images/`). Ask too: who are your customers, and how should the videos sound (e.g. "friendly and down-to-earth")?

2. **Read their website.** Use WebFetch on the home page (and an About page if there is one). Pull out:
   - **name**, and **about** (one or two sentences on what they do)
   - **audience**, and **tone**
   - **colours**: the main brand colour (buttons, links, logo), a dark colour (dark sections or text), a light background, and an accent if they use one. Look in the page's CSS for hex codes (`theme-color` meta, buttons, `--primary`-style variables). If you can't find them, ask, or sample them from the logo.
   - **font**: the heading font in the CSS (`font-family`). It must be a Google Font. If theirs isn't (or you can't tell), pick the closest Google Font and say so.

3. **Work out the rest of the palette:**
   - `primaryLight`: the primary mixed about 40% with white. It's for highlighted words on dark backgrounds, so check it's readable on `dark`.
   - `dark`: their dark colour, or a very dark tint of the primary. It's the default background, so it must be dark enough for white text (luminance under about 10%).
   - `light`: their light background, or #F5F6FA.
   - `accent`: a second brand colour, or a warm yellow (#FFB300) if they have none.

4. **Logo.** The kit needs two versions in `public/brand/`: one for dark backgrounds (usually white) and one for light backgrounds.
   - SVG: copy it, and make the white version by changing its fills to `#FFFFFF`.
   - PNG (or any single-colour logo): copy it, point both `onDark` and `onLight` at it, and set `"whitenOnDark": true`. The kit then shows it pure white on dark backgrounds. If the logo is multi-coloured and must stay in colour, leave `whitenOnDark` false and check it reads on `dark` (if not, ask them for a white version).
   - No logo file: download it from their website (look for the `<img>` in the header, or the `og:image`), or make a clean text logo SVG with their name in their font's style.
   - Point `logo.onDark` and `logo.onLight` in `brand.json` at the files (paths are inside `public/`).

5. **Font.** Change the import line in `src/brand/fonts.ts` to `@remotion/google-fonts/<FontNameWithoutSpaces>` and set `"font"` in `brand.json` to the same name. Run `npm run check`. If the import fails, the name is wrong: look it up at https://www.remotion.dev/docs/google-fonts.

6. **Voice** (optional now). Keep Charlie unless they want a different accent or style. See `make-video/references/voice.md` → *Choosing a voice*. Add their business name to `sayAs` only if the voice says it wrong.

7. **Prove it.** Run `npm run doctor`, then `npm run sheet -- example` and look at the sheet: logo visible on dark backgrounds, highlighted words readable, nothing clashing. Fix, then send them the sheet: "Here's the example video in your brand." Offer to render it in full (`npm run export -- example "Example in my brand"`).

Keep the colours honest to their brand. Don't "improve" them. If a colour can't work as a background (e.g. a bright yellow primary), keep it as the highlight colour and use a dark background.
