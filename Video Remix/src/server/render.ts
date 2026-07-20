import path from "path";
import {bundle} from "@remotion/bundler";
import {renderMedia, selectComposition} from "@remotion/renderer";

export async function renderVideo(
  videoPath: string,
  outputPath: string,
  caption: string
) {
  const bundleLocation = await bundle({
    entryPoint: path.join(process.cwd(), "src/remotion.ts"),
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "CaptionedVideo",
    inputProps: {
      videoSrc: videoPath,
      caption,
    },
  });

  await renderMedia({
    serveUrl: bundleLocation,
    composition,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: {
      videoSrc: videoPath,
      caption,
    },
    chromiumOptions: {
      disableWebSecurity: true,
    },
  });

  return outputPath;
}