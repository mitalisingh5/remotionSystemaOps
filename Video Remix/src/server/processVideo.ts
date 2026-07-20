import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";
import { ParsedCommand } from "./parseCommand";
import { renderVideo } from "./render";
import { generateTranscript } from "./whisper";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface ProcessedVideo {
  outputPath: string;
  audioPath?: string;
  transcriptJsonPath?: string;
  transcriptVttPath?: string;
  sourceVideoPath?: string;
  subtitleSrtPath?: string;
}

export interface CaptionStyle {
  fontName: string;
  fontColor: string;
  fontSize: number;
  italic: boolean;
  filter: "none" | "grayscale" | "warm" | "cool";
}

const runFfmpeg = (command: ffmpeg.FfmpegCommand, output: string): Promise<void> =>
  new Promise((resolve, reject) => command.on("end", () => resolve()).on("error", reject).save(output));

const trimVideo = (input: string, output: string, seconds: number) => runFfmpeg(ffmpeg(input).setStartTime(seconds), output);
const trimRange = (input: string, output: string, start: number, end: number) => runFfmpeg(ffmpeg(input).setStartTime(start).setDuration(end - start), output);
const speedVideo = (input: string, output: string, speed: number) => runFfmpeg(ffmpeg(input).videoFilters(`setpts=${1 / speed}*PTS`).audioFilters(`atempo=${speed}`), output);
const watermarkVideo = (input: string, output: string) => runFfmpeg(ffmpeg(input).videoFilters("drawtext=text='Video Remix':x=20:y=20:fontsize=40:fontcolor=white"), output);
const extractAudio = (input: string, output: string) => runFfmpeg(ffmpeg(input).noVideo().audioCodec("libmp3lame"), output);

const hexToAssColor = (hex: string) => {
  const value = hex.replace("#", "");
  return value.length === 6 ? `&H00${value.slice(4, 6)}${value.slice(2, 4)}${value.slice(0, 2)}` : "&H00FFFFFF";
};

export async function burnSubtitles(input: string, subtitleFile: string, output: string, style?: CaptionStyle): Promise<void> {
  const escapedSubtitle = subtitleFile.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
  const subtitleStyle = style ? `:force_style='FontName=${style.fontName},PrimaryColour=${hexToAssColor(style.fontColor)},FontSize=${style.fontSize},Italic=${style.italic ? -1 : 0}'` : "";
  const filters = [`subtitles='${escapedSubtitle}'${subtitleStyle}`];
  if (style?.filter === "grayscale") filters.unshift("hue=s=0");
  if (style?.filter === "warm") filters.unshift("colorbalance=rs=.12:gs=.03:bs=-.08");
  if (style?.filter === "cool") filters.unshift("colorbalance=rs=-.08:gs=.02:bs=.12");
  await runFfmpeg(ffmpeg(input).videoFilters(filters), output);
}

export async function renderStyledCaptions(input: string, subtitleFile: string, style: CaptionStyle): Promise<string> {
  const outputDir = path.join(process.cwd(), "out", "processed");
  const outputPath = path.join(outputDir, `styled-captions-${Date.now()}.mp4`);
  await burnSubtitles(input, subtitleFile, outputPath, style);
  return outputPath;
}

export async function processVideo(inputPath: string, parsed: ParsedCommand): Promise<ProcessedVideo> {
  const outputDir = path.join(process.cwd(), "out", "processed");
  const publicDir = path.join(process.cwd(), "public");
  await Promise.all([fs.promises.mkdir(outputDir, { recursive: true }), fs.promises.mkdir(publicDir, { recursive: true })]);

  const jobId = Date.now().toString();
  const publicVideo = path.join(publicDir, `input-${jobId}${path.extname(inputPath) || ".mp4"}`);
  await fs.promises.copyFile(inputPath, publicVideo);
  const outputPath = path.join(outputDir, `edited-${jobId}.mp4`);

  if (parsed.intent === "cut" && parsed.startTime !== undefined) {
    await trimVideo(publicVideo, outputPath, parsed.startTime);
    return { outputPath };
  }
  if (parsed.intent === "trim" && parsed.startTime !== undefined && parsed.endTime !== undefined) {
    await trimRange(publicVideo, outputPath, parsed.startTime, parsed.endTime);
    return { outputPath };
  }
  if (parsed.intent === "speed" && parsed.speed !== undefined) {
    await speedVideo(publicVideo, outputPath, parsed.speed);
    return { outputPath };
  }
  if (parsed.intent === "watermark") {
    await watermarkVideo(publicVideo, outputPath);
    return { outputPath };
  }
  if (parsed.intent === "audio") {
    const audioPath = path.join(outputDir, `audio-${jobId}.mp3`);
    await extractAudio(publicVideo, audioPath);
    return { outputPath: audioPath, audioPath };
  }
  if (parsed.intent === "subtitle") {
    const transcript = await generateTranscript(publicVideo, outputDir);
    await burnSubtitles(publicVideo, transcript.srt, outputPath);
    return { outputPath, transcriptJsonPath: transcript.json, transcriptVttPath: transcript.vtt, sourceVideoPath: publicVideo, subtitleSrtPath: transcript.srt };
  }

  await renderVideo(`http://localhost:5000/public/${path.basename(publicVideo)}`, outputPath, parsed.text || "Video Remix");
  return { outputPath };
}
