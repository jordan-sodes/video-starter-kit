import React from "react";
import { Img, staticFile } from "remotion";

/**
 * A screenshot on a white card with an optional horizontal band cut out
 * (for hiding a row). Children sit in the cut image's pixel space.
 */
export const Shot: React.FC<{
  src: string;
  imgW: number;
  imgH: number;
  width: number;
  cut?: [number, number];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ src, imgW, imgH, width, cut, children, style }) => {
  const k = width / imgW;
  const band = cut ? cut[1] - cut[0] : 0;
  const h = imgH - band;
  const part = (top: number, bottom: number, offset: number) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: offset * k,
        width,
        height: (bottom - top) * k,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: 0,
          top: -top * k,
          width,
          height: imgH * k,
        }}
      />
    </div>
  );
  return (
    <div
      style={{
        position: "relative",
        width,
        height: h * k,
        borderRadius: 18,
        overflow: "hidden",
        background: "#fff",
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      {cut ? (
        <>
          {part(0, cut[0], 0)}
          {part(cut[1], imgH, cut[0])}
        </>
      ) : (
        part(0, imgH, 0)
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: imgW,
          height: h,
          transform: `scale(${k})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
    </div>
  );
};
