import HomeHero            from "@/components/HomeHero";
import StatsBar            from "@/components/StatsBar";
import IdxWidget           from "@/components/IdxWidget";
import CommunitiesSection  from "@/components/CommunitiesSection";
import AboutPreview        from "@/components/AboutPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import SocialFeedPreview   from "@/components/SocialFeedPreview";
import Link                from "next/link";

export default function Home() {
  return (
    <main className="page-fade">

      {/* 1 — Hero */}
      <HomeHero />

      {/* 2 — Stats Bar */}
      <StatsBar />

      {/* 3 — Featured Slideshow */}
      <section className="bg-brand-slate py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-linen font-medium text-[32px] text-center mb-10"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Just Listed
          </h2>
          <IdxWidget widgetId="151447" />
        </div>
      </section>

      {/* 4 — Featured Showcase */}
      <section className="bg-linen py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-brand-slate font-medium text-[32px] text-center mb-3"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Featured Properties
          </h2>
          <p
            className="text-brand-stone text-[16px] text-center mb-10"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Hand-picked listings across Western Arizona
          </p>
          <IdxWidget widgetId="151445" />
        </div>
      </section>

      {/* 5 — Nestimate CTA */}
      <section className="bg-steel py-20 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <h2
            className="text-linen text-[56px] leading-none mb-5"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            What Is Your Home Worth?
          </h2>
          <p
            className="text-brand-stone text-[16px] leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Get your personalized Nestimate — Amy&apos;s AI-powered home valuation —
            delivered within 24 hours. No obligation. No pressure.
          </p>
          <Link
            href="/home-value"
            className="inline-block bg-brand-stone text-brand-slate text-sm uppercase tracking-widest
                       px-10 py-4 rounded hover:bg-linen transition-colors"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Get My Home Value
          </Link>
        </div>
      </section>

      {/* 6 — Communities */}
      <CommunitiesSection />

      {/* 7 — About Preview */}
      <AboutPreview />

      {/* 8 — Testimonials */}
      <TestimonialsSection />

      {/* 9 — Social Feed Preview */}
      <SocialFeedPreview />

    </main>
  );
}
