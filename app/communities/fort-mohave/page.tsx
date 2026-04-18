import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Fort Mohave | Amy Casanova Real Estate" };

export default function FortMohavePage() {
  return (
    <main className="page-fade">
      <PageHero title="Fort Mohave" subtitle="Full community guide coming soon." />
      <section className="bg-brand-slate min-h-[40vh]" />
    </main>
  );
}
