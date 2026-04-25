"use client";

import { useState, useEffect } from "react";
import FadeIn from "@/components/FadeIn";

const FONT  = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";
const STEEL = "#2E3338";

// Kept as fallback if the YouTube API is unavailable
const FALLBACK_VIDEOS = [
  {
    category: "MARKET UPDATE",
    title:    "Kingman Real Estate Trends — Spring 2026",
    embedUrl: "https://www.youtube-nocookie.com/embed/xFRYSOA1a5g",
  },
  {
    category: "FIRST-TIME BUYER",
    title:    "5 Mistakes New Arizona Homebuyers Make",
    embedUrl: "https://www.youtube-nocookie.com/embed/fDOg9G86sCI",
  },
  {
    category: "COMMUNITY TOUR",
    title:    "A Day in Fort Mohave — Neighborhood Tour",
    embedUrl: "https://www.youtube-nocookie.com/embed/2NMNwSpKGxA",
  },
  {
    category: "SELLER TIPS",
    title:    "How to Stage a Desert Home That Actually Sells",
    embedUrl: "https://www.youtube-nocookie.com/embed/l4-2UUjfseE",
  },
];

interface YoutubeVideo {
  id:          string;
  title:       string;
  thumbnail:   string;
  publishedAt: string;
}

const STYLES = `
  @keyframes wlShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .wl-shimmer {
    background: linear-gradient(90deg,
      rgba(255,255,255,0) 0%,
      rgba(184,168,152,0.13) 50%,
      rgba(255,255,255,0) 100%
    );
    background-size: 200% 100%;
    animation: wlShimmer 1.6s ease-in-out infinite;
  }
  .wl-card {
    transition: transform 220ms ease, box-shadow 220ms ease;
  }
  .wl-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.32);
  }
`;

export default function WatchAndLearnSection() {
  const [videos,  setVideos]  = useState<YoutubeVideo[] | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("/api/youtube?count=4")
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
    <section style={{ background: SLATE }} className="py-20 desk:py-[120px] px-6">
      <style>{STYLES}</style>
      <div className="max-w-[1240px] mx-auto">

        {/* ── Section header ── */}
        <FadeIn style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: FONT,
            fontSize: 12, color: STONE,
            textTransform: "uppercase", letterSpacing: ".25em",
            marginBottom: 18,
          }}>
            Featured Video Library
          </p>
          <h2 style={{
            fontFamily: "var(--font-alex-brush), cursive",
            fontSize: 64, color: LINEN,
            lineHeight: 1.05, margin: 0,
          }}>
            Watch &amp; Learn
          </h2>
          <div style={{
            width: 56, height: 1,
            background: "rgba(184,168,152,.6)",
            margin: "24px auto",
          }} />
          <p style={{
            fontFamily: FONT,
            fontSize: 16, color: STONE,
            maxWidth: 640, margin: "0 auto",
          }}>
            Real estate tips, market updates, and community tours — straight from Amy.
          </p>
        </FadeIn>

        {/* ── Loading: shimmer skeleton cards ── */}
        {isLoading && (
          <div className="grid grid-cols-1 desk:grid-cols-2 gap-8 mt-16">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-[14px] overflow-hidden" style={{ background: STEEL }}>
                <div className="wl-shimmer" style={{ aspectRatio: "16/9" }} />
                <div style={{ padding: "20px 22px 24px" }}>
                  <div
                    className="wl-shimmer"
                    style={{ height: 10, width: "52%", borderRadius: 4, marginBottom: 10 }}
                  />
                  <div
                    className="wl-shimmer"
                    style={{ height: 15, width: "78%", borderRadius: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Dynamic YouTube videos ── */}
        {!isLoading && !isError && videos && (
          <div className="grid grid-cols-1 desk:grid-cols-2 gap-8 mt-16">
            {videos.map((v) => (
              <div
                key={v.id}
                className="wl-card rounded-[14px] overflow-hidden"
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
                <div style={{ padding: "20px 22px 24px" }}>
                  <p style={{
                    fontFamily: FONT,
                    fontWeight: 500, fontSize: 15, color: LINEN,
                    lineHeight: 1.4, margin: 0,
                  }}>
                    {v.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Fallback: hardcoded embeds if API unavailable ── */}
        {isError && (
          <div className="grid grid-cols-1 desk:grid-cols-2 gap-8 mt-16">
            {FALLBACK_VIDEOS.map((v) => (
              <div
                key={v.title}
                className="wl-card rounded-[14px] overflow-hidden"
                style={{ background: STEEL }}
              >
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={v.embedUrl}
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
                <div style={{ padding: "20px 22px 24px" }}>
                  <p style={{
                    fontFamily: FONT,
                    fontSize: 12, color: STONE,
                    textTransform: "uppercase", letterSpacing: ".05em",
                    margin: "0 0 8px",
                  }}>
                    {v.category}
                  </p>
                  <p style={{
                    fontFamily: FONT,
                    fontWeight: 500, fontSize: 15, color: LINEN,
                    lineHeight: 1.4, margin: 0,
                  }}>
                    {v.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
