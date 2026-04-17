"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Search Properties", href: "/search-properties" },
  { label: "Listing Alerts", href: "/listing-alerts" },
  { label: "Communities", href: "/communities" },
  { label: "Sell", href: "/sell" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-brand-slate">
        <div className="flex flex-row items-center justify-between px-6 py-3">
          {/* LEFT: Logo + Agent Name */}
          <div className="flex flex-row items-center gap-3">
            <Image
              src="/images/logo-black.png"
              width={48}
              height={48}
              alt="Amy Casanova Real Estate logo"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span
              className="text-linen text-[28px]"
              style={{ fontFamily: "var(--font-alex-brush), cursive" }}
            >
              Amy Casanova Real Estate
            </span>
          </div>

          {/* CENTER: Nav links (desktop only) */}
          <nav className="hidden md:flex flex-row items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-linen text-sm"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: KW Logo (desktop only) + Hamburger (mobile only) */}
          <div className="flex flex-row items-center gap-4">
            <div className="hidden md:block">
              <Image
                src="/images/kw-logo.png"
                width={80}
                height={40}
                alt="Keller Williams"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Hamburger button */}
            <button
              className="md:hidden text-linen text-2xl focus:outline-none"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="5" width="28" height="2.5" rx="1.25" fill="#F0EBE3" />
                <rect y="12.75" width="28" height="2.5" rx="1.25" fill="#F0EBE3" />
                <rect y="20.5" width="28" height="2.5" rx="1.25" fill="#F0EBE3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
