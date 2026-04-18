const REVIEWS_URL =
  "https://www.google.com/search?q=Amy+Casanova+Real+Estate+Reviews";

const TESTIMONIALS = [
  {
    name: "Tiffanie Williams",
    text: "Amy is wonderful to work with, she is knowledgeable and experienced. She sold our home quickly and was able to overcome any issues with ease. She kept us well informed and was always just a phone call away. I would highly recommend Amy Casanova for your Real Estate needs.",
  },
  {
    name: "Heather Stiletto",
    text: "Amy Casanova & Keller Williams have been outstanding to work with. She helped us sell two homes and purchase one — including a complicated VA loan she navigated flawlessly. She accurately priced for the market and got us much more than we expected. You won't find a better realtor in the area.",
  },
  {
    name: "Belinda Grant",
    text: "We live out of state and Amy went above and beyond every step of the way. When we were finally ready to sell four years later, we didn't hesitate to call her. We had multiple offers within 24 hours of listing. You can't go wrong using Amy as your realtor.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-steel py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-linen font-medium text-[32px] text-center mb-14"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          In the Words of My Clients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-brand-slate rounded-xl p-8 flex flex-col gap-5
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Decorative quote mark */}
              <span
                className="text-brand-stone text-5xl leading-none"
                style={{ fontFamily: "var(--font-alex-brush), cursive" }}
                aria-hidden="true"
              >
                "
              </span>
              <p
                className="text-linen text-[15px] leading-[1.7] flex-1"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {t.text}
              </p>
              <div className="flex flex-col gap-1 pt-2 border-t border-linen/10">
                <span
                  className="text-linen font-medium text-sm"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {t.name}
                </span>
                <a
                  href={REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-stone text-[13px] hover:text-linen transition-colors"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  View on Google ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
