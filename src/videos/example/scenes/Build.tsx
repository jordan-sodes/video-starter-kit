import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand, ease, fonts, text, type } from "../../../brand";
import { Card, clamp, Logo, Stage, useIn } from "../../../components";
import { cue, words } from "../cues";
import { scene } from "../timeline";

const SWATCHES = [brand.primary, brand.primaryLight, brand.accent, brand.light];

/** "It builds every scene in your colours, your font and your logo, timed to the words." */
export const Build: React.FC = () => {
  const frame = useCurrentFrame();
  const colours = useIn(cue("build", "colours") - 4);
  const font = useIn(cue("build", "font") - 4);
  const logo = useIn(cue("build", "logo") - 4);
  const timed = useIn(cue("build", "timed") - 6);
  const voFrom = scene("build").voFrom;
  // The line's last four words, lit up as they're spoken.
  const line = words.build.slice(-4);
  const tile = (p: number): React.CSSProperties => ({
    opacity: p,
    transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + 0.08 * p})`,
  });
  return (
    <Stage eyebrow="3 · The scenes">
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 300,
          display: "flex",
          gap: 36,
        }}
      >
        <Card style={{ flex: 1.3, height: 330, ...tile(colours) }}>
          <div
            style={{ ...type.eyebrow, fontSize: 18, color: text.onDarkFaint }}
          >
            Your colours
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 50 }}>
            {SWATCHES.map((c, i) => {
              const p = interpolate(
                frame,
                [
                  cue("build", "colours") + i * 3,
                  cue("build", "colours") + i * 3 + 10,
                ],
                [0, 1],
                { ...clamp, easing: ease.out },
              );
              return (
                <div
                  key={c + i}
                  style={{
                    width: 120,
                    height: 150,
                    borderRadius: 20,
                    background: c,
                    transform: `scale(${p})`,
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              );
            })}
          </div>
        </Card>
        <Card style={{ flex: 1, height: 330, ...tile(font) }}>
          <div
            style={{ ...type.eyebrow, fontSize: 18, color: text.onDarkFaint }}
          >
            Your font
          </div>
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 800,
              fontSize: 170,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginTop: 40,
            }}
          >
            Aa
          </div>
        </Card>
        <Card style={{ flex: 1, height: 330, ...tile(logo) }}>
          <div
            style={{ ...type.eyebrow, fontSize: 18, color: text.onDarkFaint }}
          >
            Your logo
          </div>
          <div style={{ height: 220, display: "flex", alignItems: "center" }}>
            <Logo width={380} />
          </div>
        </Card>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 740,
          display: "flex",
          gap: 18,
          alignItems: "center",
          opacity: timed,
        }}
      >
        <div
          style={{
            ...type.eyebrow,
            fontSize: 18,
            color: text.onDarkFaint,
            marginRight: 14,
          }}
        >
          Timed to the words
        </div>
        {line.map((w, i) => {
          const at = voFrom + Math.round(w.s * 30);
          const on = interpolate(frame, [at - 2, at + 4], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                ...type.subhead,
                fontWeight: 700,
                fontSize: 44,
                padding: "14px 28px",
                borderRadius: 16,
                color: brand.white,
                background: "rgba(255,255,255,0.06)",
                boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.08), inset 0 0 0 ${3 * on}px ${brand.primary}`,
                opacity: 0.35 + 0.65 * on,
              }}
            >
              {w.w.replace(/[.,]/g, "")}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
