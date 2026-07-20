import React, { useState } from 'react';
import { StockVideoPicker } from './StockVideoPicker';

interface ProcessingOutput {
  outputUrl: string;
  audioUrl?: string;
  transcriptJsonUrl?: string;
  transcriptVttUrl?: string;
  sourceVideoUrl?: string;
  subtitleSrtUrl?: string;
}

interface Props {
  inputSrc: string | null;
  output: ProcessingOutput | null;
  loading: boolean;
  onStyleCaptions: (style: Record<string, unknown>) => Promise<void>;
  onInsertStockVideo: (videoUrl: string, startTime: number, duration: number) => Promise<void>;
}

const VideoPlayer: React.FC<Props> = ({ inputSrc, output, loading, onStyleCaptions, onInsertStockVideo }) => {
  const [fontName, setFontName] = useState('Arial');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(40);
  const [italic, setItalic] = useState(false);
  const [filter, setFilter] = useState('none');
  const outputSource = output ? `${output.outputUrl}?t=${Date.now()}` : null;
  const canStyle = Boolean(output?.sourceVideoUrl && output?.subtitleSrtUrl);

  return (
    <div className="video-player-container">
      <div className="video-panel">
        <h3>Input Video</h3>
        {inputSrc ? <video src={inputSrc} controls width="100%" /> : <div className="placeholder">No video uploaded yet</div>}
      </div>
      <div className="video-panel">
        <h3>Output</h3>
        {loading && <div className="loading">Processing...</div>}
        {output ? <div>
          {output.audioUrl ? <audio src={outputSource || output.outputUrl} controls style={{ width: '100%' }} /> : <video src={outputSource || output.outputUrl} controls width="100%" />}
          <a href={output.outputUrl} download={output.audioUrl ? "extracted-audio.mp3" : "captioned-video.mp4"} className="download-btn">Download output</a>
          {(output.transcriptJsonUrl || output.transcriptVttUrl) && <div className="download-links">
            {output.transcriptJsonUrl && <a href={output.transcriptJsonUrl} download="transcript.json" className="download-btn">Download JSON transcript</a>}
            {output.transcriptVttUrl && <a href={output.transcriptVttUrl} download="transcript.vtt" className="download-btn">Download VTT subtitles</a>}
          </div>}
          {canStyle && <div className="caption-style-controls">
            <h4>Caption style</h4>
            <label>Font <select value={fontName} onChange={(event) => setFontName(event.target.value)}><option>Arial</option><option>Georgia</option><option>Verdana</option></select></label>
            <label>Color <input type="color" value={fontColor} onChange={(event) => setFontColor(event.target.value)} /></label>
            <label>Size <input type="number" min="20" max="72" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} /></label>
            <label><input type="checkbox" checked={italic} onChange={(event) => setItalic(event.target.checked)} /> Italic</label>
            <label>Video filter <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="none">None</option><option value="grayscale">Grayscale</option><option value="warm">Warm</option><option value="cool">Cool</option></select></label>
            <button className="download-btn" disabled={loading} onClick={() => void onStyleCaptions({ fontName, fontColor, fontSize, italic, filter })}>Apply style</button>
          </div>}
          {output.sourceVideoUrl && !output.audioUrl && <StockVideoPicker disabled={loading} onInsert={onInsertStockVideo} />}
        </div> : <div className="placeholder">Processed video will appear here</div>}
      </div>
    </div>
  );
};

export default VideoPlayer;
