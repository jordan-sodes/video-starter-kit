import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand, ease, gradients, text, type } from "../../../brand";
import { Bubble, clamp, Stage } from "../../../components";
import { cue } from "../cues";

/** "Don't like something? Just say so, and it changes it." */
export const Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const at = cue("fix", "changes");
  const grow = interpolate(frame, [at, at + 16], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  return (
    <Stage eyebrow="4 · Changes">
      <div style={{ position: "absolute", left: 110, top: 420 }}>
        <Bubble
          text="Make the headline bigger, and add “today”."
          at={cue("fix", "like") - 4}
          width={720}
          speed={3}
        />
      </div>
      {/* A small frame of "your video" that updates when asked. */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 270,
          width: 880,
          height: 495,
          borderRadius: 22,
          overflow: "hidden",
          background: gradients.glow("60%", "30%"),
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 140,
            ...type.headline,
            color: text.onDark,
            fontSize: interpolate(grow, [0, 1], [48, 80]),
          }}
        >
          Open for bookings
          <br />
          <span style={{ color: brand.primaryLight, opacity: grow }}>
            today
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 6,
            background: brand.primary,
            transform: `scaleX(${grow})`,
            transformOrigin: "left",
          }}
        />
      </div>
    </Stage>
  );
};
