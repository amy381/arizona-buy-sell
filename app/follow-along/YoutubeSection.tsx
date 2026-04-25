"use client";

import { useState, useEffect } from "react";

const FONT  = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const STEEL = "#2E3338";

interface YoutubeVideo {
  id:          string;
  title:       string;
  thumbnail:   string;
  publishedAt: string;
}

const STYLES = `
  @keyframes faShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .fa-shimmer {
    background: linear-gradient(90deg,
      rgba(255,255,255,0) 0%,
      rgba(184,168,152,0.13) 50%,
      rgba(255,255,255,0) 100%
    );
    background-size: 200% 100%;
    animation: faShimmer 1.6s ease-in-out infinite;
  }
  .fa-card {
    transition: transform 220ms ease, box-shadow 220ms ease;
  }
  .fa-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.32);
  }
`;

export default function YoutubeSection() {
  const [videos,  setVideos]  = useState<YoutubeVideo[] | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("/api/youtube?count=6")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<YoutubeVideo[]>;
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setIsError(true);
        } else {
          setVideos(data);
        }
      })
      .catch(() => setIsError(true));
  }, []);

  const isLoading = videos === null && !isError;

  return (
    <>
      <style>{STYLES}</style>

      {/* Loading: shimmer skeletons — 6 cards, matching grid layout */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 desk:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-[14px] overflow-hidden" style={{ background: STEEL }}>
              <div className="fa-shimmer" style={{ aspectRatio: "16/9" }} />
              <div style={{ padding: "16px 18px 20px" }}>
                <div
                  className="fa-shimmer"
                  style={{ height: 14, width: "82%", borderRadius: 4 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Videos: 3-col desktop, 2-col tablet, 1-col mobile */}
      {!isLoading && !isError && videos && (
        <div className="grid grid-cols-1 sm:grid-cols-2 desk:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div
              key={v.id}
              className="fa-card rounded-[14px] overflow-hidden"
              style={{ background: STEEL }}
            >
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    border: "none",
                  }}
                />
              </div>
              <div style={{ padding: "16px 18px 20px" }}>
                <p style={{
                  fontFamily: FONT,
                  fontSize: 14, fontWeight: 500, color: LINEN,
                  lineHeight: 1.4, margin: 0,
                }}>
                  {v.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error: friendly link to channel */}
      {isError && (
        <p style={{
          fontFamily: FONT, fontSize: 14, color: STONE,
          textAlign: "center", margin: "48px 0",
        }}>
          Unable to load videos right now.{" "}
          <a
            href="https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: LINEN, textDecoration: "underline" }}
          >
            Visit Amy&apos;s YouTube channel directly →
          </a>
        </p>
      )}
    </>
  );
}
