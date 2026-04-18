import type { Metadata } from "next";
import CommunitiesSection from "@/components/CommunitiesSection";
import PageHero           from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Communities | Amy Casanova Real Estate",
  description: "Explore Kingman, Golden Valley, Bullhead City, and Fort Mohave — Western Arizona's most sought-after places to call home.",
};

export default function CommunitiesPage() {
  return (
    <main className="page-fade">
      <PageHero
        title="Explore Your Community"
        subtitle="Western Arizona's most sought-after places to call home"
        minHeight="min-h-[40vh]"
      />
      <CommunitiesSection />
    </main>
  );
}
