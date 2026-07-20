import "dotenv/config";
import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parseCommand } from "./parseCommand";
import { CaptionStyle, insertBroll, processVideo, renderStyledCaptions } from "./processVideo";
import { searchStockVideos } from "./pexels";

type UploadRequest = Request & {
  file?: Express.Multer.File;
};

const app = express();

const upload = multer({
  dest: "uploads/",
});

app.use(express.json());

// Serve uploaded videos for Remotion
app.use(
  "/public",
  express.static(path.join(process.cwd(), "public"))
);

// Serve processed output videos
app.use(
  "/out",
  express.static(path.join(process.cwd(), "out"))
);

// ------------------------------
// Health Check
// ------------------------------
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Video Remix Backend Running 🚀",
  });
});

// ------------------------------
// Process Video
// ------------------------------
app.post(
  "/api/process",
  upload.single("video"),
  async (req: UploadRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No video uploaded",
        });
      }

      const command = req.body.command || "";

      console.log("📥 Video:", req.file.path);
      console.log("💬 Command:", command);

      const parsed = parseCommand(command);

      console.log("🧠 Parsed:", parsed);

      const result = await processVideo(
        req.file.path,
        parsed
      );

      // Delete temporary upload file
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(
            "Failed to delete temp file:",
            err
          );
        }
      });

      const toOutputUrl = (filePath: string) => filePath
        .replace(process.cwd(), "")
        .replace(/\\/g, "/")
        .replace(/^\/?out/, "/out");

      return res.json({
        success: true,
        outputUrl: toOutputUrl(result.outputPath),
        audioUrl: result.audioPath ? toOutputUrl(result.audioPath) : undefined,
        transcriptJsonUrl: result.transcriptJsonPath ? toOutputUrl(result.transcriptJsonPath) : undefined,
        transcriptVttUrl: result.transcriptVttPath ? toOutputUrl(result.transcriptVttPath) : undefined,
        sourceVideoUrl: result.sourceVideoPath ? "/public/" + path.basename(result.sourceVideoPath) : undefined,
        subtitleSrtUrl: result.subtitleSrtPath ? toOutputUrl(result.subtitleSrtPath) : undefined,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Video processing failed";
      console.error(
        "❌ Processing Error:",
        err
      );

      return res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
);

app.post("/api/style-captions", async (req: Request, res: Response) => {
  try {
    const { sourceVideoUrl, subtitleSrtUrl, fontName, fontColor, fontSize, italic, filter } = req.body;
    if (typeof sourceVideoUrl !== "string" || typeof subtitleSrtUrl !== "string") {
      return res.status(400).json({ success: false, error: "A source video and subtitle file are required" });
    }
    const sourceVideo = path.join(process.cwd(), "public", path.basename(sourceVideoUrl));
    const subtitleFile = path.join(process.cwd(), "out", "processed", path.basename(subtitleSrtUrl));
    if (!fs.existsSync(sourceVideo) || !fs.existsSync(subtitleFile)) {
      return res.status(404).json({ success: false, error: "The original video or subtitle file is no longer available" });
    }
    const style: CaptionStyle = {
      fontName: ["Arial", "Georgia", "Verdana"].includes(fontName) ? fontName : "Arial",
      fontColor: /^#[0-9a-fA-F]{6}$/.test(fontColor) ? fontColor : "#FFFFFF",
      fontSize: Math.min(72, Math.max(20, Number(fontSize) || 40)),
      italic: Boolean(italic),
      filter: ["none", "grayscale", "warm", "cool"].includes(filter) ? filter : "none",
    };
    const outputPath = await renderStyledCaptions(sourceVideo, subtitleFile, style);
    return res.json({ success: true, outputUrl: outputPath.replace(process.cwd(), "").replace(/\\/g, "/").replace(/^\/?out/, "/out") });
  } catch (err) {
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Could not style captions" });
  }
});

app.get("/api/stock/search", async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!query) return res.status(400).json({ success: false, error: "Enter a visual search term" });
    return res.json({ success: true, videos: await searchStockVideos(query) });
  } catch (err) {
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Stock-video search failed" });
  }
});

app.post("/api/stock/insert", async (req: Request, res: Response) => {
  try {
    const { sourceVideoUrl, stockVideoUrl, startTime, duration } = req.body;
    if (typeof sourceVideoUrl !== "string" || typeof stockVideoUrl !== "string") return res.status(400).json({ success: false, error: "A source video and stock clip are required" });
    const sourceVideo = path.join(process.cwd(), "public", path.basename(sourceVideoUrl));
    if (!fs.existsSync(sourceVideo) || !stockVideoUrl.startsWith("https://")) return res.status(400).json({ success: false, error: "Invalid source or stock video" });
    const outputPath = await insertBroll(sourceVideo, stockVideoUrl, Math.max(0, Number(startTime) || 0), Math.min(10, Math.max(1, Number(duration) || 3)));
    return res.json({ success: true, outputUrl: outputPath.replace(process.cwd(), "").replace(/\\/g, "/").replace(/^\/?out/, "/out") });
  } catch (err) {
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Could not insert stock video" });
  }
});

const PORT = process.env.VITE_SERVER_PORT
  ? Number(process.env.VITE_SERVER_PORT)
  : 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});
