import Link   from "next/link";
import FadeIn from "@/components/FadeIn";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

const COMMUNITIES = [
  {
    name: "Kingman",
    desc: "Historic Route 66 charm meets mountain-backed desert living.",
    href: "/communities/kingman",
    bg:  "radial-gradient(ellipse at 60% 40%, #6b4c2e 0%, #3d2b1a 55%, #2a1e11 100%)",
  },
  {
    name: "Golden Valley",
    desc: "Wide-open lots, big skies, and room to breathe.",
    href: "/communities/golden-valley",
    bg:  "radial-gradient(ellipse at 60% 40%, #b8862a 0%, #7a5520 55%, #3d2b10 100%)",
  },
  {
    name: "Bullhead City",
    desc: "Riverfront living along the Colorado with year-round sun.",
    href: "/communities/bullhead-city",
    bg:  "radial-gradient(ellipse at 60% 40%, #1e5f74 0%, #153d4d 55%, #0c2530 100%)",
  },
  {
    name: "Fort Mohave",
    desc: "Family-friendly neighborhoods and golf-course communities.",
    href: "/communities/fort-mohave",
    bg:  "radial-gradient(ellipse at 60% 40%, #8b4a2e 0%, #5c2e1a 55%, #361a0e 100%)",
  },
];

export default function CommunitiesSection() {
  return (
    <section
      className="py-20 desk:py-[120px] px-6"
      style={{ background: "#F0EBE3" }}
    >
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <FadeIn style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: "#8a7f75",
            textTransform: "uppercase", letterSpacing: ".25em",
            marginBottom: 14,
          }}>
            Where You&apos;ll Live
          </p>
          <h2 style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 500, fontSize: 32, color: SLATE,
            margin: "0 0 14px",
          }}>
            Explore Your Community
          </h2>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16, color: "#6a6158",
            margin: 0,
          }}>
            Western Arizona&apos;s most sought-after places to call home.
          </p>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 desk:grid-cols-2 gap-5">
          {COMMUNITIES.map((c, i) => (
            <FadeIn key={c.href} delay={i * 100}>
              <Link
                href={c.href}
                className="group relative block rounded-[12px] overflow-hidden no-underline"
                style={{ aspectRatio: "16/9" }}
              >
                {/* Background gradient — scales on hover */}
                <div
                  className="absolute inset-0 group-hover:scale-105 transition-transform duration-[600ms]"
                  style={{ background: c.bg }}
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg,rgba(33,37,41,.2) 0%,rgba(33,37,41,.75) 100%)" }}
                />
                {/* Text */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{ padding: "24px 32px" }}
                >
                  <h3 style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500, fontSize: 28, color: LINEN,
                    margin: "0 0 10px",
                  }}>
                    {c.name}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14, color: STONE,
                    maxWidth: 360, margin: "0 0 18px", lineHeight: 1.5,
                  }}>
                    {c.desc}
                  </p>
                  <span
                    className="group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 13, color: LINEN,
                      textTransform: "uppercase", letterSpacing: ".15em",
                      borderBottom: `1px solid ${LINEN}`,
                      paddingBottom: 2,
                      opacity: 0.8,
                    }}
                  >
                    Explore
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
