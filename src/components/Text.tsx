import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand, enter, rise, text, type, useScale } from "../brand";
import { useIn, useOut } from "./anim";

/** Brand-colour emphasis for one or two words: <Hi>today</Hi>. */
export const Hi: React.FC<{ children: React.ReactNode; light?: boolean }> = ({
  children,
  light,
}) => (
  <span style={{ color: light ? brand.primary : brand.primaryLight }}>
    {children}
  </span>
);

/**
 * A big headline whose words rise in one after another, starting at `at`.
 * `highlight` lists words to colour in the brand colour. Use "\n" for a line break.
 */
export const Headline: React.FC<{
  title: string;
  at?: number;
  until?: number;
  highlight?: string[];
  eyebrow?: string;
  subtitle?: string;
  size?: number;
  light?: boolean;
  align?: "left" | "center";
  maxWidth?: number;
}> = ({
  title,
  at = 0,
  until,
  highlight = [],
  eyebrow,
  subtitle,
  size = 96,
  light = false,
  align = "left",
  maxWidth = 1500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const out = useOut(until);
  let i = 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24 * s,
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        maxWidth: maxWidth * s,
        opacity: out,
      }}
    >
      {eyebrow && (
        <div
          style={{
            ...type.eyebrow,
            fontSize: 24 * s,
            color: light ? brand.primary : brand.primaryLight,
            ...rise(enter(frame, fps, at), 20 * s),
          }}
        >
          {eyebrow}
        </div>
      )}
      <div
        style={{
          ...type.headline,
          fontSize: size * s,
          color: light ? text.onLight : text.onDark,
        }}
      >
        {title.split("\n").map((line, li) => (
          <div key={li}>
            {line.split(" ").map((w) => {
              const n = i++;
              const hot = highlight.some(
                (h) =>
                  w.replace(/[^\w']/g, "").toLowerCase() === h.toLowerCase(),
              );
              return (
                <span
                  key={n}
                  style={{
                    display: "inline-block",
                    marginRight: "0.25em",
                    color: hot
                      ? light
                        ? brand.primary
                        : brand.primaryLight
                      : undefined,
                    ...rise(enter(frame, fps, at + 4 + n * 3), 40 * s),
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {subtitle && (
        <div
          style={{
            ...type.subhead,
            fontSize: size * 0.38 * s,
            color: light ? text.onLightMuted : text.onDarkMuted,
            ...rise(enter(frame, fps, at + 10 + i * 3), 20 * s),
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

/** A short statement in the lower-left that lands on a cue. Good over screenshots and photos. */
export const Caption: React.FC<{
  at: number;
  until?: number;
  title: React.ReactNode;
  sub?: React.ReactNode;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
}> = ({ at, until, title, sub, x = 110, y = 840, width = 1000, size = 56 }) => {
  const p = useIn(at);
  const ps = useIn(at + 8);
  const out = useOut(until);
  return (
    <div style={{ position: "absolute", left: x, top: y, width, opacity: out }}>
      <div
        style={{
          ...type.headline,
          fontSize: size,
          color: text.onDark,
          opacity: p,
          transform: `translateY(${(1 - p) * 24}px)`,
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            ...type.subhead,
            fontSize: size * 0.48,
            color: text.onDarkMuted,
            marginTop: 14,
            opacity: ps,
            transform: `translateY(${(1 - ps) * 16}px)`,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/** A list whose items appear one by one, each at its own frame (`at[i]`, usually a cue). */
export const Points: React.FC<{
  items: string[];
  at: number[];
  size?: number;
  light?: boolean;
  style?: React.CSSProperties;
}> = ({ items, at, size = 44, light, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: size * 0.6,
        ...style,
      }}
    >
      {items.map((it, i) => {
        const p = enter(frame, fps, at[i] ?? at[at.length - 1] + i * 8);
        return (
          <div
            key={it}
            style={{
              display: "flex",
              alignItems: "center",
              gap: size * 0.5,
              ...rise(p, 24),
            }}
          >
            <div
              style={{
                width: size * 0.36,
                height: size * 0.36,
                borderRadius: 99,
                background: brand.primary,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                ...type.subhead,
                fontWeight: 600,
                fontSize: size,
                color: light ? text.onLight : text.onDark,
              }}
            >
              {it}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** A number that counts up from `from` to `to` between frames `at` and `at + dur`. */
export const Counter: React.FC<{
  to: number;
  at: number;
  from?: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  size?: number;
  color?: string;
}> = ({
  to,
  at,
  from = 0,
  dur = 40,
  prefix = "",
  suffix = "",
  decimals = 0,
  size = 160,
  color = text.onDark,
}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, Math.min(1, (frame - at) / dur));
  const v = from + (to - from) * (1 - Math.pow(1 - t, 3));
  return (
    <div
      style={{
        ...type.headline,
        fontSize: size,
        color,
        fontVariantNumeric: "tabular-nums",
        opacity: frame < at ? 0 : 1,
      }}
    >
      {prefix}
      {v.toLocaleString("en-AU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </div>
  );
};

/**
 * A chat message that types itself out from frame `at` (about 2 characters a frame).
 * `from="me"` sits right in the brand colour; `from="claude"` sits left on a card.
 */
export const Bubble: React.FC<{
  text: string;
  at: number;
  from?: "me" | "claude";
  size?: number;
  speed?: number;
  width?: number;
  style?: React.CSSProperties;
}> = ({
  text: msg,
  at,
  from = "me",
  size = 34,
  speed = 2,
  width = 760,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(at);
  const shown = Math.max(0, Math.floor((frame - at) * speed));
  const me = from === "me";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: me ? "flex-end" : "flex-start",
        width,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        ...style,
      }}
    >
      <div
        style={{
          ...type.body,
          fontSize: size,
          color: brand.white,
          background: me ? brand.primary : "rgba(255,255,255,0.08)",
          border: me ? "none" : "1px solid rgba(255,255,255,0.12)",
          borderRadius: size * 0.9,
          borderBottomRightRadius: me ? size * 0.2 : size * 0.9,
          borderBottomLeftRadius: me ? size * 0.9 : size * 0.2,
          padding: `${size * 0.5}px ${size * 0.75}px`,
          maxWidth: width,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Reserve the full size so the bubble doesn't grow as it types. */}
        <span style={{ position: "relative", display: "block" }}>
          <span style={{ visibility: "hidden" }}>{msg}</span>
          <span style={{ position: "absolute", inset: 0 }}>
            {msg.slice(0, shown)}
          </span>
        </span>
      </div>
    </div>
  );
};
