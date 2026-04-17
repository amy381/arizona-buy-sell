import ListingAlertsForm from "@/components/ListingAlertsForm";

export const metadata = {
  title: "Listing Alerts | Amy Casanova Real Estate",
  description: "Get notified the moment a home matching your criteria hits the market.",
};

export default function ListingAlertsPage() {
  return (
    <main>
      <section className="bg-brand-slate min-h-screen py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h1
            className="text-linen text-4xl text-center mb-3"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            Get Listing Alerts
          </h1>
          <p
            className="text-brand-stone text-sm text-center mb-10"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Tell me what you&apos;re looking for. I&apos;ll send you new listings the moment they hit the market.
          </p>
          <ListingAlertsForm />
        </div>
      </section>
    </main>
  );
}
