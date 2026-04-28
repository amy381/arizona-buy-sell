import type { Metadata } from "next";
import PageHero            from "@/components/PageHero";
import StatsBar            from "@/components/StatsBar";
import TestimonialsSection from "@/components/TestimonialsSection";
import Link                from "next/link";

export const metadata: Metadata = {
  title: "About Amy | Amy Casanova Real Estate",
  description: "Licensed since 2013, ranked in the top 1% of agents statewide, Amy Casanova has closed over 650 transactions across Mohave County, AZ.",
};

const BIO = [
  "Kingman has been home since 1995. For Amy Casanova, that's not just a fact — it's the foundation of everything she does as a Realtor.",
  "Licensed since 2013 and ranked in the top 1% of agents statewide, Amy has closed over 650 transactions and moved more than $100 million in real estate across Western Arizona. She serves buyers and sellers throughout Mohave County — from Kingman and Golden Valley to Bullhead City and Fort Mohave — with the kind of local knowledge that only comes from three decades of living, working, and raising a family here.",
  "Those numbers matter. But what she'll tell you matters more is the family that finally found their forever home in Golden Valley, the investor who doubled his portfolio in Bullhead City, or the couple who sold their Kingman home in 24 hours with multiple offers.",
  "Buying or selling a home in Mohave County is one of the biggest financial decisions of your life. Amy treats it that way — with honest communication, strategic pricing, and the kind of relentless follow-through that has made her one of the most trusted names in Mohave County real estate since 2013. Whether you're a first-time buyer navigating the process for the first time, a seller who needs results fast, or an investor evaluating opportunities in the Kingman market — Amy brings the experience and the drive to get it done.",
  "She is a proud member of the Western Arizona Realtors Association and operates under Keller Williams Arizona Living Realty, one of the most respected brokerages in the Southwest.",
  "When she's not working with clients, you'll find her with her husband and kids under Arizona's wide open skies — the same skies she's watched over this community for thirty years.",
  "If you're buying or selling in Kingman, Golden Valley, Bullhead City, or Fort Mohave — Amy Casanova is the call you make first. Reach her at 928-530-9393.",
];

const CREDENTIALS = [
  "Member — Western Arizona Realtors Association",
  "Keller Williams Arizona Living Realty",
  "Licensed Arizona Realtor® since 2013",
];

export default function AboutPage() {
  return (
    <main className="page-fade">

      {/* Hero */}
      <PageHero
        title="Amy Casanova"
        subtitle="Realtor® · Keller Williams Arizona Living Realty · Since 2013"
        imageSrc="/images/headshot.jpg"
        imageAlt="Amy Casanova, Realtor"
        minHeight="min-h-[60vh]"
      />

      {/* Stats */}
      <StatsBar />

      {/* Full Bio */}
      <section className="bg-linen py-20 px-6">
        <div
          className="max-w-[800px] mx-auto"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {BIO.map((p, i) => (
            <p key={i} className="text-brand-slate text-[16px] leading-[1.7] mb-6 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-steel py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2
            className="text-linen font-medium text-[24px] mb-8"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Credentials &amp; Memberships
          </h2>
          <ul className="space-y-4">
            {CREDENTIALS.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 text-linen text-[15px]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                <span className="text-brand-stone mt-0.5">—</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="bg-brand-slate py-20 px-6 text-center">
        <h2
          className="text-linen text-[48px] mb-8"
          style={{ fontFamily: "var(--font-alex-brush), cursive" }}
        >
          Ready to work together?
        </h2>
        <Link
          href="/contact"
          className="inline-block bg-linen text-brand-slate text-sm uppercase tracking-widest
                     px-10 py-4 rounded hover:bg-brand-stone transition-colors"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Let&apos;s Talk
        </Link>
      </section>

    </main>
  );
}
