# Video Remix — Chat-Based AI Video Editor

A web app that lets you edit videos by talking or typing commands in a chat interface.

## Features

✨ Voice Commands — Speak or type editing commands

🎬 Video Preview — Upload and process videos through a simple UI

✂️ Video Editing
- Cut first N seconds
- Trim between timestamps
- Speed up / slow down videos

📝 AI Subtitle Generation
- Generate subtitles using OpenAI Whisper
- Burn subtitles directly into videos

🎵 Audio Extraction
- Extract audio from videos as MP3

🏷️ Watermarking
- Add watermarks to videos

⚡ Offline Processing
- Runs locally using FFmpeg and Whisper
- No API keys required

🎨 Remotion Rendering
- Render videos with captions and custom compositions

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + Node.js
- **Transcription**: Whisper via @xenova/transformers
- **Video Processing**: FFmpeg
- **Video Composition**: Remotion
- **Validation**: Zod

## Installation

### Prerequisites

- Node.js 16+
- FFmpeg (installed and in PATH)

### Setup

```bash
# Install dependencies
npm install

# Copy .env.example to .env (optional)
cp .env.example .env
```

## Usage

### Development

```bash
# Start frontend + backend together
npm run dev
```

The app opens at `http://localhost:5173` with backend at `http://localhost:5000`.

### Server Only

```bash
npm run server
```

### Build

```bash
npm run build
```

## How It Works

1. **Upload** — Drag & drop a video file (mp4, mov, avi, etc.)
2. **Record/Type** — Click 🎤 to speak a command, or type manually
3. **Transcribe** — Your speech is converted to text using local Whisper
4. **Edit & Download** — Server processes the video and returns the edited file

## Example Commands

- "Cut the first 10 seconds"
- "Add captions to the important parts"
- "Speed up the video by 1.5x"
- "Trim to the last 5 seconds"

## Project Structure

```
src/
├── components/
│   ├── VideoUploader.tsx   — Drag & drop upload
│   ├── ChatInterface.tsx   — Chat UI
│   ├── VoiceRecorder.tsx   — Microphone recording
│   ├── TranscriptEditor.tsx — Editable transcription
│   └── VideoPlayer.tsx     — Video preview
├── server/
│   ├── index.ts            — Express server
│   ├── transcribe.ts       — Whisper integration
│   ├── parseCommand.ts     — Command parsing
│   └── processVideo.ts     — FFmpeg processing
├── compositions/
│   ├── CaptionedVideo.tsx  — Captioned output
│   ├── HighlightReel.tsx   — Highlights
│   └── Explainer.tsx       — Explainer-style output
└── App.tsx                 — Main app
```

## Environment Variables

```
VITE_SERVER_PORT=5000
FFMPEG_PATH=/usr/bin/ffmpeg
OUTPUT_DIR=./out
```

## Notes

- Whisper model (~80MB) auto-downloads on first run
- All transcription is offline — no cloud services
- FFmpeg is required for video processing

## License

MIT
