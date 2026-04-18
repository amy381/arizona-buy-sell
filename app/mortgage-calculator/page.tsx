import type { Metadata } from "next";
import MortgageCalculator from "@/components/MortgageCalculator";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Amy Casanova Real Estate",
  description: "Estimate your monthly payment with Amy's free mortgage calculator — updated for Arizona buyers.",
};

export default function MortgageCalculatorPage() {
  return (
    <main className="page-fade">
      <section className="bg-brand-slate py-16 px-6">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1
            className="text-linen font-medium text-[48px]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Mortgage Calculator
          </h1>
          <p
            className="text-brand-stone text-sm mt-3"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Estimate your monthly payment. All calculations are instant and happen right here — no forms, no sign-up.
          </p>
        </div>
      </section>
      <MortgageCalculator />
    </main>
  );
}
