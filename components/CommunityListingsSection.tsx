"use client";

import Link     from "next/link";
import FadeIn   from "@/components/FadeIn";
import IdxWidget from "@/components/IdxWidget";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

interface Props {
  cityName: string;
}

export default function CommunityListingsSection({ cityName }: Props) {
  return (
    <section className="py-20 desk:py-[120px] px-6" style={{ background: SLATE }}>
      <div className="max-w-[1240px] mx-auto">

        <FadeIn style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: STONE,
            textTransform: "uppercase", letterSpacing: ".25em",
            marginBottom: 14,
          }}>
            {cityName} Homes for Sale
          </p>
          <h2 style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 500, fontSize: 32, color: LINEN,
            margin: "0 0 14px",
          }}>
            Available Properties in {cityName}
          </h2>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16, color: STONE, margin: 0,
          }}>
            Browse every active listing in {cityName} right now.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <IdxWidget widgetId="151445" />
        </FadeIn>

        <FadeIn delay={200} style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href="https://search.arizonabuyandsell.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: LINEN, color: SLATE,
              borderRadius: 999,
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500, fontSize: 14,
              padding: "16px 28px",
              textDecoration: "none",
            }}
          >
            View All {cityName} Listings →
          </Link>
        </FadeIn>

      </div>
    </section>
  );
}
