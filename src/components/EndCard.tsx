import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, enter, rise, text, type, useScale } from "../brand";
import { Logo } from "./Logo";

/** The closing frame: logo, an optional line, an optional button and the website. */
export const EndCard: React.FC<{
  line?: string;
  cta?: string;
  url?: string;
  at?: number;
}> = ({ line, cta, url = brand.website, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 44 * s,
        textAlign: "center",
      }}
    >
      <Logo width={460 * s} animateFrom={at} />
      {line && (
        <div
          style={{
            ...type.subhead,
            fontSize: 42 * s,
            color: text.onDarkMuted,
            maxWidth: 1300 * s,
            ...rise(enter(frame, fps, at + 14), 20 * s),
          }}
        >
          {line}
        </div>
      )}
      {cta && (
        <div
          style={{
            ...type.subhead,
            fontWeight: 700,
            fontSize: 32 * s,
            color: brand.white,
            background: brand.primary,
            borderRadius: 999,
            padding: `${20 * s}px ${52 * s}px`,
            ...rise(enter(frame, fps, at + 22), 20 * s),
          }}
        >
          {cta}
        </div>
      )}
      {url && (
        <div
          style={{
            ...type.eyebrow,
            fontSize: 24 * s,
            color: text.onDarkFaint,
            ...rise(enter(frame, fps, at + 28), 10 * s),
          }}
        >
          {url}
        </div>
      )}
    </AbsoluteFill>
  );
};
