import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

export async function renderVideo(
  videoPath: string,
  outputPath: string,
  caption: string
) {
  // ✅ IMPORTANT: entry MUST be index.ts (NOT Root.tsx)
  const entryPoint = path.join(process.cwd(), "src/index.ts");

  const bundled = await bundle({
    entryPoint,
  });

  const composition = await selectComposition({
    serveUrl: bundled,
    id: "CaptionedVideo",
    inputProps: {
      videoSrc: videoPath,
      caption,
    },
  });

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: {
      videoSrc: videoPath,
      caption,
    },
  });

  return outputPath;
}