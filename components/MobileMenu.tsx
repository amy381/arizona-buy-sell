"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Search Properties", href: "/search-properties" },
  { label: "Communities", href: "/communities" },
  { label: "Sell", href: "/sell" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-slate flex flex-col">
      {/* Top row: close button */}
      <div className="flex justify-end px-6 py-4">
        <button
          onClick={onClose}
          className="text-linen text-2xl focus:outline-none"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col items-center justify-center flex-1 gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-linen text-[32px]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
