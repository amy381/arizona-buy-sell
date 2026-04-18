import type { Metadata } from "next";
import HomeValueForm from "@/components/HomeValueForm";

export const metadata: Metadata = {
  title: "What Is My Home Worth? | Amy Casanova Real Estate",
  description: "Get Amy's personalized Nestimate home valuation delivered within 24 hours. No obligation.",
};

export default function HomeValuePage() {
  return (
    <main className="page-fade bg-brand-slate min-h-screen py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h1
          className="text-linen leading-none mb-4"
          style={{
            fontFamily: "var(--font-alex-brush), cursive",
            fontSize: "clamp(3rem, 8vw, 4.5rem)",
          }}
        >
          What Is Your Home Worth?
        </h1>
        <p
          className="text-brand-stone text-[16px] md:text-[18px] leading-relaxed mb-4"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Amy&apos;s AI-powered Nestimate valuation — delivered within 24 hours.
        </p>
        <p
          className="text-brand-stone/70 text-sm mb-10"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Your personalized home valuation tool is almost ready. In the meantime, call Amy
          directly at{" "}
          <a href="tel:9285309393" className="text-linen hover:underline">
            928-530-9393
          </a>{" "}
          or fill out the form below.
        </p>
        <HomeValueForm />
      </div>
    </main>
  );
}
