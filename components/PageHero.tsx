import Image from "next/image";

interface PageHeroProps {
  /** Rendered in Alex Brush */
  title: string;
  /** Rendered in Inter Stone */
  subtitle?: string;
  /** If provided, image is used as full-width background with dark overlay */
  imageSrc?: string;
  imageAlt?: string;
  /** Tailwind min-height class — defaults to "min-h-[50vh]" */
  minHeight?: string;
}

export default function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  minHeight = "min-h-[50vh]",
}: PageHeroProps) {
  return (
    <section
      className={`relative bg-brand-slate ${minHeight} flex items-center justify-center overflow-hidden`}
    >
      {imageSrc && (
        <>
          <div className="absolute inset-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-brand-slate/70" />
        </>
      )}
      <div className="relative z-10 text-center px-6 py-16">
        <h1
          className="text-linen leading-none"
          style={{
            fontFamily: "var(--font-alex-brush), cursive",
            fontSize: "clamp(3rem, 8vw, 5rem)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-brand-stone text-[16px] md:text-[18px] mt-4 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
