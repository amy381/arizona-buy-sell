import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative min-h-screen bg-brand-slate overflow-hidden flex items-center">
      {/* Headshot — full bleed on mobile, right side on desktop */}
      <div className="absolute inset-0 md:left-[35%]">
        <Image
          src="/images/headshot.jpg"
          alt="Amy Casanova, Realtor"
          fill
          className="object-cover object-top"
          priority
          sizes="(max-width: 768px) 100vw, 65vw"
        />
      </div>

      {/* Mobile overlay — dark wash for text readability */}
      <div className="absolute inset-0 bg-brand-slate/75 md:hidden" />

      {/* Desktop gradient — solid left, fades to transparent */}
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-brand-slate from-[30%] via-brand-slate/95 via-[42%] to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 py-24 max-w-xl">
        <p
          className="text-brand-stone text-sm uppercase tracking-[0.1em] mb-4"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Kingman&apos;s Most Trusted Realtor
        </p>
        <h1
          className="text-linen font-medium leading-[1.1] text-[36px] md:text-[56px] mb-5"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Find Your Place<br />in the Desert
        </h1>
        <p
          className="text-brand-stone text-[16px] md:text-[18px] mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Serving Kingman, Golden Valley, Bullhead City &amp; Fort Mohave since 2013
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/search-properties"
            className="inline-block bg-linen text-brand-slate text-sm font-medium px-7 py-3 rounded
                       hover:bg-brand-stone transition-colors text-center"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Search Properties
          </Link>
          <Link
            href="/home-value"
            className="inline-block border border-linen text-linen text-sm font-medium px-7 py-3 rounded
                       hover:bg-linen/10 transition-colors text-center"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            What&apos;s My Home Worth?
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-linen opacity-70"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="#F0EBE3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
