import Image  from "next/image";
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
    hero: "/images/communities/kingman-hero.jpg",
  },
  {
    name: "Golden Valley",
    desc: "Wide-open lots, big skies, and room to breathe.",
    href: "/communities/golden-valley",
    hero: "/images/communities/golden-valley-hero.jpg",
  },
  {
    name: "Bullhead City",
    desc: "Riverfront living along the Colorado with year-round sun.",
    href: "/communities/bullhead-city",
    hero: "/images/communities/bullhead-city-hero.jpg",
  },
  {
    name: "Fort Mohave",
    desc: "Family-friendly neighborhoods and golf-course communities.",
    href: "/communities/fort-mohave",
    hero: "/images/communities/fort-mohave-hero.jpg",
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
                {/* Photo — scales on hover */}
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-[600ms]">
                  <Image
                    src={c.hero}
                    alt={c.name}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 960px) 100vw, 50vw"
                  />
                </div>
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
