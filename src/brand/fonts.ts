// THE FONT. To change it, change "Inter" on the next line to another Google Font
// (e.g. "Poppins", "Montserrat", "DMSans") and update "font" in brand/brand.json.
// The name is the font with its spaces removed: https://www.remotion.dev/docs/google-fonts
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const fonts = { sans: fontFamily } as const;

/** Type styles. Sizes are for a 1080px short side; multiply by useScale(). */
export const type = {
  /** Big statement headline. Sentence case. */
  headline: {
    fontFamily,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.04,
  },
  /** Supporting line under a headline. */
  subhead: {
    fontFamily,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
  },
  /** Small uppercase label. */
  eyebrow: {
    fontFamily,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    lineHeight: 1,
  },
  /** Body text in cards and mock-ups. */
  body: { fontFamily, fontWeight: 500, lineHeight: 1.4 },
} as const satisfies Record<string, React.CSSProperties>;
