import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  brand,
  gradients,
  surface,
  type,
  useSafeMargin,
  useScale,
} from "../brand";
import { clamp, useIn } from "./anim";
import { Logo } from "./Logo";

type Props = {
  children?: React.ReactNode;
  /** Small uppercase label next to the logo, top-left. */
  eyebrow?: string;
  /**
   * The background:
   * "glow"  dark with a soft brand-colour glow (default)
   * "dark"  plain dark
   * "light" plain light (logo switches to the dark version)
   * "brand" full brand colour: a brief brand moment only
   */
  bg?: "glow" | "dark" | "light" | "brand";
  /** A photo (path in public/) to fill the frame instead. Gets a slow push-in. */
  photo?: string;
  /** A video clip (path in public/) to fill the frame instead, muted. */
  video?: string;
  /** How to keep text readable on a photo or video: "bottom", "left", "tint" or "none". */
  shade?: "bottom" | "left" | "tint" | "none";
  /** Hide the corner logo. */
  noLogo?: boolean;
  glow?: { x: string; y: string };
};

/** The frame every scene sits in: background, corner logo, optional label. */
export const Stage: React.FC<Props> = ({
  children,
  eyebrow,
  bg = "glow",
  photo,
  video,
  shade = "bottom",
  noLogo,
  glow,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = useScale();
  const m = useSafeMargin();
  const e = useIn(4);
  const light = bg === "light" && !photo && !video;
  const background = {
    glow: gradients.glow(glow?.x, glow?.y),
    dark: brand.dark,
    light: brand.light,
    brand: brand.primary,
  }[bg];
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06], clamp);
  const shadeBg = {
    bottom: gradients.photoScrim,
    left: gradients.photoLeft,
    tint: gradients.brandTint,
    none: "transparent",
  }[shade];

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {photo && (
        <Img
          src={staticFile(photo)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${push})`,
          }}
        />
      )}
      {video && (
        <OffthreadVideo
          src={staticFile(video)}
          muted
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      {(photo || video) && <AbsoluteFill style={{ background: shadeBg }} />}
      {children}
      {!noLogo && (
        <div
          style={{
            position: "absolute",
            left: m,
            top: m * 0.8,
            display: "flex",
            alignItems: "center",
            gap: 28 * s,
          }}
        >
          <Logo width={180 * s} dark={light} />
          {eyebrow && (
            <div
              style={{
                ...type.eyebrow,
                fontSize: 20 * s,
                color: light ? brand.primary : brand.primaryLight,
                opacity: e,
                transform: `translateX(${(1 - e) * -12}px)`,
                paddingLeft: 28 * s,
                borderLeft: `1px solid ${light ? "rgba(0,0,0,0.12)" : surface.line}`,
                height: 26 * s,
                display: "flex",
                alignItems: "center",
              }}
            >
              {eyebrow}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Fades a scene in over its first frames and out over its last, so cuts never pop. */
export const SceneFade: React.FC<{
  dur: number;
  children: React.ReactNode;
  inFrames?: number;
  outFrames?: number;
}> = ({ dur, children, inFrames = 10, outFrames = 8 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(
    frame,
    [0, inFrames, dur - outFrames, dur],
    [0, 1, 1, 0],
    clamp,
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
