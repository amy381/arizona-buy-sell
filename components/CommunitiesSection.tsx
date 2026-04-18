import Link from "next/link";

const COMMUNITIES = [
  {
    name: "Kingman",
    href: "/communities/kingman",
    text: "Cooler temps, panoramic mountain views, Historic Route 66, and a strong community. From 40-acre ranches to new construction and historic homes — Kingman has it all.",
  },
  {
    name: "Golden Valley",
    href: "/communities/golden-valley",
    text: "Rural living at its finest. One-acre parcels, star-filled skies, and wide open quiet — perfectly positioned between Kingman and Bullhead City.",
  },
  {
    name: "Bullhead City",
    href: "/communities/bullhead-city",
    text: "The Colorado River, Lake Mohave, and the Laughlin NV skyline as your backdrop. Perfect for snowbirds, water sports enthusiasts, and active 55+ communities.",
  },
  {
    name: "Fort Mohave",
    href: "/communities/fort-mohave",
    text: "Deep historical roots meet modern growth. Ancient Mojave geoglyphs, Colorado River access, solar energy production, and a fast-growing rural community.",
  },
];

export default function CommunitiesSection() {
  return (
    <section className="bg-linen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-brand-slate font-medium text-[32px] text-center mb-3"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Explore Your Community
        </h2>
        <p
          className="text-brand-stone text-[16px] text-center mb-14"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Western Arizona&apos;s most sought-after places to call home
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMMUNITIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="bg-steel rounded-xl p-8 flex flex-col gap-3 group
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3
                className="text-linen font-medium text-xl"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {c.name}
              </h3>
              <p
                className="text-brand-stone text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {c.text}
              </p>
              <span
                className="text-brand-stone text-sm mt-auto group-hover:text-linen transition-colors"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
