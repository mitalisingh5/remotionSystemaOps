import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";
import { ParsedCommand } from "./parseCommand";
import { renderVideo } from "./render";
import { generateSubtitles } from "./whisper";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function trimVideo(
  input: string,
  output: string,
  seconds: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
  ffmpeg(input)
    .setStartTime(seconds)
    .on("end", () => resolve())
    .on("error", (err) => reject(err))
    .save(output);
});
}

async function trimRange(
  input: string,
  output: string,
  start: number,
  end: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .setStartTime(start)
      .setDuration(end - start)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(output);
  });
}

async function speedVideo(
  input: string,
  output: string,
  speed: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .videoFilters(`setpts=${1 / speed}*PTS`)
      .audioFilters(`atempo=${speed}`)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(output);
  });
}
async function watermarkVideo(
  input: string,
  output: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .videoFilters(
        "drawtext=text='Video Remix':x=20:y=20:fontsize=40:fontcolor=white"
      )
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(output);
  });
}
async function burnSubtitles(
  input: string,
  subtitleFile: string,
  output: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    console.log("INPUT:", input);
    console.log("SUBTITLE:", subtitleFile);

    const escapedSubtitle = subtitleFile
      .replace(/\\/g, "/")
      .replace("C:", "C\\:");

    ffmpeg(input)
      .videoFilters(
        `subtitles='${escapedSubtitle}'`
      )
      .on("start", (cmd) => {
        console.log("FFMPEG CMD:", cmd);
      })
      .on("end", () => resolve())
      .on("error", (err) => {
        console.error("FFMPEG ERROR:", err);
        reject(err);
      })
      .save(output);
  });
}
export async function processVideo(
  inputPath: string,
  parsed: ParsedCommand
): Promise<string> {
  const outputDir = path.join(
    process.cwd(),
    "out",
    "processed"
  );
async function extractAudio(
  input: string,
  output: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioCodec("libmp3lame")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(output);
  });
}
  const publicDir = path.join(
    process.cwd(),
    "public"
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {
      recursive: true,
    });
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, {
      recursive: true,
    });
  }

  const publicVideo = path.join(
    publicDir,
    "input.mp4"
  );

  fs.copyFileSync(inputPath, publicVideo);

  const outputPath = path.join(
    outputDir,
    `edited-${Date.now()}.mp4`
  );

  console.log("Parsed Command:", parsed);

  // CUT FIRST N SECONDS
  if (
    parsed.intent === "cut" &&
    parsed.startTime !== undefined
  ) {
    console.log(
      `Cutting first ${parsed.startTime} seconds`
    );

    await trimVideo(
      publicVideo,
      outputPath,
      parsed.startTime
    );

    return outputPath;
  }
  

  // TRIM RANGE
  if (
    parsed.intent === "trim" &&
    parsed.startTime !== undefined &&
    parsed.endTime !== undefined
  ) {
    console.log(
      `Trimming ${parsed.startTime} -> ${parsed.endTime}`
    );

    await trimRange(
      publicVideo,
      outputPath,
      parsed.startTime,
      parsed.endTime
    );

    return outputPath;
  }
  if (
  parsed.intent === "subtitle"
) {
  const subtitleFile =
    await generateSubtitles(
      publicVideo
    );

  await burnSubtitles(
    publicVideo,
    subtitleFile,
    outputPath
  );

  return outputPath;
}
  // SPEED UP / SLOW DOWN
  if (
    parsed.intent === "speed" &&
    parsed.speed !== undefined
  ) {
    console.log(
      `Changing speed to ${parsed.speed}x`
    );

    await speedVideo(
      publicVideo,
      outputPath,
      parsed.speed
    );

    return outputPath;
  }

  // CAPTIONS
  if (parsed.intent === "caption") {
    await renderVideo(
      "http://localhost:5000/public/input.mp4",
      outputPath,
      parsed.text || ""
    );

    return outputPath;
  }

  if (parsed.intent === "watermark") {
  await watermarkVideo(
    publicVideo,
    outputPath
  );
  return outputPath;
}
  if (parsed.intent === "audio") {
  const audioPath = path.join(
    outputDir,
    `audio-${Date.now()}.mp3`
  );

  await extractAudio(
    publicVideo,
    audioPath
  );

  return audioPath;
}

  // DEFAULT
  await renderVideo(
    "http://localhost:5000/public/input.mp4",
    outputPath,
    parsed.text || "Video Remix"
  );

  return outputPath;
}