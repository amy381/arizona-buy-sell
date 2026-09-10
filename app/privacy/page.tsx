import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Amy Casanova Real Estate collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="page-fade">
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy matters to us."
        minHeight="min-h-[40vh]"
      />
      <section className="bg-white py-16 px-6">
        <div
          className="max-w-[760px] mx-auto legal-prose"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#212529", lineHeight: 1.7 }}
        >
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>Effective Date: June 5, 2025</p>

          <h2>1. Information Collection and Use</h2>
          <p>We collect personal information, including names, email addresses, and phone numbers, solely to provide real estate services, respond to inquiries, and share relevant property updates. This information is obtained through our website forms, direct communications, and other interactions initiated by you.</p>

          <h2>2. Consent and Opt-In</h2>
          <p>By submitting your contact information, you consent to receive communications from us via phone calls, emails, and text messages related to real estate services. All communications will include clear instructions on how to opt out. You may withdraw your consent at any time by replying &ldquo;STOP&rdquo; to text messages or clicking the unsubscribe link in our emails.</p>

          <h2>3. Do Not Call (DNC) Compliance</h2>
          <p>We strictly adhere to the National Do Not Call Registry regulations. We do not initiate unsolicited calls or messages to numbers listed on the DNC registry. If you wish to be removed from our contact list, please notify us, and we will promptly honor your request.</p>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>We value your privacy and will not sell, rent, or share your personal information with third parties for marketing or promotional purposes. Your information is used exclusively to provide and improve our services.</p>

          <h2>5. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.</p>

          <h2>6. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.</p>

          <h2>7. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
          <p>
            Amy Casanova &mdash; CEO, Desert Legacy<br />
            2800 Hualapai Mountain Rd, Suite G, Kingman, AZ 86401<br />
            <a href="mailto:amy@desert-legacy.com">amy@desert-legacy.com</a><br />
            <a href="tel:9285309393">(928) 530-9393</a>
          </p>
        </div>
      </section>
    </main>
  );
}
