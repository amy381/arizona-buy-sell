import Link   from "next/link";
import FadeIn from "@/components/FadeIn";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

export default function NestimateCTASection() {
  return (
    <section
      className="py-20 desk:py-[120px] px-6"
      style={{ background: "#2E3338" }}
    >
      <div
        className="max-w-[760px] mx-auto"
        style={{ textAlign: "center" }}
      >
        <FadeIn>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: STONE,
            textTransform: "uppercase", letterSpacing: ".25em",
            marginBottom: 20,
          }}>
            AI-Powered Home Valuation
          </p>
          <h2 style={{
            fontFamily: "var(--font-alex-brush), cursive",
            fontSize: "clamp(3rem, 8vw, 4.5rem)",
            color: LINEN, lineHeight: 1.05, margin: "0 0 28px",
          }}>
            What Is Your Home Worth?
          </h2>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 16, color: STONE,
            lineHeight: 1.8, maxWidth: 600, margin: "0 auto 40px",
          }}>
            Get your personalized Nestimate — Amy&apos;s AI-powered home valuation —
            delivered within 24 hours. No obligation. No pressure.
          </p>
          <Link
            href="/home-value"
            className="group inline-flex items-center gap-2
                       hover:bg-[#c9baa9] transition-colors duration-200"
            style={{
              background: STONE, color: SLATE,
              borderRadius: 999,
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500, fontSize: 15,
              padding: "18px 32px",
              textDecoration: "none",
            }}
          >
            Get My Free Home Valuation
            <span
              className="group-hover:translate-x-1 transition-transform duration-200"
              style={{ display: "inline-block" }}
            >
              →
            </span>
          </Link>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: `rgba(184,168,152,.7)`,
            textTransform: "uppercase", letterSpacing: ".12em",
            marginTop: 16,
          }}>
            · Delivered within 24 hours ·
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
