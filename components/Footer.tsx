import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Search Properties", href: "/search-properties" },
  { label: "Communities", href: "/communities" },
  { label: "Sell", href: "/sell" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-slate w-full py-16 px-6">
      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {/* Column 1 — Branding */}
        <div className="flex flex-col">
          <Image
            src="/images/logo-black.png"
            width={64}
            height={64}
            alt="logo"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span
            className="text-linen text-2xl mt-3"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            Amy Casanova Real Estate
          </span>
          <p
            className="text-linen text-sm mt-2 opacity-70"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Crafting Real Estate Success Stories since 2013
          </p>
        </div>

        {/* Column 2 — Navigation */}
        <div className="flex flex-col">
          <span
            className="text-brand-stone text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Navigation
          </span>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-linen text-sm hover:opacity-80 transition-opacity"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Column 3 — Contact */}
        <div className="flex flex-col">
          <span
            className="text-brand-stone text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Contact
          </span>
          <div
            className="flex flex-col gap-2 text-linen text-sm"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <span>928-530-9393</span>
            <span>amy@desert-legacy.com</span>
            <span>2800 Hualapai Mountain Rd Suite G, Kingman AZ 86401</span>
          </div>
          {/* Social icons */}
          <div className="mt-4 flex gap-4">
            <a href="#" aria-label="Instagram" className="text-linen text-xl hover:text-brand-stone transition-colors">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook" className="text-linen text-xl hover:text-brand-stone transition-colors">
              <FaFacebook />
            </a>
            <a href="#" aria-label="TikTok" className="text-linen text-xl hover:text-brand-stone transition-colors">
              <FaTiktok />
            </a>
            <a href="#" aria-label="YouTube" className="text-linen text-xl hover:text-brand-stone transition-colors">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* KW bar */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <Image
          src="/images/kw-logo.png"
          width={100}
          height={40}
          alt="Keller Williams"
          style={{ objectFit: "contain" }}
        />
        <span
          className="text-brand-stone text-xs"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Licensed with Keller Williams Arizona Living Realty
        </span>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 border-t border-linen/10 pt-6 text-center">
        <span
          className="text-brand-stone text-xs"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          &copy; 2025 Amy Casanova Real Estate. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
