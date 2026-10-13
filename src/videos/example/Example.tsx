// Made by the kit (npm run scenes). Add music with: music="music/bed.mp3"
import React from "react";
import { Video } from "../../lib/Video";
import { scenes, SceneId } from "./timeline";
import { Hook } from "./scenes/Hook";
import { Brief } from "./scenes/Brief";
import { Voice } from "./scenes/Voice";
import { Build } from "./scenes/Build";
import { Fix } from "./scenes/Fix";
import { Close } from "./scenes/Close";

const components: Record<SceneId, React.FC> = {
  hook: Hook,
  brief: Brief,
  voice: Voice,
  build: Build,
  fix: Fix,
  close: Close,
};

/** Make a video with Claude */
export const Example: React.FC = () => (
  <Video slug="example" scenes={scenes} components={components} />
);
