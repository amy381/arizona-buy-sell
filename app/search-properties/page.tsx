import IdxWidget from "@/components/IdxWidget";

export const metadata = {
  title: "Search Properties | Amy Casanova Real Estate",
  description: "Search homes for sale in Kingman and the greater Mohave County area.",
};

export default function SearchPropertiesPage() {
  return (
    <main>
      <section className="bg-brand-slate py-12 px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
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
        <IdxWidget widgetId="151448" />
      </section>
    </main>
  );
}
