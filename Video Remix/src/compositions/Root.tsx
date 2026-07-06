import React from "react";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
  id="CaptionedVideo"
  component={CaptionedVideo as unknown as React.ComponentType<Record<string, unknown>>}
  durationInFrames={300}
  fps={30}
  width={1280}
  height={720}
  defaultProps={{
    videoSrc: "",
    caption: "",
  }}
/>
  );
};