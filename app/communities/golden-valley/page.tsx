import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Golden Valley | Amy Casanova Real Estate" };

export default function GoldenValleyPage() {
  return (
    <main className="page-fade">
      <PageHero title="Golden Valley" subtitle="Full community guide coming soon." />
      <section className="bg-brand-slate min-h-[40vh]" />
    </main>
  );
}
