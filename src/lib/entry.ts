import React from "react";
import { FormatName } from "../brand";

/** What each video's video.ts exports, so it appears in the Studio. */
export type VideoEntry = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
  durationInFrames: number;
  format: FormatName;
};
