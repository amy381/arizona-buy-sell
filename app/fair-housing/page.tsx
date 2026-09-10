import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Fair Housing",
  description: "Amy Casanova Real Estate is committed to Equal Housing Opportunity and full compliance with the Fair Housing Act.",
};

export default function FairHousingPage() {
  return (
    <main className="page-fade">
      <PageHero
        title="Fair Housing"
        subtitle="Equal Housing Opportunity for everyone."
        minHeight="min-h-[40vh]"
      />
      <section className="bg-white py-16 px-6">
        <div
          className="max-w-[760px] mx-auto legal-prose"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#212529", lineHeight: 1.7 }}
        >
          <h2>Our Commitment</h2>
          <p>Amy Casanova Real Estate is fully committed to the principles of the Fair Housing Act and to providing Equal Housing Opportunity to all. We do business in accordance with all federal, state, and local fair housing laws.</p>

          <h2>Equal Opportunity for All</h2>
          <p>We do not discriminate against any person because of race, color, religion, sex, disability, familial status, national origin, or any other class protected under applicable law. Every client is treated with the same professionalism, honesty, and respect, and every buyer and seller receives the same standard of service.</p>

          <h2>The Fair Housing Act</h2>
          <p>The federal Fair Housing Act prohibits discrimination in the sale, rental, and financing of dwellings, and in other housing-related transactions, based on race, color, national origin, religion, sex, familial status, and disability. Arizona law provides additional protections.</p>

          <h2>Reporting a Concern</h2>
          <p>If you believe you have experienced housing discrimination, you may file a complaint with the U.S. Department of Housing and Urban Development (HUD) at <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">hud.gov/fairhousing</a> or by calling 1-800-669-9777. You are also welcome to contact us directly with any questions or concerns.</p>

          <h2>Contact Us</h2>
          <p>
            Amy Casanova Real Estate<br />
            2800 Hualapai Mountain Rd, Suite G, Kingman, AZ 86401<br />
            <a href="mailto:amy@desert-legacy.com">amy@desert-legacy.com</a><br />
            <a href="tel:9285309393">(928) 530-9393</a>
          </p>
          <p style={{ marginTop: 32, color: "#6b7280", fontSize: 14 }}>Each Keller Williams office is independently owned and operated.</p>
        </div>
      </section>
    </main>
  );
}
