import React from "react";
import { useCurrentFrame } from "remotion";
import { alpha, brand, fonts, status, text, type } from "../../../brand";
import { Card, Headline, Stage, useIn } from "../../../components";
import { cue } from "../cues";

/** Animated bars standing in for a recording. Deterministic, so every render matches. */
const Wave: React.FC<{ seed: number; live: boolean; color: string }> = ({
  seed,
  live,
  color,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, height: 60 }}>
      {Array.from({ length: 38 }, (_, i) => {
        const base =
          0.3 +
          0.7 *
            Math.abs(Math.sin(i * 0.7 + seed) * Math.cos(i * 0.31 + seed * 2));
        const move = live ? 0.75 + 0.25 * Math.sin(frame * 0.35 + i) : 1;
        return (
          <div
            key={i}
            style={{
              width: 7,
              borderRadius: 4,
              height: 60 * base * move,
              background: color,
            }}
          />
        );
      })}
    </div>
  );
};

/** "Then it makes the voiceover. You listen, and pick the takes you like." */
export const Voice: React.FC = () => {
  const cardIn = useIn(cue("voice", "voiceover") - 6);
  const pick = useIn(cue("voice", "pick"), { damping: 16, stiffness: 170 });
  return (
    <Stage eyebrow="2 · The voice">
      <div style={{ position: "absolute", left: 110, top: 380 }}>
        <Headline
          title={"You listen.\nYou pick."}
          highlight={["pick"]}
          at={cue("voice", "listen") - 6}
          size={110}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 270,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 40}px)`,
        }}
      >
        <Card
          style={{
            width: 860,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {["A", "B", "C"].map((t, i) => {
            const chosen = t === "B";
            const hi = chosen ? pick : 0;
            return (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "18px 24px",
                  borderRadius: 18,
                  background: `rgba(255,255,255,${0.04 + 0.04 * hi})`,
                  border: `3px solid ${chosen ? alpha(brand.primary, hi) : "transparent"}`,
                  opacity: chosen ? 1 : 1 - 0.45 * pick,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontWeight: 800,
                    fontSize: 30,
                    color: text.onDark,
                    width: 30,
                  }}
                >
                  {t}
                </div>
                <Wave
                  seed={i * 3 + 1}
                  live={chosen && hi < 0.5}
                  color={chosen ? brand.primaryLight : "rgba(255,255,255,0.4)"}
                />
                <div
                  style={{
                    ...type.headline,
                    fontSize: 34,
                    color: status.good,
                    opacity: hi,
                    marginLeft: "auto",
                  }}
                >
                  ✓
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </Stage>
  );
};
