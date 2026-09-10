import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms and conditions governing your use of the Amy Casanova Real Estate website.",
};

export default function TermsPage() {
  return (
    <main className="page-fade">
      <PageHero
        title="Terms of Use"
        subtitle="Please review these terms before using our website."
        minHeight="min-h-[40vh]"
      />
      <section className="bg-white py-16 px-6">
        <div
          className="max-w-[760px] mx-auto legal-prose"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#212529", lineHeight: 1.7 }}
        >
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>Effective Date: June 5, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, please do not use this website.</p>

          <h2>2. Use of the Website</h2>
          <p>This website is provided for general informational purposes to help you learn about real estate services and search for properties in Mohave County, Arizona. You agree to use the site only for lawful purposes and in a way that does not infringe the rights of, or restrict the use of, this site by any third party.</p>

          <h2>3. Property Information</h2>
          <p>Property listings, valuations, and other information on this site are provided for convenience and are believed to be reliable but are not guaranteed. All information should be independently verified. Listing data may be provided by third-party sources and is subject to change or removal without notice. Nothing on this site constitutes a binding offer or an appraisal.</p>

          <h2>4. No Professional Advice</h2>
          <p>Content on this website does not constitute legal, financial, or tax advice. You should consult qualified professionals before making real estate or financial decisions.</p>

          <h2>5. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, and images, is the property of Amy Casanova Real Estate or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce or redistribute any content without prior written permission.</p>

          <h2>6. Third-Party Links</h2>
          <p>This website may contain links to third-party websites. We are not responsible for the content, privacy practices, or accuracy of information on those external sites.</p>

          <h2>7. Limitation of Liability</h2>
          <p>This website is provided on an &ldquo;as is&rdquo; basis. To the fullest extent permitted by law, Amy Casanova Real Estate shall not be liable for any damages arising out of or in connection with your use of this website.</p>

          <h2>8. Changes to These Terms</h2>
          <p>We may update these Terms of Use from time to time. Any changes will be posted on this page with an updated effective date.</p>

          <h2>9. Contact Us</h2>
          <p>
            Amy Casanova Real Estate<br />
            2800 Hualapai Mountain Rd, Suite G, Kingman, AZ 86401<br />
            <a href="mailto:amy@desert-legacy.com">amy@desert-legacy.com</a><br />
            <a href="tel:9285309393">(928) 530-9393</a>
          </p>
        </div>
      </section>
    </main>
  );
}
