import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Kingman | Amy Casanova Real Estate" };

export default function KingmanPage() {
  return (
    <main className="page-fade">
      <PageHero title="Kingman" subtitle="Full community guide coming soon." />
      <section className="bg-brand-slate min-h-[40vh]" />
    </main>
  );
}
