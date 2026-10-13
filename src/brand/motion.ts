import { Easing, interpolate, spring, SpringConfig } from "remotion";

/** Calm, confident motion. No bounce on type; a touch of settle on objects. */
export const springs = {
  /** Text and UI entering. Fast in, no overshoot. */
  enter: { damping: 200, stiffness: 120, mass: 1 },
  /** Objects landing with a little weight. */
  settle: { damping: 18, stiffness: 140, mass: 1 },
} satisfies Record<string, Partial<SpringConfig>>;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

/** 0 -> 1 progress for an element entering at `delay` frames. */
export const enter = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: springs.enter });

/** Opacity + upward drift for a standard text reveal. */
export const rise = (progress: number, distance = 40) => ({
  opacity: progress,
  transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
});
