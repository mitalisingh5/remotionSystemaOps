import React from 'react';

interface Props {
  inputSrc: string | null;
  outputSrc: string | null;
  loading: boolean;
}

const VideoPlayer: React.FC<Props> = ({ inputSrc, outputSrc, loading }) => {
  const outputVideoSource = outputSrc ? `${outputSrc}?t=${Date.now()}` : null;

  return (
    <div className="video-player-container">
      <div className="video-panel">
        <h3>📹 Input Video</h3>
        {inputSrc ? (
          <video src={inputSrc} controls width="100%" />
        ) : (
          <div className="placeholder">No video uploaded yet</div>
        )}
      </div>

      <div className="video-panel">
        <h3>▶ Output Video</h3>
        {loading && <div className="loading">Processing...</div>}
        {outputSrc ? (
          <div>
            <video src={outputVideoSource || outputSrc} controls width="100%" />
            <a href={outputSrc} download="edited-video.mp4" className="download-btn">
              ⬇️ Download
            </a>
          </div>
        ) : (
          <div className="placeholder">Processed video will appear here</div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
