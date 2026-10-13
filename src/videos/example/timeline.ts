// Made by the kit from the voiceover. Don't edit: run "npm run voice -- example" or "npm run pick" instead.
import { buildTimeline } from "../../lib/voTimeline";

const VO = [
  { id: "hook", file: "01-hook.mp3", secs: 2.29 },
  { id: "brief", file: "02-brief.mp3", secs: 5.39 },
  { id: "voice", file: "03-voice.mp3", secs: 3.45 },
  { id: "build", file: "04-build.mp3", secs: 4.83 },
  { id: "fix", file: "05-fix.mp3", secs: 2.97 },
  { id: "close", file: "06-close.mp3", secs: 2.85 },
] as const;

export type SceneId = (typeof VO)[number]["id"];

const t = buildTimeline<SceneId>(VO, { leadIn: 12, gap: 15, tail: 90 });

export const scenes = t.scenes;
export const scene = t.scene;
export const DURATION = t.duration;
