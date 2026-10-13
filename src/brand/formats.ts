import { useVideoConfig } from "remotion";

export const FPS = 30;

/** Output formats. */
export const formats = {
  /** YouTube, website, presentations. */
  landscape: { width: 1920, height: 1080 },
  /** Reels, Shorts, TikTok, Stories. */
  portrait: { width: 1080, height: 1920 },
  /** LinkedIn / Instagram feed. */
  feed: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
} as const;

export type FormatName = keyof typeof formats;

/**
 * Scale factor relative to a 1080px short side, so one set of pixel values
 * works in every format. Multiply sizes by this.
 */
export const useScale = () => {
  const { width, height } = useVideoConfig();
  return Math.min(width, height) / 1080;
};

/** Safe margin from the frame edge (the logo sits here, top-left). */
export const useSafeMargin = () => {
  const { width, height } = useVideoConfig();
  return Math.round(Math.min(width, height) * 0.075);
};
