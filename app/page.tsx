import IdxWidget from "@/components/IdxWidget";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-slate min-h-screen" />

      {/* Featured Slideshow — IDX Widget 151447 */}
      <section className="bg-brand-slate py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-linen text-3xl text-center mb-8"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            Featured Listings
          </h2>
          <IdxWidget widgetId="151447" />
        </div>
      </section>

      {/* Featured Showcase — IDX Widget 151445 */}
      <section className="bg-linen py-12 px-6 min-h-[600px]">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-brand-slate text-3xl text-center mb-8"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            Browse Properties
          </h2>
          <IdxWidget widgetId="151445" />
        </div>
      </section>

      {/* Nestimate / Home Value */}
      <section className="bg-steel min-h-[500px]" />

      {/* Communities */}
      <section className="bg-linen min-h-[600px]" />

      {/* About Preview */}
      <section className="bg-brand-slate min-h-[500px]" />

      {/* Testimonials */}
      <section className="bg-steel min-h-[400px]" />

      {/* Social Feed */}
      <section className="bg-brand-slate min-h-[400px]" />
    </main>
  );
}
