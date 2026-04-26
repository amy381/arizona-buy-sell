import type { Metadata } from "next";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
import YoutubeSection from "./YoutubeSection";

export const metadata: Metadata = {
  title:       "Follow Along — Amy Casanova Real Estate | Social Media",
  description: "Follow Amy Casanova on YouTube, Facebook, Instagram, and TikTok for real estate tips, market updates, community tours, and Western Arizona lifestyle content.",
  openGraph: {
    title:       "Follow Along — Amy Casanova Real Estate | Social Media",
    description: "Follow Amy Casanova on YouTube, Facebook, Instagram, and TikTok for real estate tips, market updates, community tours, and Western Arizona lifestyle content.",
    type:        "website",
  },
};

const FONT  = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";
const STEEL = "#2E3338";

const SOCIAL = [
  {
    label: "Instagram",
    href:  "https://www.instagram.com/realist_agent",
    Icon:  FaInstagram,
  },
  {
    label: "Facebook",
    href:  "https://www.facebook.com/amy.casanova.355732",
    Icon:  FaFacebook,
  },
  {
    label: "TikTok",
    href:  "https://www.tiktok.com/@therealistagent",
    Icon:  FaTiktok,
  },
  {
    label: "YouTube",
    href:  "https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q",
    Icon:  FaYoutube,
  },
];

export default function FollowAlongPage() {
  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background:     SLATE,
          minHeight:      "40vh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          textAlign:      "center",
          padding:        "100px 24px 72px",
        }}
      >
        <div>
          <p style={{
            fontFamily:    FONT,
            fontSize:      12,
            color:         STONE,
            textTransform: "uppercase",
            letterSpacing: ".25em",
            margin:        "0 0 20px",
          }}>
            Stay Connected
          </p>
          <h1 style={{
            fontFamily: "var(--font-alex-brush), cursive",
            fontSize:   "clamp(48px, 8vw, 64px)",
            color:      LINEN,
            lineHeight: 1.05,
            margin:     "0 0 20px",
          }}>
            Follow Along
          </h1>
          <p style={{
            fontFamily: FONT,
            fontSize:   18,
            color:      STONE,
            margin:     0,
          }}>
            Real estate, real life, real Arizona.
          </p>
        </div>
      </section>

      {/* ── Section 1: YouTube Feed ───────────────────────────────────────── */}
      <section style={{ background: SLATE, padding: "80px 24px 96px" }}>
        <div className="max-w-[1240px] mx-auto">

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{
              fontFamily:    FONT,
              fontSize:      12,
              color:         STONE,
              textTransform: "uppercase",
              letterSpacing: ".25em",
              margin:        "0 0 16px",
            }}>
              Latest Videos
            </p>
            <h2 style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize:   32,
              color:      LINEN,
              margin:     0,
            }}>
              From the Channel
            </h2>
          </div>

          {/* 6-video grid — client component handles fetch + loading + error */}
          <YoutubeSection />

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a
              href="https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-linen hover:bg-brand-stone hover:text-brand-slate transition-colors duration-200"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                fontFamily:     FONT,
                fontSize:       14,
                textDecoration: "none",
                border:         `1.5px solid ${STONE}`,
                borderRadius:   999,
                padding:        "12px 28px",
              }}
            >
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ── Section 2: Facebook Reels ────────────────────────────────────── */}
      <section style={{ background: LINEN, padding: "80px 24px 96px" }}>
        <div className="max-w-[1240px] mx-auto">

          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{
              fontFamily:    FONT,
              fontSize:      12,
              color:         "#8a7f75",
              textTransform: "uppercase",
              letterSpacing: ".25em",
              margin:        "0 0 16px",
            }}>
              Latest Reels
            </p>
            <h2 style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize:   32,
              color:      SLATE,
              margin:     0,
            }}>
              From Facebook
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 desk:grid-cols-3 gap-6">
            {[
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2171947060214106%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2790364961311760%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1506228494479404%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F25403527465995881%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F881333827963394%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1980348309566161%2F&show_text=false&width=267&t=0",
            ].map((src) => (
              <div
                key={src}
                style={{
                  background:   STEEL,
                  borderRadius: 14,
                  overflow:     "hidden",
                  display:      "flex",
                  justifyContent: "center",
                }}
              >
                <iframe
                  src={src}
                  width="100%"
                  height="476"
                  style={{ border: "none", overflow: "hidden", display: "block" }}
                  scrolling="no"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a
              href="https://www.facebook.com/amy.casanova.355732"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-slate hover:bg-brand-slate hover:text-linen transition-colors duration-200"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                fontFamily:     FONT,
                fontSize:       14,
                textDecoration: "none",
                border:         `1.5px solid ${SLATE}`,
                borderRadius:   999,
                padding:        "12px 28px",
              }}
            >
              Follow on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* ── Section 3: Connect Everywhere ────────────────────────────────── */}
      <section style={{ background: STEEL, padding: "72px 24px 80px" }}>
        <div className="max-w-[1240px] mx-auto">

          <h2 style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize:   28,
            color:      LINEN,
            textAlign:  "center",
            margin:     "0 0 40px",
          }}>
            Find Amy Everywhere
          </h2>

          <div
            style={{
              display:        "flex",
              flexWrap:       "wrap",
              gap:            16,
              justifyContent: "center",
            }}
          >
            {SOCIAL.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-linen hover:bg-brand-stone hover:text-brand-slate transition-colors duration-200"
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            10,
                  fontFamily:     FONT,
                  fontSize:       15,
                  textDecoration: "none",
                  border:         `1.5px solid ${STONE}`,
                  borderRadius:   999,
                  padding:        "16px 32px",
                }}
              >
                <Icon style={{ width: 18, height: 18, color: "inherit", flexShrink: 0 }} />
                {label}
              </a>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
