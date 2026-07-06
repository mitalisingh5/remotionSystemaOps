import { exec } from "child_process";
import path from "path";
import fs from "fs";
export async function generateSubtitles(
  videoPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const ffmpegDir =
      "C:\\Users\\Vanshik Jain\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin";

    const command =
  `set PATH=${ffmpegDir};%PATH% && set PYTHONIOENCODING=utf-8 && python -m whisper "${videoPath}" --model base --output_format srt --output_dir public --verbose False`;
    console.log("Running:", command);

    exec(command, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);

      if (err) {
        reject(err);
        return;
      }

      const subtitlePath = path.join(
        path.dirname(videoPath),
        path.basename(videoPath, ".mp4") + ".srt"
      );
      if (!fs.existsSync(subtitlePath)) {
  reject(
    new Error(
      `Subtitle file not found: ${subtitlePath}`
    )
  );
  return;
}
      resolve(subtitlePath);
    });
  });
}