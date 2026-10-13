import React from "react";
import { AbsoluteFill } from "remotion";
import { Bubble, Headline, Stage } from "../../../components";
import { cue } from "../cues";

/** "This whole video was made by talking to Claude." */
export const Hook: React.FC = () => (
  <Stage glow={{ x: "50%", y: "40%" }}>
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", gap: 70 }}
    >
      <Headline
        title={"This whole video was made\nby talking to Claude."}
        highlight={["talking", "Claude"]}
        at={2}
        size={104}
        align="center"
      />
      <Bubble
        text="Make a 30-second video about how you made this video."
        at={cue("hook", "talking") - 4}
        speed={2.6}
        width={1100}
        style={{ justifyContent: "center" }}
      />
    </AbsoluteFill>
  </Stage>
);
