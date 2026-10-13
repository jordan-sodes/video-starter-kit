import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../brand";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0 -> 1 spring starting at frame `at`. Use with cue(): useIn(cue("hook", "today")). */
export const useIn = (
  at: number,
  config = { damping: 200, stiffness: 140 },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config });
};

/** 0 -> 1 between two frames, eased. */
export const useSpan = (from: number, to: number, easing = ease.inOut) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing });
};

/** 1 until frame `until`, then fades to 0 over 10 frames. Leave `until` out to stay visible. */
export const useOut = (until?: number) => {
  const frame = useCurrentFrame();
  return until === undefined
    ? 1
    : interpolate(frame, [until, until + 10], [1, 0], clamp);
};
