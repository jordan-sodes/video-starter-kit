import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { brand, ease, fonts, surface, text } from "../brand";
import { clamp, useIn, useOut } from "./anim";

/**
 * A screenshot in a simple browser window. `imgW` x `imgH` is the image's real size in pixels;
 * children (Ring, Tag) are positioned in those same pixels, so highlights line up exactly.
 */
export const Screen: React.FC<{
  src: string;
  imgW: number;
  imgH: number;
  width: number;
  url?: string;
  chrome?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  src,
  imgW,
  imgH,
  width,
  url = brand.website,
  chrome = true,
  children,
  style,
}) => {
  const k = width / imgW;
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: "hidden",
        background: "#fff",
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      {chrome && (
        <div
          style={{
            height: 44,
            background: "#F3F2F5",
            borderBottom: "1px solid #E4E2E8",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 18px",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{ width: 13, height: 13, borderRadius: 7, background: c }}
            />
          ))}
          <div
            style={{
              marginLeft: 18,
              flex: 1,
              maxWidth: 520,
              height: 26,
              borderRadius: 8,
              background: "#fff",
              border: "1px solid #E4E2E8",
              fontFamily: fonts.sans,
              fontSize: 14,
              color: "#6E6E6E",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
            }}
          >
            {url}
          </div>
        </div>
      )}
      <div style={{ position: "relative", width, height: imgH * k }}>
        <Img
          src={staticFile(src)}
          style={{ width, height: imgH * k, display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: imgW,
            height: imgH,
            transform: `scale(${k})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/** A ring that draws around a region of a screenshot (screenshot pixels). `dim` darkens everything else. */
export const Ring: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  until?: number;
  color?: string;
  radius?: number;
  stroke?: number;
  dim?: boolean;
}> = ({
  x,
  y,
  w,
  h,
  at,
  until,
  color = brand.primary,
  radius = 12,
  stroke = 4,
  dim = false,
}) => {
  const p = useIn(at, { damping: 22, stiffness: 160 });
  const o = Math.min(p, useOut(until));
  const pad = 8 * (1 - p) + 6;
  return (
    <>
      {dim && (
        <div
          style={{
            position: "absolute",
            left: x - 6,
            top: y - 6,
            width: w + 12,
            height: h + 12,
            borderRadius: radius,
            boxShadow: `0 0 0 4000px rgba(10,10,16,${0.45 * o})`,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x - pad,
          top: y - pad,
          width: w + pad * 2,
          height: h + pad * 2,
          borderRadius: radius,
          border: `${stroke}px solid ${color}`,
          boxShadow: `0 0 24px ${color}88, inset 0 0 12px ${color}33`,
          opacity: o,
        }}
      />
    </>
  );
};

/** A label pill that pops in next to a highlight (screenshot pixels). */
export const Tag: React.FC<{
  x: number;
  y: number;
  at: number;
  until?: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
}> = ({ x, y, at, until, children, color = brand.primary, size = 22 }) => {
  const p = useIn(at, { damping: 18, stiffness: 180 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateY(${(1 - p) * 10}px) scale(${0.9 + 0.1 * p})`,
        transformOrigin: "left center",
        opacity: Math.min(p, useOut(until)),
        background: color,
        color: brand.white,
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: size,
        padding: `${size * 0.4}px ${size * 0.75}px`,
        borderRadius: 999,
        whiteSpace: "nowrap",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
};

/** Slow pan and zoom between keyframes. `f` is a frame in the scene (often a cue), x/y in px, s = scale. */
export const Camera: React.FC<{
  keys: { f: number; x?: number; y?: number; s?: number }[];
  children: React.ReactNode;
  origin?: string;
}> = ({ keys, children, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const v = (prop: "x" | "y" | "s", d: number) =>
    keys.length === 1
      ? (keys[0][prop] ?? d)
      : interpolate(
          frame,
          fs,
          keys.map((k) => k[prop] ?? d),
          { ...clamp, easing: ease.inOut },
        );
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${v("x", 0)}px, ${v("y", 0)}px) scale(${v("s", 1)})`,
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * A phone showing app screenshots (paths in public/). `index` picks the screenshot;
 * fractional values crossfade (animate it from 0 to 1 to change screens).
 * `shotW` x `shotH` is the screenshots' real size (an iPhone is about 1206 x 2622).
 */
export const Phone: React.FC<{
  shots: string[];
  index?: number;
  width?: number;
  shotW?: number;
  shotH?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  shots,
  index = 0,
  width = 380,
  shotW = 1206,
  shotH = 2622,
  style,
  children,
}) => {
  const pad = width * 0.035;
  const inner = width - pad * 2;
  const innerH = inner * (shotH / shotW);
  const i0 = Math.max(0, Math.min(shots.length - 1, Math.floor(index)));
  const i1 = Math.min(shots.length - 1, i0 + 1);
  const t = Math.max(0, Math.min(1, index - i0));
  return (
    <div
      style={{
        width,
        height: innerH + pad * 2,
        borderRadius: width * 0.13,
        background: "#0B0B10",
        padding: pad,
        boxShadow:
          "0 40px 100px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: inner,
          height: innerH,
          borderRadius: width * 0.1,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Img
          src={staticFile(shots[i0])}
          style={{
            position: "absolute",
            inset: 0,
            width: inner,
            height: innerH,
          }}
        />
        {t > 0 && i1 !== i0 && (
          <Img
            src={staticFile(shots[i1])}
            style={{
              position: "absolute",
              inset: 0,
              width: inner,
              height: innerH,
              opacity: t,
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

/** A dark card for motion-graphic panels (mock-ups, stats, quotes). */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${surface.cardHi}, ${surface.card})`,
      border: `1px solid ${surface.line}`,
      borderRadius: 24,
      boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      padding: 36,
      fontFamily: fonts.sans,
      color: text.onDark,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A small rounded label, e.g. a status or category. */
export const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = brand.primary, size = 22, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: fonts.sans,
      fontWeight: 700,
      fontSize: size,
      color,
      background: `${color}22`,
      border: `1px solid ${color}55`,
      borderRadius: 999,
      padding: `${size * 0.3}px ${size * 0.7}px`,
      ...style,
    }}
  >
    {children}
  </span>
);
