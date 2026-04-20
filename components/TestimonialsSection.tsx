import FadeIn from "@/components/FadeIn";

const LINEN       = "#F0EBE3";
const STONE       = "#B8A898";
const SLATE       = "#212529";
const REVIEWS_URL = "https://www.google.com/search?q=Amy+Casanova+Real+Estate+Reviews";

const TESTIMONIALS = [
  {
    name: "Tiffanie Williams",
    text: "Amy is wonderful to work with, she is knowledgeable and experienced. She sold our home quickly and was able to overcome any issues with ease. She kept us well informed and was always just a phone call away. I would highly recommend Amy Casanova for your Real Estate needs.",
  },
  {
    name: "Heather Stiletto",
    text: "Amy Casanova and team have been outstanding to work with. She helped us sell two homes and purchase one. You won't find a better realtor in the area.",
  },
  {
    name: "Belinda Grant",
    text: "We had multiple offers within 24 hours of listing. You can't go wrong using Amy as your realtor.",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      className="py-20 desk:py-[120px] px-6"
      style={{ background: "#2E3338" }}
    >
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <FadeIn style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: STONE,
            textTransform: "uppercase", letterSpacing: ".25em",
            marginBottom: 14,
          }}>
            5-Star Google Reviews
          </p>
          <h2 style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 500, fontSize: 32, color: LINEN,
            margin: "0 0 24px",
          }}>
            In the Words of My Clients
          </h2>
          <div style={{
            width: 56, height: 1,
            background: "rgba(184,168,152,.6)",
            margin: "0 auto",
          }} />
        </FadeIn>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 100}>
              <div style={{
                background:   SLATE,
                borderRadius: 14,
                padding:      "36px 32px",
                border:       "1px solid rgba(240,235,227,.04)",
                display:      "flex",
                flexDirection: "column",
                gap:          18,
                height:       "100%",
              }}>
                {/* Decorative quote mark */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-alex-brush), cursive",
                    fontSize:   64,
                    color:      STONE,
                    lineHeight: .4,
                    height:     28,
                    overflow:   "hidden",
                    userSelect: "none",
                  }}
                >
                  &ldquo;
                </div>

                {/* Review text */}
                <p style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize:   15, color: LINEN,
                  lineHeight: 1.75, flex: 1,
                  margin:     0,
                }}>
                  {t.text}
                </p>

                {/* Meta */}
                <div style={{
                  paddingTop:  18,
                  borderTop:   "1px solid rgba(240,235,227,.08)",
                  display:     "flex",
                  flexDirection: "column",
                  gap:         6,
                }}>
                  <span style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500, fontSize: 14, color: LINEN,
                  }}>
                    {t.name}
                  </span>
                  <a
                    href={REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-linen transition-colors duration-200"
                    style={{
                      fontFamily:     "var(--font-inter), sans-serif",
                      fontSize:       13, color: STONE,
                      textDecoration: "none",
                      borderBottom:   `1px solid ${STONE}`,
                      paddingBottom:  1,
                      width:          "fit-content",
                    }}
                  >
                    View on Google
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* See All Reviews button */}
        <FadeIn delay={300} style={{ textAlign: "center", marginTop: 48 }}>
          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:bg-brand-stone/10 transition-colors duration-200"
            style={{
              background:     "transparent",
              border:         `1px solid ${STONE}`,
              color:          STONE,
              borderRadius:   999,
              fontFamily:     "var(--font-inter), sans-serif",
              fontWeight:     500, fontSize: 14,
              padding:        "16px 28px",
              textDecoration: "none",
            }}
          >
            See All Reviews on Google
          </a>
        </FadeIn>

      </div>
    </section>
  );
}
