// Made by the kit. cue("scene", "word") gives the frame in that scene where the word is spoken.
import { makeCue, Word } from "../../lib/voTimeline";
import { scene, SceneId } from "./timeline";
import hook from "./words/01-hook.json";
import brief from "./words/02-brief.json";
import voice from "./words/03-voice.json";
import build from "./words/04-build.json";
import fix from "./words/05-fix.json";
import close from "./words/06-close.json";

export const words: Record<SceneId, Word[]> = { hook, brief, voice, build, fix, close };

export const cue = makeCue<SceneId>(words, scene);
