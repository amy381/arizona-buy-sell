import Image from "next/image";
import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="bg-brand-slate py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Left — content */}
        <div className="flex flex-col">
          <p
            className="text-brand-stone text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Your Agent
          </p>
          <h2
            className="text-linen text-[48px] leading-none mb-2"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            Amy Casanova
          </h2>
          <p
            className="text-brand-stone text-[16px] mb-7"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Realtor® — Keller Williams Arizona Living Realty
          </p>
          <p
            className="text-linen text-[16px] leading-[1.7] mb-5"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Kingman has been home since 1995. For Amy Casanova, that&apos;s not just a fact —
            it&apos;s the foundation of everything she does as a Realtor.
          </p>
          <p
            className="text-linen text-[16px] leading-[1.7] mb-8"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Licensed since 2013 and ranked in the top 1% of agents statewide, Amy has closed over
            650 transactions and moved more than $100 million in real estate across Western Arizona.
            She serves buyers and sellers throughout Mohave County — from Kingman and Golden Valley
            to Bullhead City and Fort Mohave — with the kind of local knowledge that only comes from
            three decades of living, working, and raising a family here.
          </p>
          <Link
            href="/about"
            className="text-brand-stone text-sm underline underline-offset-4 hover:text-linen transition-colors self-start"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            My Full Story
          </Link>
        </div>

        {/* Right — headshot */}
        <div className="relative">
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-brand-stone/30">
            <Image
              src="/images/headshot.jpg"
              alt="Amy Casanova, Realtor"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
