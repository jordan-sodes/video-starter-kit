// Made by the kit from the voiceover. Don't edit: run "npm run voice -- example" or "npm run pick" instead.
import { buildTimeline } from "../../lib/voTimeline";

const VO = [
  { id: "hook", file: "01-hook.mp3", secs: 2.62 },
  { id: "brief", file: "02-brief.mp3", secs: 5.73 },
  { id: "voice", file: "03-voice.mp3", secs: 3.83 },
  { id: "build", file: "04-build.mp3", secs: 5.17 },
  { id: "fix", file: "05-fix.mp3", secs: 3.36 },
  { id: "close", file: "06-close.mp3", secs: 3.18 },
] as const;

export type SceneId = (typeof VO)[number]["id"];

const t = buildTimeline<SceneId>(VO, { leadIn: 12, gap: 15, tail: 90 });

export const scenes = t.scenes;
export const scene = t.scene;
export const DURATION = t.duration;
