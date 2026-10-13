import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand, ease, fonts, status, text, type } from "../../../brand";
import { Bubble, Card, clamp, Pill, Stage, useIn } from "../../../components";
import { cue } from "../cues";

const ROWS = [
  ["1", "This whole video was made by talking to Claude."],
  ["2", "You say what it's about and who it's for…"],
  ["3", "Then it makes the voiceover…"],
  ["4", "It builds every scene in your colours…"],
];

/** "You say what it's about and who it's for. Claude writes the script, and checks it with you first." */
export const Brief: React.FC = () => {
  const frame = useCurrentFrame();
  const script = cue("brief", "script");
  const card = useIn(script - 8);
  const ok = useIn(cue("brief", "checks"), { damping: 14, stiffness: 180 });
  return (
    <Stage eyebrow="1 · The script">
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 420,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <Bubble
          text="It's for small business owners."
          at={cue("brief", "say") - 2}
          width={640}
          speed={2.4}
        />
        <Bubble
          text="Keep it under 30 seconds."
          at={cue("brief", "for")}
          width={640}
          speed={2.4}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 860,
          top: 290,
          opacity: card,
          transform: `translateX(${(1 - card) * 60}px)`,
        }}
      >
        <Card style={{ width: 940, padding: 40 }}>
          <div
            style={{
              ...type.eyebrow,
              fontSize: 18,
              color: text.onDarkFaint,
              marginBottom: 24,
            }}
          >
            SCRIPT.md
          </div>
          {ROWS.map(([n, line], i) => {
            const p = interpolate(
              frame,
              [script + i * 6, script + i * 6 + 12],
              [0, 1],
              { ...clamp, easing: ease.out },
            );
            return (
              <div
                key={n}
                style={{
                  display: "flex",
                  gap: 22,
                  padding: "16px 0",
                  borderTop: i ? "1px solid rgba(255,255,255,0.08)" : "none",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 14}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: 24,
                    color: brand.primaryLight,
                    width: 26,
                  }}
                >
                  {n}
                </div>
                <div style={{ ...type.body, fontSize: 28, color: text.onDark }}>
                  {line}
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 26,
              opacity: ok,
              transform: `scale(${0.85 + 0.15 * ok})`,
              transformOrigin: "left center",
            }}
          >
            <Pill color={status.good} size={24}>
              ✓ Approved by you
            </Pill>
          </div>
        </Card>
      </div>
    </Stage>
  );
};
