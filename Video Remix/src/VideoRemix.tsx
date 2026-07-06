import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { ContentScene } from "./scenes/ContentScene";
import { OutroScene } from "./scenes/OutroScene";

interface VideoRemixProps {
  title: string;
  subtitle: string;
}

export const VideoRemix: React.FC<VideoRemixProps> = ({ title, subtitle }) => {
  return (
    <AbsoluteFill>
      {/* Intro: 0–90 frames */}
      <Sequence from={0} durationInFrames={90}>
        <IntroScene text={title} />
      </Sequence>

      {/* Content: 90–210 frames */}
      <Sequence from={90} durationInFrames={120}>
        <ContentScene title={title} subtitle={subtitle} />
      </Sequence>

      {/* Outro: 210–300 frames */}
      <Sequence from={210} durationInFrames={90}>
        <OutroScene text="Thanks for watching!" />
      </Sequence>
    </AbsoluteFill>
  );
};
