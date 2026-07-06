import { Composition } from "remotion";
import { CaptionedVideo } from "./compositions/CaptionedVideo";
import { HighlightReel } from "./compositions/HighlightReel";
import { Explainer } from "./compositions/Explainer";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: "Video with Captions",
        }}
      />
      <Composition
        id="HighlightReel"
        component={HighlightReel as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          highlights: [10, 50, 100],
        }}
      />
      <Composition
        id="Explainer"
        component={Explainer as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          title: "Edited Video",
          subtitle: "Created with Video Remix",
        }}
      />
    </>
  );
};
