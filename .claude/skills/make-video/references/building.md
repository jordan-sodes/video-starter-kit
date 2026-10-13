# Building scenes

Look at `src/videos/example/scenes/` first: six short scenes that use most of the building blocks.

## A scene

Each scene is one file in `src/videos/<slug>/scenes/` with no props. Everything is sized for
**1920 × 1080** (landscape); for portrait it's 1080 × 1920, so lay out vertically.

```tsx
import React from "react";
import { Caption, Headline, Hi, Stage, useIn } from "../../../components";
import { brand } from "../../../brand";
import { cue } from "../cues";

export const Problem: React.FC = () => {
  const card = useIn(cue("problem", "paperwork"));   // 0 → 1 when the voice says "paperwork"
  return (
    <Stage eyebrow="The problem" photo="spring-sale/shop.jpg" shade="left">
      <div style={{ position: "absolute", left: 110, top: 360 }}>
        <Headline title={"Paperwork eats\nyour weekend."} highlight={["weekend"]} at={cue("problem", "paperwork") - 6} />
      </div>
    </Stage>
  );
};
```

- `cue("scene", "word", n?)` is the frame in this scene when the word is spoken (`n` = which occurrence, from 0).
  Words come from `src/videos/<slug>/words/<line>.json`.
- `useIn(frame)` springs 0 → 1 from that frame: use it for opacity and movement.
- Don't call hooks inside `.map()`: use `interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: ease.out })` there.
- Photos and clips go in `public/<slug>/` and are referenced as `"<slug>/file.jpg"`.

## Building blocks (`src/components`)

| Block | What it's for |
|---|---|
| `Stage` | Every scene's frame: background (`bg="glow"`, `"dark"`, `"light"` or `"brand"`), or `photo` / `video` with `shade`, plus the corner logo and `eyebrow` label |
| `Headline` | A big statement whose words rise in one by one; `highlight` colours a word or two |
| `Caption` | Short headline and subline, lower left, for over photos and screenshots |
| `Hi` | Brand-colour emphasis inside any text |
| `Points` | A list where each item appears on its own cue |
| `Counter` | A number counting up (prices, percentages, stats) |
| `Bubble` | A chat message that types itself out |
| `Screen` | A screenshot in a browser window; children placed in the image's own pixels |
| `Shot` | A screenshot on a card, with an optional band cut out |
| `Ring`, `Tag` | A highlight drawn around part of a screenshot, and a label pill beside it |
| `Phone` | Phone frame around app screenshots, crossfading between them |
| `Camera` | Slow pan and zoom between keyframes |
| `Card`, `Pill` | Panels and small labels for motion-graphic mock-ups |
| `Logo` | Their logo (`dark` for light backgrounds) |
| `EndCard` | Closing frame: logo, line, button, website |

Colours: `brand.primary`, `brand.primaryLight` (for words on dark), `brand.accent` (sparingly), `brand.dark`,
`brand.light`, `text.*`, `status.good` / `warn` / `bad`. `alpha(colour, 0.5)` for see-through.
Type styles: `type.headline`, `type.subhead`, `type.eyebrow`, `type.body`.

## Look and pacing

- One idea per scene. The picture changes on the word that names it.
- Their real photos and screenshots beat mock-ups. Use motion graphics for ideas, numbers and anything that has no picture.
- Text big and short: headlines 80–110 px, nothing under 40 px that must be read, four to eight words on screen at a time.
- Calm, confident motion: things rise and fade in on cue. No spinning, bouncing or swooshing.
- Keep a margin of about 110 px from the edges (the logo sits top-left).
- Highlight one or two words per headline, not whole sentences.
- The last scene: `EndCard` with what to do next (website, "Book a call", phone number).

## Screenshots with highlights

```tsx
<Screen src="my-video/dashboard.png" imgW={2400} imgH={1500} width={1500} url="app.example.com">
  <Ring x={340} y={220} w={600} h={90} at={cue("show", "bookings")} dim />
  <Tag x={960} y={240} at={cue("show", "bookings") + 6}>New bookings</Tag>
</Screen>
```

`imgW`/`imgH` must be the image's real pixel size (`node -e "…"` or open it in Preview → Tools → Show Inspector).
Ring and Tag positions are in those pixels. Measure them on the real image, not on the contact sheet.
