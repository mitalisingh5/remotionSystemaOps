export interface StockVideo {
  id: number;
  title: string;
  creator: string;
  creatorUrl: string;
  pexelsUrl: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
}

type PexelsVideo = {
  id: number;
  url: string;
  image: string;
  duration: number;
  user: { name: string; url: string };
  video_files: Array<{ link: string; quality: string; width: number }>;
};

export async function searchStockVideos(query: string): Promise<StockVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error("Pexels is not configured. Add PEXELS_API_KEY to your .env file.");
  const url = new URL("https://api.pexels.com/v1/videos/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "8");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("size", "medium");
  const response = await fetch(url, { headers: { Authorization: apiKey } });
  if (!response.ok) throw new Error(`Pexels search failed (${response.status}). Check your API key and quota.`);
  const body = await response.json() as { videos: PexelsVideo[] };
  return body.videos.map((video) => {
    const file = video.video_files.filter((item) => item.quality === "sd" || item.quality === "hd").sort((a, b) => Math.abs(a.width - 1280) - Math.abs(b.width - 1280))[0];
    if (!file) throw new Error("Pexels returned a video without a downloadable file.");
    return { id: video.id, title: `Stock video ${video.id}`, creator: video.user.name, creatorUrl: video.user.url, pexelsUrl: video.url, thumbnail: video.image, videoUrl: file.link, duration: video.duration };
  });
}
