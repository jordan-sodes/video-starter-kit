import brandFile from "../../brand/brand.json";

/**
 * Colours come from brand/brand.json. Change them there, never here,
 * and never type a hex code into a scene: import { brand } instead.
 */
const c = brandFile.colors;

/** "#RRGGBB" + opacity 0..1 -> "rgba(...)". */
export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Mix two "#RRGGBB" colours. t = 0 gives a, t = 1 gives b. */
export const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => parseInt(h.replace("#", ""), 16);
  const [x, y] = [p(a), p(b)];
  const ch = (s: number) =>
    Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t);
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("")}`;
};

export const brand = {
  name: brandFile.name,
  website: brandFile.website,
  /** The main brand colour: highlights, buttons, rings. */
  primary: c.primary,
  /** A lighter primary for words highlighted on dark backgrounds. */
  primaryLight: c.primaryLight,
  /** The dark background. */
  dark: c.dark,
  /** The light background. */
  light: c.light,
  /** Use sparingly: one detail per scene at most. */
  accent: c.accent,
  white: "#FFFFFF",
} as const;

export const text = {
  onDark: "#FFFFFF",
  onDarkMuted: "rgba(255,255,255,0.72)",
  onDarkFaint: "rgba(255,255,255,0.48)",
  onLight: mix(c.dark, "#000000", 0.2),
  onLightMuted: mix(c.dark, "#FFFFFF", 0.4),
} as const;

/** Card and line colours derived from the dark background. */
export const surface = {
  card: mix(c.dark, "#FFFFFF", 0.06),
  cardHi: mix(c.dark, "#FFFFFF", 0.11),
  line: "rgba(255,255,255,0.10)",
} as const;

/** Good / warning / bad, for mock-ups. */
export const status = {
  good: "#22C55E",
  warn: "#F59E0B",
  bad: "#EF4444",
} as const;

export const gradients = {
  /** Dark background with a soft glow of the brand colour. */
  glow: (x = "70%", y = "35%") =>
    `radial-gradient(1200px 800px at ${x} ${y}, ${alpha(c.primary, 0.22)}, transparent 60%), radial-gradient(900px 700px at 10% 100%, ${alpha(c.primary, 0.12)}, transparent 60%), ${c.dark}`,
  /** Sits text on a photo: darker towards the bottom. */
  photoScrim: `linear-gradient(180deg, ${alpha(c.dark, 0.25)} 0%, ${alpha(c.dark, 0.5)} 60%, ${alpha(c.dark, 0.88)} 100%)`,
  /** Darkens the left side of a photo so a headline on the left reads. */
  photoLeft: `linear-gradient(90deg, ${alpha(c.dark, 0.85)} 0%, ${alpha(c.dark, 0.4)} 45%, transparent 75%)`,
  /** A light brand tint over a photo. */
  brandTint: `linear-gradient(180deg, ${alpha(c.primary, 0.25)}, ${alpha(c.dark, 0.6)})`,
} as const;
