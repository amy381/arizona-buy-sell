"use client";

import Image    from "next/image";
import NextLink from "next/link";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

export default function HomeHero() {
  return (
    <section
      style={{
        position:   "relative",
        height:     "100vh",
        minHeight:  680,
        width:      "100%",
        overflow:   "hidden",
      }}
    >
      {/* Background photo */}
      <Image
        src="/images/hero-sunset.jpg"
        alt="Kingman, Arizona at sunset"
        fill
        priority
        style={{ objectFit: "cover", objectPosition: "center 40%" }}
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div
        style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(180deg, rgba(33,37,41,.15) 0%, rgba(33,37,41,.35) 45%, rgba(33,37,41,.85) 100%)",
        }}
      />

      {/* Centered content */}
      <div
        style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          textAlign:      "center",
          padding:        "0 24px",
        }}
      >
        {/* Logo lockup */}
        <div
          className="hero-fade-up w-[88vw] max-w-[520px] desk:w-[80vw] desk:max-w-[720px]"
          style={{
            marginBottom:   28,
            filter:         "drop-shadow(0 6px 24px rgba(0,0,0,.45))",
            animationDelay: "0ms",
          }}
        >
          <Image
            src="/images/logo-lockup-white.png"
            alt="Amy Casanova Real Estate — Keller Williams Arizona Living Realty"
            width={720}
            height={160}
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>

        {/* Headline */}
        <h1
          className="hero-fade-up"
          style={{
            fontFamily:     "var(--font-inter), sans-serif",
            fontWeight:     300,
            fontSize:       "clamp(2.25rem, 5.5vw, 4rem)",
            color:          LINEN,
            letterSpacing:  "-.01em",
            lineHeight:     1.05,
            textShadow:     "0 4px 40px rgba(0,0,0,.4)",
            margin:         0,
            animationDelay: "100ms",
          }}
        >
          Where Every{" "}
          <span
            style={{
              fontFamily:    "var(--font-alex-brush), cursive",
              fontSize:      "1.5em",
              display:       "inline-block",
              verticalAlign: "baseline",
            }}
          >
            Sunset
          </span>{" "}
          Feels Like Home
        </h1>

        {/* Subheadline */}
        <p
          className="hero-fade-up"
          style={{
            fontFamily:     "var(--font-inter), sans-serif",
            fontWeight:     700,
            fontSize:       "clamp(0.875rem, 2vw, 1.4375rem)",
            color:          STONE,
            letterSpacing:  ".15em",
            marginTop:      20,
            animationDelay: "200ms",
          }}
        >
          KINGMAN · GOLDEN VALLEY · BULLHEAD CITY · FORT MOHAVE
        </p>

        {/* CTA buttons */}
        <div
          className="hero-fade-up"
          style={{
            display:        "flex",
            flexWrap:       "wrap",
            gap:            16,
            justifyContent: "center",
            marginTop:      40,
            animationDelay: "300ms",
          }}
        >
          {/* Primary */}
          <NextLink
            href="/search-properties"
            className="group"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            8,
              background:     LINEN,
              color:          SLATE,
              borderRadius:   999,
              fontFamily:     "var(--font-inter), sans-serif",
              fontWeight:     500,
              fontSize:       14,
              padding:        "16px 28px",
              textDecoration: "none",
              transition:     "background 200ms",
              whiteSpace:     "nowrap",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = STONE; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = LINEN; }}
          >
            Search Properties
            <span
              className="group-hover:translate-x-1"
              style={{ display: "inline-block", transition: "transform 200ms" }}
            >
              →
            </span>
          </NextLink>

          {/* Secondary */}
          <NextLink
            href="/home-value"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              background:     "transparent",
              color:          LINEN,
              border:         `1px solid ${LINEN}`,
              borderRadius:   999,
              fontFamily:     "var(--font-inter), sans-serif",
              fontWeight:     500,
              fontSize:       14,
              padding:        "16px 28px",
              textDecoration: "none",
              transition:     "background 200ms, color 200ms",
              whiteSpace:     "nowrap",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = LINEN;
              el.style.color      = SLATE;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color      = LINEN;
            }}
          >
            What&apos;s My Home Worth?
          </NextLink>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position:       "absolute",
          bottom:         36,
          left:           "50%",
          transform:      "translateX(-50%)",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            10,
        }}
      >
        <span
          style={{
            fontFamily:    "var(--font-inter), sans-serif",
            fontSize:      11,
            textTransform: "uppercase",
            letterSpacing: ".2em",
            color:         "rgba(240,235,227,.7)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width:           1,
            height:          36,
            background:      LINEN,
            transformOrigin: "top",
            animation:       "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
