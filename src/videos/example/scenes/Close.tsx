import React from "react";
import { EndCard, Stage } from "../../../components";
import { cue } from "../cues";

/** "Then you share it. Your first one takes an afternoon." */
export const Close: React.FC = () => (
  <Stage noLogo glow={{ x: "50%", y: "45%" }}>
    <EndCard at={cue("close", "share") - 6} line="Made by talking to Claude." />
  </Stage>
);
