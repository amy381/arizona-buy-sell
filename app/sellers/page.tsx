import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Link    from "next/link";

export const metadata: Metadata = {
  title: "Sellers Guide | Amy Casanova Real Estate",
  description: "Your step-by-step guide to selling your home in Mohave County, AZ with Amy Casanova.",
};

const STEPS = [
  {
    n: "01",
    heading: "Get Your Nestimate",
    body: "Know what your home is worth before you list. Amy's AI-powered Nestimate valuation is personalized to your property and delivered within 24 hours.",
  },
  {
    n: "02",
    heading: "Prepare Your Home",
    body: "Amy advises on which improvements actually move the needle — and which ones aren't worth the investment. Smart prep leads to faster offers.",
  },
  {
    n: "03",
    heading: "Price It Right",
    body: "Strategic pricing attracts the right buyers fast. Price too high and you sit. Price it right and you compete. Amy knows the difference.",
  },
  {
    n: "04",
    heading: "List & Market",
    body: "Professional photography, full MLS exposure, and social media reach across Amy's established platforms — your home gets maximum visibility from day one.",
  },
  {
    n: "05",
    heading: "Review Offers",
    body: "Amy negotiates hard to get you the best possible terms — not just the highest number, but the cleanest contract with the fewest contingencies.",
  },
  {
    n: "06",
    heading: "Close with Confidence",
    body: "Clear communication from contract to closing day. Amy coordinates every moving part so you can focus on your next chapter.",
  },
];

export default function SellersPage() {
  return (
    <main className="page-fade">

      <PageHero
        title="Your Guide to Selling in Mohave County"
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
                <span className="text-brand-stone text-sm font-medium shrink-0 w-8 pt-0.5">
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
            <p className="text-brand-stone text-sm mb-6">What&apos;s your home worth?</p>
            <Link
              href="/home-value"
              className="inline-block bg-brand-slate text-linen text-sm uppercase tracking-widest
                         px-10 py-4 rounded hover:bg-steel transition-colors"
            >
              Get My Home Value
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
