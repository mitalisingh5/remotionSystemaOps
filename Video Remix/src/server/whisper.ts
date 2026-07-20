import { execFile } from "child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

export interface TranscriptFiles {
  json: string;
  vtt: string;
  srt: string;
}

/** Produces JSON and WebVTT transcripts, plus SRT for caption burn-in. */
export async function generateTranscript(videoPath: string, outputDir: string): Promise<TranscriptFiles> {
  await fs.promises.mkdir(outputDir, { recursive: true });
  const environment = {
    ...process.env,
    PATH: `${path.dirname(ffmpegInstaller.path)}${path.delimiter}${process.env.PATH ?? ""}`,
    PYTHONIOENCODING: "utf-8",
  };

  await new Promise<void>((resolve, reject) => {
    execFile("python", ["-m", "whisper", videoPath, "--model", process.env.WHISPER_MODEL ?? "base", "--output_format", "all", "--output_dir", outputDir, "--verbose", "False"], { env: environment, windowsHide: true }, (error, _stdout, stderr) => {
      if (error) {
        reject(new Error(`Whisper transcription failed. Install it with \"pip install -U openai-whisper\". ${stderr}`));
        return;
      }
      resolve();
    });
  });

  const basename = path.basename(videoPath, path.extname(videoPath));
  const json = path.join(outputDir, `${basename}.json`);
  const vtt = path.join(outputDir, `${basename}.vtt`);
  const srt = path.join(outputDir, `${basename}.srt`);
  const missing = [json, vtt, srt].filter((file) => !fs.existsSync(file));
  if (missing.length) throw new Error(`Whisper did not create: ${missing.join(", ")}`);
  return { json, vtt, srt };
}
