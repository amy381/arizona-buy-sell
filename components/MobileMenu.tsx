"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Home",              href: "/"                  },
  { label: "Search Properties", href: "/search-properties" },
  { label: "Listing Alerts",    href: "/listing-alerts"    },
  { label: "Communities",       href: "/communities"       },
  { label: "Sell",              href: "/sell"              },
  { label: "About",             href: "/about"             },
  { label: "Contact",           href: "/contact"           },
];

const resourceLinks = [
  { label: "Buyers Guide",        href: "/buyers"              },
  { label: "Sellers Guide",       href: "/sellers"             },
  { label: "Mortgage Calculator", href: "/mortgage-calculator" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-slate flex flex-col overflow-y-auto">
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
      <nav className="flex flex-col items-center justify-center flex-1 gap-6 py-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-linen text-[28px]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}

        {/* Resources section — inline, no accordion */}
        <div className="mt-4 flex flex-col items-center gap-3 pt-4 border-t border-linen/10 w-full">
          <span
            className="text-brand-stone text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Resources
          </span>
          {resourceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-linen text-[22px]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
