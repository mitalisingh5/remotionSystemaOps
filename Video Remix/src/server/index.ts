import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parseCommand } from "./parseCommand";
import { processVideo } from "./processVideo";

type UploadRequest = Request & {
  file?: Express.Multer.File;
};

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());

// Serve processed videos
app.use("/out", express.static(path.join(process.cwd(), "out")));

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
          error: "No video uploaded",
        });
      }

      const command = req.body.command || "";

      console.log("📥 Video:", req.file.path);
      console.log("💬 Command:", command);

      const parsed = parseCommand(command);

      console.log("🧠 Parsed:", parsed);

      const outputPath = await processVideo(req.file.path, parsed);

      // Delete uploaded temp file
      fs.unlink(req.file.path, () => {});

      return res.json({
        success: true,
        outputUrl: outputPath
          .replace(process.cwd(), "")
          .replace(/\\/g, "/")
          .replace(/^\/?out/, "/out"),
      });
    } catch (err) {
      console.error("❌ Processing Error:", err);

      return res.status(500).json({
        success: false,
        error: "Video processing failed",
      });
    }
  }
);

// ------------------------------
// Health Check
// ------------------------------
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Video Remix Backend Running 🚀",
  });
});

const PORT = process.env.VITE_SERVER_PORT
  ? Number(process.env.VITE_SERVER_PORT)
  : 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});