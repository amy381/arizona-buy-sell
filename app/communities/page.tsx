import type { Metadata } from "next";
import Image from "next/image";
import Link  from "next/link";

export const metadata: Metadata = {
  title:       "Communities | Amy Casanova Real Estate",
  description: "Explore Kingman, Golden Valley, Bullhead City, and Fort Mohave — Western Arizona's most sought-after places to call home.",
  openGraph: {
    title:       "Communities | Amy Casanova Real Estate",
    description: "Explore Kingman, Golden Valley, Bullhead City, and Fort Mohave — Western Arizona's most sought-after places to call home.",
    type:        "website",
  },
};

const COMMUNITIES = [
  {
    slug:  "kingman",
    name:  "Kingman",
    desc:  "The heart of Route 66 — mountain views, affordable living, and small-town charm.",
    hero:  "/images/communities/kingman-hero.jpg",
  },
  {
    slug:  "golden-valley",
    name:  "Golden Valley",
    desc:  "Rural desert living with star-filled skies, one-acre lots, and mountain views.",
    hero:  "/images/communities/golden-valley-hero.jpg",
  },
  {
    slug:  "bullhead-city",
    name:  "Bullhead City",
    desc:  "Colorado River living, 300+ days of sun, and Laughlin right across the bridge.",
    hero:  "/images/communities/bullhead-city-hero.jpg",
  },
  {
    slug:  "fort-mohave",
    name:  "Fort Mohave",
    desc:  "Modern growth meets deep history along the Colorado River.",
    hero:  "/images/communities/fort-mohave-hero.jpg",
  },
];

export default function CommunitiesPage() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          minHeight:       "40vh",
          background:      "#1e293b",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          textAlign:       "center",
          padding:         "64px 24px",
        }}
      >
        <h1
          style={{
            fontFamily:  "Inter, sans-serif",
            fontWeight:  500,
            fontSize:    "clamp(36px, 5vw, 56px)",
            color:       "#faf0e6",
            margin:      "0 0 16px",
            lineHeight:  1.15,
          }}
        >
          Our Communities
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize:   "18px",
            color:      "#78716c",
            margin:     0,
            maxWidth:   "520px",
          }}
        >
          Four incredible places to call home in Western Arizona.
        </p>
      </section>

      {/* Community Cards Grid */}
      <section
        style={{
          background: "#0f172a",
          padding:    "72px 24px 96px",
        }}
      >
        <div
          style={{
            maxWidth:             "1100px",
            margin:               "0 auto",
            display:              "grid",
            gridTemplateColumns:  "repeat(auto-fit, minmax(460px, 1fr))",
            gap:                  "28px",
          }}
        >
          {COMMUNITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/communities/${c.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  position:     "relative",
                  aspectRatio:  "4/3",
                  borderRadius: "12px",
                  overflow:     "hidden",
                  cursor:       "pointer",
                }}
              >
                <Image
                  src={c.hero}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                {/* gradient overlay */}
                <div
                  style={{
                    position:   "absolute",
                    inset:      0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)",
                  }}
                />
                {/* text */}
                <div
                  style={{
                    position: "absolute",
                    bottom:   0,
                    left:     0,
                    right:    0,
                    padding:  "28px 28px 24px",
                  }}
                >
                  <p
                    style={{
                      fontFamily:  "Inter, sans-serif",
                      fontWeight:  700,
                      fontSize:    "26px",
                      color:       "#ffffff",
                      margin:      "0 0 6px",
                    }}
                  >
                    {c.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize:   "14px",
                      color:      "rgba(255,255,255,0.80)",
                      margin:     "0 0 16px",
                      lineHeight: 1.5,
                    }}
                  >
                    {c.desc}
                  </p>
                  <span
                    style={{
                      display:         "inline-block",
                      fontFamily:      "Inter, sans-serif",
                      fontSize:        "13px",
                      fontWeight:      600,
                      color:           "#ffffff",
                      border:          "1.5px solid rgba(255,255,255,0.70)",
                      borderRadius:    "999px",
                      padding:         "6px 18px",
                      letterSpacing:   "0.04em",
                      textTransform:   "uppercase",
                    }}
                  >
                    Explore {c.name} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
