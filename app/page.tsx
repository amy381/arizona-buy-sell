import HomeHero                from "@/components/HomeHero";
import SocialBar               from "@/components/SocialBar";
import WatchAndLearnSection    from "@/components/WatchAndLearnSection";
import FeaturedListingsSection from "@/components/FeaturedListingsSection";
import NestimateCTASection     from "@/components/NestimateCTASection";
import CommunitiesSection      from "@/components/CommunitiesSection";
import StatsBar                from "@/components/StatsBar";
import TestimonialsSection     from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <main>
      {/* 1 — Hero */}
      <HomeHero />

      {/* 2 — Social Bar */}
      <SocialBar />

      {/* 3 — Watch & Learn */}
      <WatchAndLearnSection />

      {/* 4 — Featured Listings */}
      <FeaturedListingsSection />

      {/* 5 — Nestimate CTA */}
      <NestimateCTASection />

      {/* 6 — Communities */}
      <CommunitiesSection />

      {/* 7 — Stats Bar */}
      <StatsBar />

      {/* 8 — Testimonials */}
      <TestimonialsSection />
    </main>
  );
}
