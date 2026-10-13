import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { brand } from "../brand";
import { SceneFade } from "../components";
import { Scene } from "./voTimeline";

/**
 * Plays a whole video: each scene in its slot on the timeline, its voiceover clip,
 * and an optional music bed. Every video's master file is just this with its own scenes.
 */
export const Video = <Id extends string>({
  slug,
  scenes,
  components,
  music,
  musicVolume = 0.1,
  musicEndVolume = 0.18,
}: {
  slug: string;
  scenes: Scene<Id>[];
  components: Record<Id, React.FC>;
  /** e.g. "music/bed.mp3" inside public/<slug>/. */
  music?: string;
  /** Music level under the voice (0..1). */
  musicVolume?: number;
  /** Music level over the end card. */
  musicEndVolume?: number;
}) => {
  const { durationInFrames } = useVideoConfig();
  const last = scenes[scenes.length - 1];
  const endFrom = last.from + last.voFrom + last.voFrames;
  return (
    <AbsoluteFill style={{ background: brand.dark }}>
      {scenes.map((s, i) => {
        const S: React.FC = components[s.id];
        return (
          <Sequence
            key={s.id}
            from={s.from}
            durationInFrames={s.durationInFrames}
            name={s.id}
          >
            <SceneFade
              dur={s.durationInFrames}
              inFrames={i === 0 ? 1 : 10}
              outFrames={i === scenes.length - 1 ? 20 : 8}
            >
              <S />
            </SceneFade>
          </Sequence>
        );
      })}
      {scenes.map((s) =>
        s.file ? (
          <Sequence
            key={`vo-${s.id}`}
            from={s.from + s.voFrom}
            durationInFrames={s.voFrames}
            name={`voice ${s.id}`}
          >
            <Audio src={staticFile(`${slug}/vo/${s.file}`)} />
          </Sequence>
        ) : null,
      )}
      {music && (
        <Music
          src={`${slug}/${music}`}
          under={musicVolume}
          end={musicEndVolume}
          endFrom={endFrom}
          total={durationInFrames}
        />
      )}
    </AbsoluteFill>
  );
};

const Music: React.FC<{
  src: string;
  under: number;
  end: number;
  endFrom: number;
  total: number;
}> = ({ src, under, end, endFrom, total }) => {
  const frame = useCurrentFrame();
  const v = interpolate(
    frame,
    [0, 20, endFrom, endFrom + 20, total - 30, total],
    [0, under, under, end, end, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return <Audio src={staticFile(src)} volume={() => v} />;
};
