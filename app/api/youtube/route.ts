import { NextRequest, NextResponse } from "next/server";

interface YouTubeVideo {
  id:          string;
  title:       string;
  thumbnail:   string;
  publishedAt: string;
}

interface CacheEntry {
  data:      YouTubeVideo[];
  expiresAt: number;
}

const CHANNEL_ID = "UC5SNiTBYLuVpt5VtMucM96Q";
const CACHE_TTL  = 60 * 60 * 1000; // 1 hour

// In-memory cache keyed by count — resets on cold start, acceptable per spec
const videoCache = new Map<number, CacheEntry>();

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw   = parseInt(searchParams.get("count") ?? "4", 10);
  const count = isNaN(raw) ? 4 : Math.min(Math.max(raw, 1), 50);

  // Serve from cache if still fresh
  const cached = videoCache.get(count);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.data);
  }

  try {
    const params = new URLSearchParams({
      key:        getApiKey(),
      channelId:  CHANNEL_ID,
      part:       "snippet",
      order:      "date",
      maxResults: String(count),
      type:       "video",
    });

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("[YouTube] API error:", res.status, await res.text());
      return NextResponse.json([]);
    }

    const json = await res.json();

    type RawItem = {
      id:      { videoId?: string };
      snippet: { title: string; publishedAt: string };
    };

    const videos: YouTubeVideo[] = (json.items ?? [])
      .filter((item: RawItem) => !!item.id?.videoId)
      .map((item: RawItem) => ({
        id:          item.id.videoId as string,
        title:       item.snippet.title,
        thumbnail:   `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
        publishedAt: item.snippet.publishedAt,
      }));

    videoCache.set(count, { data: videos, expiresAt: Date.now() + CACHE_TTL });
    return NextResponse.json(videos);
  } catch (err) {
    console.error("[YouTube] Fetch error:", err);
    return NextResponse.json([]);
  }
}
