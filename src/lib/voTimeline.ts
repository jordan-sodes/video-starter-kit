import { FPS } from "../brand";

/**
 * Timeline helpers shared by every VO-led video.
 *
 * A video is a list of VO lines, one per scene. Scene lengths come from the
 * clip lengths, so re-recording a line re-times everything after it.
 */

export type VoLine<Id extends string = string> = {
  id: Id;
  file: string | null;
  secs: number;
};

export type Scene<Id extends string = string> = {
  id: Id;
  /** The VO clip, or null for a silent (no-voice) draft. */
  file: string | null;
  /** First frame of the scene. Scenes butt together; the gap belongs to the scene before. */
  from: number;
  durationInFrames: number;
  /** Frame within the scene where the VO line starts. */
  voFrom: number;
  voFrames: number;
};

export type Word = { w: string; s: number; e: number };

export const buildTimeline = <Id extends string>(
  lines: readonly VoLine<Id>[],
  {
    leadIn = 12,
    gap = 15,
    tail = 75,
  }: { leadIn?: number; gap?: number; tail?: number } = {},
) => {
  let cursor = 0;
  const scenes: Scene<Id>[] = lines.map((v, i) => {
    const voFrames = Math.ceil(v.secs * FPS);
    const voFrom = i === 0 ? leadIn : 0;
    const after = i === lines.length - 1 ? tail : gap;
    const durationInFrames = voFrom + voFrames + after;
    const s = {
      id: v.id,
      file: v.file,
      from: cursor,
      durationInFrames,
      voFrom,
      voFrames,
    };
    cursor += durationInFrames;
    return s;
  });
  const duration = cursor;
  const scene = (id: Id) => scenes.find((s) => s.id === id)!;
  return { scenes, duration, scene };
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9&']/g, "");

/**
 * Returns cue(sceneId, word, nth) → frame (relative to the scene's start) at
 * which that word is spoken, from speech-to-text word timings.
 */
export const makeCue =
  <Id extends string>(
    words: Record<Id, Word[]>,
    scene: (id: Id) => Scene<Id>,
  ) =>
  (id: Id, word: string, nth = 0): number => {
    let seen = 0;
    for (const w of words[id]) {
      if (norm(w.w) === norm(word)) {
        if (seen === nth) return scene(id).voFrom + Math.round(w.s * FPS);
        seen++;
      }
    }
    throw new Error(`No cue "${word}" (#${nth}) in ${id}`);
  };
