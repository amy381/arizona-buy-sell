import IdxWidget from "@/components/IdxWidget";

export const metadata = {
  title: "Search Properties | Amy Casanova Real Estate",
  description: "Search homes for sale in Kingman and the greater Mohave County area.",
};

export default function SearchPropertiesPage() {
  return (
    <main>
      <section className="bg-brand-slate">

        {/* Title — padded enough to clear the fixed header */}
        <div className="max-w-4xl mx-auto text-center pt-28 pb-10 px-6">
          <h1
            className="text-linen text-4xl mb-4"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            Search Properties
          </h1>
          <p
            className="text-brand-stone text-sm"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Browse active listings across Kingman, Golden Valley, Lake Havasu, and all of Mohave County.
          </p>
        </div>

        {/* Widget — full browser width, no padding, fixed viewport height */}
        <div style={{ width: "100%", height: "calc(100vh - 200px)", padding: 0, margin: 0 }}>
          <IdxWidget widgetId="151448" />
        </div>

      </section>
    </main>
  );
}
