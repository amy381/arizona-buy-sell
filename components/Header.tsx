"use client";

import { useState, useEffect } from "react";
import Link           from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home",              href: "/"                  },
  { label: "Search Properties", href: "/search-properties" },
  { label: "Listing Alerts",    href: "/listing-alerts"    },
  { label: "Communities",       href: "/communities"       },
  { label: "Sell",              href: "/sell"              },
  { label: "About",             href: "/about"             },
  { label: "Follow Along",      href: "/follow-along"      },
  { label: "Contact",           href: "/contact"           },
];

const LINEN      = "#F0EBE3";
const STONE      = "#B8A898";
const SLATE      = "#212529";

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0
               013.7 9.26a19.79 19.79 0 01-3.07-8.67A2 2 0 012.48 2.5h3a2 2 0 012
               1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0
               006.82 6.82l1.77-1.77a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2
               2 0 0122 16.92z"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <rect width="22" height="1.5" rx="0.75" fill={LINEN} />
      <rect y="8.25" width="22" height="1.5" rx="0.75" fill={LINEN} />
      <rect y="16.5" width="22" height="1.5" rx="0.75" fill={LINEN} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={LINEN} strokeWidth="1.5" strokeLinecap="round">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  );
}

export default function Header() {
  const pathname    = usePathname();
  const isHomepage  = pathname === "/";

  // Non-homepage pages start in the scrolled (frosted glass) state immediately.
  // Homepage starts transparent and transitions on scroll.
  const [scrolled,  setScrolled]  = useState(!isHomepage);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    if (!isHomepage) {
      setScrolled(true);
      return;
    }
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight - 120);
    }
    // Evaluate immediately on mount (handles hard-reload mid-page)
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomepage]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Admin pages use their own AdminNav — suppress the main site header there
  if (pathname.startsWith("/admin")) return null;

  const textShadow       = scrolled ? "none" : "0 2px 10px rgba(0,0,0,.45)";
  const navLinkShadow    = scrolled ? "none" : "0 1px 8px rgba(0,0,0,.3)";
  const iconCircleBg     = scrolled ? "transparent" : "rgba(240,235,227,.1)";
  const padding          = scrolled ? "14px 40px" : "22px 44px";
  const headerBg         = scrolled ? "rgba(33,37,41,.85)" : "transparent";
  const borderBottom     = scrolled ? "1px solid rgba(240,235,227,.06)" : "none";
  const backdropFilter   = scrolled ? "blur(14px)" : "none";

  return (
    <>
      {/* ── Main header bar ────────────────────────────────────────────────── */}
      <header
        style={{
          position:          "fixed",
          top:               0,
          left:              0,
          right:             0,
          zIndex:            50,
          display:           "flex",
          flexDirection:     "row",
          alignItems:        "center",
          justifyContent:    "space-between",
          padding,
          background:        headerBg,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          borderBottom,
          transition:        "all 350ms ease",
        }}
      >
        {/* ── LEFT: Hamburger (mobile-only) + Call Amy (always) ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* Hamburger — hidden on desktop */}
          <button
            className="desk:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              width:      40,
              height:     40,
              background: "none",
              border:     "none",
              cursor:     "pointer",
              display:    "flex",
              alignItems: "center",
              justifyContent: "center",
              padding:    0,
            }}
          >
            <HamburgerIcon />
          </button>

          {/* Call Amy — always visible */}
          <a
            href="tel:9285309393"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", opacity: 1, transition: "opacity 200ms" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = ".85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {/* Icon circle */}
            <div
              style={{
                width:        38,
                height:       38,
                borderRadius: "50%",
                background:   iconCircleBg,
                border:       "1px solid rgba(240,235,227,.3)",
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                color:        LINEN,
                transition:   "background 350ms ease",
                flexShrink:   0,
              }}
            >
              <PhoneIcon />
            </div>
            {/* Text lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{
                fontFamily:    "var(--font-inter), sans-serif",
                fontSize:      10,
                textTransform: "uppercase",
                letterSpacing: ".22em",
                color:         `rgba(240,235,227,.75)`,
                textShadow,
              }}>
                Call Amy
              </span>
              <span style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize:   22,
                color:      LINEN,
                textShadow,
                lineHeight: 1,
              }}>
                928.530.9393
              </span>
            </div>
          </a>
        </div>

        {/* ── RIGHT: Nav links (desktop-only) ── */}
        <nav
          className="hidden desk:flex"
          style={{ gap: 28, alignItems: "center" }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily:  "var(--font-inter), sans-serif",
                fontSize:    18,
                color:       `rgba(240,235,227,.92)`,
                textDecoration: "none",
                textShadow:  navLinkShadow,
                transition:  "color 200ms, opacity 200ms",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color   = STONE;
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color   = `rgba(240,235,227,.92)`;
                e.currentTarget.style.opacity = "1";
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ── Mobile menu backdrop ──────────────────────────────────────────── */}
      <div
        aria-hidden={true}
        onClick={() => setMenuOpen(false)}
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     99,
          background: "rgba(0,0,0,.5)",
          opacity:    menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 350ms ease",
        }}
      />

      {/* ── Mobile menu panel (1/3 screen, slides from left) ─────────────── */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position:   "fixed",
          top:        0,
          left:       0,
          bottom:     0,
          zIndex:     100,
          width:      "max(280px, 33vw)",
          background: SLATE,
          transform:  menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 350ms cubic-bezier(.7,0,.3,1)",
          display:    "flex",
          flexDirection: "column",
          overflowY:  "auto",
        }}
      >
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 24px" }}>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", padding: "12px 32px" }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily:     "var(--font-inter), sans-serif",
                fontSize:       22,
                color:          LINEN,
                textDecoration: "none",
                padding:        "18px 0",
                borderBottom:   "1px solid rgba(240,235,227,.08)",
                display:        "block",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phone number at bottom */}
        <div style={{ padding: "32px", borderTop: "1px solid rgba(240,235,227,.08)" }}>
          <a href="tel:9285309393" style={{ textDecoration: "none" }}>
            <div style={{
              fontFamily:    "var(--font-inter), sans-serif",
              fontSize:      14,
              textTransform: "uppercase",
              letterSpacing: ".15em",
              color:         STONE,
              marginBottom:  6,
            }}>
              Call Amy
            </div>
            <div style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              fontSize:   22,
              color:      LINEN,
            }}>
              928.530.9393
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
