import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";
import { ParsedCommand } from "./parseCommand";
import { renderVideo } from "./render";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function copyVideo(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .videoCodec("copy")
      .audioCodec("copy")
      .on("end", () => resolve())
      .on("error", reject)
      .save(output);
  });
}

export async function processVideo(
  inputPath: string,
  parsed: ParsedCommand
): Promise<string> {
  const outputDir = path.join(process.cwd(), "out", "processed");
  const publicDir = path.join(process.cwd(), "public");

  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir, { recursive: true });

  if (!fs.existsSync(publicDir))
    fs.mkdirSync(publicDir, { recursive: true });

  // Copy uploaded video to public for Remotion
  const publicVideo = path.join(publicDir, "input.mp4");

  fs.copyFileSync(inputPath, publicVideo);

  const outputPath = path.join(
    outputDir,
    `edited-${Date.now()}.mp4`
  );

  const caption =
    parsed.text ||
    parsed.intent ||
    "Video Remix";

  await renderVideo(
  "http://localhost:5000/public/input.mp4",
  outputPath,
  caption
);

  return outputPath;
}

