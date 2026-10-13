import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Img } from "remotion";

type Props = {
  images: string[];
  labels: string[];
  cols: number;
  tileW?: number;
  tileH?: number;
};

/** Tiles still frames into one image so the whole video can be checked at a glance (npm run sheet). */
export const ContactSheet: React.FC<Props> = ({
  images,
  labels,
  tileW = 640,
  tileH = 360,
}) => (
  <AbsoluteFill
    style={{
      background: "#111",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignContent: "flex-start",
      padding: 4,
      gap: 8,
    }}
  >
    {images.map((src, i) => (
      <div key={i} style={{ width: tileW, position: "relative" }}>
        <Img
          src={src}
          style={{
            width: tileW,
            height: tileH,
            display: "block",
            objectFit: "contain",
            background: "#000",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 6,
            bottom: 6,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            font: "600 14px sans-serif",
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          {labels[i]}
        </div>
      </div>
    ))}
  </AbsoluteFill>
);

export const contactSheetMetadata: CalculateMetadataFunction<Props> = ({
  props,
}) => {
  const tileW = props.tileW ?? 640;
  const tileH = props.tileH ?? 360;
  const rows = Math.max(1, Math.ceil(props.images.length / props.cols));
  return {
    width: props.cols * (tileW + 8) + 0,
    height: rows * (tileH + 8) + 0,
  };
};
