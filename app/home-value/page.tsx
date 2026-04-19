import type { Metadata } from "next";
import NestimateForm, { NestimateLeft } from "@/components/NestimateForm";

export const metadata: Metadata = {
  title: "What Is My Home Worth? | Amy Casanova Real Estate",
  description:
    "Get Amy's personalized Nestimate home valuation delivered within 24 hours. No obligation. No pressure. Just honest numbers from someone who knows this market.",
};

export default function HomeValuePage() {
  return (
    <main className="page-fade bg-brand-slate min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start">

          {/* Left — branding & messaging */}
          <NestimateLeft />

          {/* Right — form card */}
          <div className="bg-steel rounded-2xl p-8">
            <NestimateForm />
          </div>

        </div>
      </div>
    </main>
  );
}
