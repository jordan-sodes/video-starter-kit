import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import brandFile from "../../brand/brand.json";
import { enter } from "../brand";

/**
 * The logo from brand/brand.json. `dark` picks the version for light backgrounds.
 * `animateFrom` fades and lifts it in from that frame; leave it out for a still logo.
 * If brand.json has "whitenOnDark": true, the dark-background version is the logo turned white.
 */
export const Logo: React.FC<{
  width?: number;
  dark?: boolean;
  animateFrom?: number;
  style?: React.CSSProperties;
}> = ({ width = 180, dark = false, animateFrom, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = animateFrom === undefined ? 1 : enter(frame, fps, animateFrom);
  return (
    <Img
      src={staticFile(dark ? brandFile.logo.onLight : brandFile.logo.onDark)}
      style={{
        width,
        height: "auto",
        display: "block",
        opacity: p,
        filter:
          !dark && brandFile.logo.whitenOnDark
            ? "brightness(0) invert(1)"
            : undefined,
        transform: `translateY(${(1 - p) * 12}px)`,
        ...style,
      }}
    />
  );
};
