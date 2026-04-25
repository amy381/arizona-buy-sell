import FadeIn from "@/components/FadeIn";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";
const STEEL = "#2E3338";

const VIDEOS = [
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

export default function WatchAndLearnSection() {
  return (
    <section
      style={{ background: SLATE }}
      className="py-20 desk:py-[120px] px-6"
    >
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <FadeIn style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
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
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16, color: STONE,
            maxWidth: 640, margin: "0 auto",
          }}>
            Real estate tips, market updates, and community tours — straight from Amy.
          </p>
        </FadeIn>

        {/* Video grid */}
        <div className="grid grid-cols-1 desk:grid-cols-2 gap-8 mt-16">
          {VIDEOS.map((v, i) => (
            <FadeIn key={v.title} delay={i * 100}>
              <div
                className="rounded-[14px] overflow-hidden"
                style={{ background: STEEL }}
              >
                {/* Embed */}
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={v.embedUrl}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                </div>

                {/* Meta */}
                <div style={{ padding: "20px 22px 24px" }}>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 12, color: STONE,
                    textTransform: "uppercase", letterSpacing: ".05em",
                    margin: "0 0 8px",
                  }}>
                    {v.category}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500, fontSize: 15, color: LINEN,
                    lineHeight: 1.4, margin: 0,
                  }}>
                    {v.title}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
