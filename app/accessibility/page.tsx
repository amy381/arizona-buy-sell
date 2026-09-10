import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Amy Casanova Real Estate is committed to making its website accessible to all visitors, including people with disabilities.",
};

export default function AccessibilityPage() {
  return (
    <main className="page-fade">
      <PageHero
        title="Accessibility"
        subtitle="A website that works for everyone."
        minHeight="min-h-[40vh]"
      />
      <section className="bg-white py-16 px-6">
        <div
          className="max-w-[760px] mx-auto legal-prose"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#212529", lineHeight: 1.7 }}
        >
          <h2>Our Commitment to Accessibility</h2>
          <p>Amy Casanova Real Estate is committed to ensuring that our website is accessible to everyone, including people with disabilities. We are continually working to improve the experience for all visitors and to meet or exceed applicable accessibility standards.</p>

          <h2>Standards We Follow</h2>
          <p>We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, published by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more accessible to people with a wide range of disabilities.</p>

          <h2>Ongoing Effort</h2>
          <p>Accessibility is an ongoing effort. We regularly review our site and work to remove barriers that may prevent visitors from accessing our content. If you use assistive technology and have difficulty using any part of this website, we want to hear from you.</p>

          <h2>Need Help or Have Feedback?</h2>
          <p>If you experience any difficulty accessing information on this website, or if you have suggestions on how we can improve, please contact us and we will be glad to assist you and provide the information you need through an alternative method.</p>

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
