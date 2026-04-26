"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FONT  = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LINEN = "#F0EBE3";
const STONE = "#B8A898";

const LINKS = [
  { label: "Nestimate", href: "/admin/nestimate" },
  { label: "Chats",     href: "/admin/chats"     },
  { label: "Content",   href: "/admin/content"   },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background:   "#1a1e22",
        borderBottom: "1px solid rgba(184,168,152,.15)",
        padding:      "0 24px",
        display:      "flex",
        alignItems:   "center",
        fontFamily:   FONT,
      }}
    >
      <span style={{
        marginRight:   16,
        paddingRight:  16,
        borderRight:   "1px solid rgba(184,168,152,.2)",
        fontSize:      11,
        color:         STONE,
        textTransform: "uppercase",
        letterSpacing: ".2em",
      }}>
        Admin
      </span>
      {LINKS.map(({ label, href }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            style={{
              display:        "block",
              padding:        "14px 18px",
              fontSize:       13,
              textDecoration: "none",
              color:          active ? LINEN : STONE,
              borderBottom:   active ? `2px solid ${STONE}` : "2px solid transparent",
              transition:     "color 200ms",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
