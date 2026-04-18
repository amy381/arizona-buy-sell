import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Bullhead City | Amy Casanova Real Estate" };

export default function BullheadCityPage() {
  return (
    <main className="page-fade">
      <PageHero title="Bullhead City" subtitle="Full community guide coming soon." />
      <section className="bg-brand-slate min-h-[40vh]" />
    </main>
  );
}
