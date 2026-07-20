import React, { useState } from 'react';

interface StockVideo {
  id: number;
  title: string;
  creator: string;
  creatorUrl: string;
  pexelsUrl: string;
  thumbnail: string;
  videoUrl: string;
}

interface Props {
  onInsert: (videoUrl: string, startTime: number, duration: number) => Promise<void>;
  disabled: boolean;
}

export const StockVideoPicker: React.FC<Props> = ({ onInsert, disabled }) => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<StockVideo[]>([]);
  const [searching, setSearching] = useState(false);
  const [startTime, setStartTime] = useState(3);
  const [duration, setDuration] = useState(3);

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(`/api/stock/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Stock search failed');
      setVideos(data.videos);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Stock search failed');
    } finally {
      setSearching(false);
    }
  };

  return <section className="stock-picker">
    <h4>Add stock visual</h4>
    <div className="stock-search">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. AI technology, city skyline" />
      <button className="download-btn" disabled={disabled || searching} onClick={() => void search()}>Search Pexels</button>
    </div>
    <div className="stock-timing">
      <label>Show at <input type="number" min="0" value={startTime} onChange={(event) => setStartTime(Number(event.target.value))} /> sec</label>
      <label>For <input type="number" min="1" max="10" value={duration} onChange={(event) => setDuration(Number(event.target.value))} /> sec</label>
    </div>
    {videos.length > 0 && <div className="stock-results">
      {videos.map((video) => <article key={video.id} className="stock-result">
        <img src={video.thumbnail} alt={video.title} />
        <div><a href={video.pexelsUrl} target="_blank" rel="noreferrer">View on Pexels</a><small>By <a href={video.creatorUrl} target="_blank" rel="noreferrer">{video.creator}</a></small></div>
        <button className="download-btn" disabled={disabled} onClick={() => void onInsert(video.videoUrl, startTime, duration)}>Use this visual</button>
      </article>)}
    </div>}
    <small className="pexels-attribution">Stock videos provided by <a href="https://www.pexels.com" target="_blank" rel="noreferrer">Pexels</a>.</small>
  </section>;
};
