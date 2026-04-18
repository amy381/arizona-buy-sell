import type { Metadata } from "next";
import PageHero            from "@/components/PageHero";
import StatsBar            from "@/components/StatsBar";
import TestimonialsSection from "@/components/TestimonialsSection";
import Link                from "next/link";

export const metadata: Metadata = {
  title: "Sell Your Home | Amy Casanova Real Estate",
  description: "Strategic pricing, maximum exposure, and results you can count on. Work with Amy Casanova to sell your Western Arizona home.",
};

const WHY_AMY = [
  {
    heading: "Local Expertise",
    body: "30 years in Kingman means unmatched market knowledge. Amy knows every neighborhood, every price trend, and every buyer pool in Western Arizona.",
  },
  {
    heading: "Proven Results",
    body: "$100M+ in real estate sold. 650+ transactions closed. Amy's track record speaks for itself.",
  },
  {
    heading: "Full Service",
    body: "From pricing strategy and professional photography to negotiation and closing day — Amy handles everything so you don't have to.",
  },
];

export default function SellPage() {
  return (
    <main className="page-fade">

      {/* Hero */}
      <PageHero
        title="Let's Sell Your Home"
        subtitle="Strategic pricing. Maximum exposure. Results you can count on."
        minHeight="min-h-[55vh]"
      />

      {/* Stats */}
      <StatsBar />

      {/* CTA — Nestimate */}
      <section className="bg-linen py-20 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <h2
            className="text-brand-slate font-medium text-[36px] mb-5"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            What Is Your Home Worth?
          </h2>
          <p
            className="text-brand-slate text-[16px] leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Getting started is simple. Tell Amy a little about your home and she&apos;ll have
            your personalized Nestimate valuation ready within 24 hours.
          </p>
          <Link
            href="/home-value"
            className="block w-full bg-brand-slate text-linen text-sm uppercase tracking-widest
                       py-4 rounded hover:bg-steel transition-colors"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Get My Free Home Valuation
          </Link>
        </div>
      </section>

      {/* Why Amy */}
      <section className="bg-steel py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-linen font-medium text-[32px] text-center mb-14"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Why Sellers Choose Amy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_AMY.map(({ heading, body }) => (
              <div key={heading} className="flex flex-col gap-3">
                <h3
                  className="text-linen font-medium text-xl"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {heading}
                </h3>
                <p
                  className="text-brand-stone text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

    </main>
  );
}
