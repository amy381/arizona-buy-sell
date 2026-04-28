import Link     from "next/link";
import FadeIn   from "@/components/FadeIn";
import IdxWidget from "@/components/IdxWidget";

const SLATE = "#212529";

export default function FeaturedListingsSection() {
  return (
    <section
      className="py-20 desk:py-[120px] px-6"
      style={{ background: "#F0EBE3" }}
    >
      <div className="max-w-[1240px] mx-auto">

        {/* Header */}
        <FadeIn style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: "#8a7f75",
            textTransform: "uppercase", letterSpacing: ".25em",
            marginBottom: 14,
          }}>
            Current Inventory
          </p>
          <h2 style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 500, fontSize: 32, color: SLATE,
            margin: "0 0 14px",
          }}>
            Featured Properties
          </h2>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16, color: "#6a6158",
            margin: 0,
          }}>
            Hand-picked listings across Mohave County.
          </p>
        </FadeIn>

        {/* IDX Widget */}
        <FadeIn delay={100}>
          <IdxWidget widgetId="151445" />
        </FadeIn>

        {/* CTA button */}
        <FadeIn delay={200} style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href="https://search.arizonabuyandsell.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2"
            style={{
              background: SLATE, color: "#F0EBE3",
              borderRadius: 999,
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500, fontSize: 14,
              padding: "16px 28px",
              textDecoration: "none",
            }}
          >
            View All Properties
            <span
              className="group-hover:translate-x-1 transition-transform duration-200"
              style={{ display: "inline-block" }}
            >
              →
            </span>
          </Link>
        </FadeIn>

      </div>
    </section>
  );
}
