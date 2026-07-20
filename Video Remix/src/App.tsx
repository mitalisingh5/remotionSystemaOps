import React, { useState } from 'react';
import VideoUploader from './components/VideoUploader';
import ChatInterface from './components/ChatInterface';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

interface ProcessingOutput {
  outputUrl: string;
  audioUrl?: string;
  transcriptJsonUrl?: string;
  transcriptVttUrl?: string;
  sourceVideoUrl?: string;
  subtitleSrtUrl?: string;
}

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null);
  const [output, setOutput] = useState<ProcessingOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoFileUrl(url);
    setOutput(null);
  };

  const handleProcessVideo = async (command: string) => {
    if (!videoFile) {
      alert("Please upload a video first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("command", command);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to process video");
      if (!data.outputUrl) throw new Error("No output returned");
      setOutput(data);
    } catch (error) {
      console.error("Error processing video:", error);
      const message = error instanceof Error ? error.message : "Error processing video";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStyleCaptions = async (style: Record<string, unknown>) => {
    if (!output?.sourceVideoUrl || !output.subtitleSrtUrl) return;
    setLoading(true);
    try {
      const response = await fetch('/api/style-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...style, sourceVideoUrl: output.sourceVideoUrl, subtitleSrtUrl: output.subtitleSrtUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not style captions');
      setOutput((current) => current ? { ...current, outputUrl: data.outputUrl } : current);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not style captions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">🎬 Video Remix — Chat-Based AI Video Editor</header>
      <main className="app-main">
        <section className="left">
          <VideoUploader onUpload={handleVideoUpload} />
          <VideoPlayer inputSrc={videoFileUrl} output={output} loading={loading} onStyleCaptions={handleStyleCaptions} />
        </section>
        <section className="right">
          <ChatInterface onProcessCommand={handleProcessVideo} loading={loading} />
        </section>
      </main>
    </div>
  );
};

export default App;
