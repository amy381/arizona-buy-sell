import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Link    from "next/link";

export const metadata: Metadata = {
  title: "Buyers Guide | Amy Casanova Real Estate",
  description: "Your step-by-step guide to buying a home in Western Arizona with Amy Casanova.",
};

const STEPS = [
  {
    n: "01",
    heading: "Get Pre-Approved",
    body: "Know your budget before you fall in love with a home. A pre-approval letter shows sellers you're a serious buyer and gives you a clear ceiling to shop within.",
  },
  {
    n: "02",
    heading: "Define Your Needs",
    body: "Bedrooms, location, lifestyle, must-haves vs. nice-to-haves. Amy will help you build a clear picture of what you're looking for before the search begins.",
  },
  {
    n: "03",
    heading: "Start Your Search",
    body: "Use our property search to explore active listings in real time. Amy also has access to off-market opportunities throughout Western Arizona.",
  },
  {
    n: "04",
    heading: "Make an Offer",
    body: "Amy guides you through pricing strategy and negotiation — making sure your offer is competitive without leaving money on the table.",
  },
  {
    n: "05",
    heading: "Inspections & Due Diligence",
    body: "Know exactly what you're buying before you commit. Amy helps you navigate inspections, review reports, and request repairs or credits.",
  },
  {
    n: "06",
    heading: "Close & Get Your Keys",
    body: "Amy walks you through every step to closing day — coordinating with lenders, title, and all parties so nothing slips through the cracks.",
  },
];

export default function BuyersPage() {
  return (
    <main className="page-fade">

      <PageHero
        title="Your Guide to Buying in Western Arizona"
        minHeight="min-h-[50vh]"
      />

      <section className="bg-linen py-20 px-6">
        <div
          className="max-w-[800px] mx-auto"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          <ol className="space-y-10">
            {STEPS.map(({ n, heading, body }) => (
              <li key={n} className="flex gap-6 items-start">
                <span
                  className="text-brand-stone text-sm font-medium shrink-0 w-8 pt-0.5"
                >
                  {n}
                </span>
                <div>
                  <h3 className="text-brand-slate font-medium text-lg mb-2">{heading}</h3>
                  <p className="text-brand-slate/80 text-[15px] leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 text-center">
            <p className="text-brand-stone text-sm mb-6">Ready to start your search?</p>
            <Link
              href="/search-properties"
              className="inline-block bg-brand-slate text-linen text-sm uppercase tracking-widest
                         px-10 py-4 rounded hover:bg-steel transition-colors"
            >
              Search Properties
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
