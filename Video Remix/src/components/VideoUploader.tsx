import React, { useRef } from 'react';

interface Props {
  onUpload: (file: File) => void;
}

const VideoUploader: React.FC<Props> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f && f.type.startsWith('video/')) {
      onUpload(f);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f0f0';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFile({ target: { files } } as any);
    }
  };

  return (
    <div
      className="uploader"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <p className="uploader-text">📤 Drag & drop video or click to upload</p>
      <p className="uploader-hint">(mp4, mov, avi, etc.)</p>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VideoUploader;
