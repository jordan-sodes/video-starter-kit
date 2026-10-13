import type { VideoEntry } from "../../lib/entry";
import { Example } from "./Example";
import { DURATION } from "./timeline";

export const video: VideoEntry = {
  id: "Example",
  component: Example,
  durationInFrames: DURATION,
  format: "landscape",
};
