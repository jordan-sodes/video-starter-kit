import React from "react";
import { Composition, Folder, Still } from "remotion";
import { FPS, formats } from "./brand";
import { ContactSheet, contactSheetMetadata } from "./lib/ContactSheet";
import { videos } from "./videos";

/** Every video in src/videos appears here automatically (scripts keep src/videos/index.ts up to date). */
export const RemotionRoot: React.FC = () => (
  <>
    {videos.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={v.component}
        durationInFrames={v.durationInFrames}
        fps={FPS}
        {...formats[v.format]}
      />
    ))}
    <Folder name="Tools">
      <Still
        id="ContactSheet"
        component={ContactSheet}
        width={1920}
        height={1080}
        defaultProps={{ images: [], labels: [], cols: 3 }}
        calculateMetadata={contactSheetMetadata}
      />
    </Folder>
  </>
);
