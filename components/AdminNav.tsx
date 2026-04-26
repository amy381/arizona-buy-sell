"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FONT  = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

const PAGE_LINKS = [
  { label: "Nestimate",      href: "/admin/nestimate" },
  { label: "Chats",          href: "/admin/chats"     },
  { label: "Content Studio", href: "/admin/content"   },
];

async function signOut() {
  await fetch("/api/admin/session", { method: "DELETE" });
  window.location.reload();
}

interface AdminNavProps {
  tabs?:        { id: string; label: string }[];
  activeTab?:   string;
  onTabChange?: (id: string) => void;
}

export default function AdminNav({ tabs, activeTab, onTabChange }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <div style={{
      background:   SLATE,
      borderBottom: "1px solid rgba(184,168,152,.15)",
      fontFamily:   FONT,
    }}>

      {/* ── Top row: page links + sign out ── */}
      <div style={{
        padding:        "0 24px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {PAGE_LINKS.map(({ label, href }) => {
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
        </div>

        <button
          onClick={signOut}
          style={{
            background:    "none",
            border:        "none",
            color:         STONE,
            fontFamily:    FONT,
            fontSize:      12,
            cursor:        "pointer",
            padding:       "6px 12px",
            letterSpacing: ".05em",
            transition:    "color 200ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = LINEN)}
          onMouseLeave={(e) => (e.currentTarget.style.color = STONE)}
        >
          Sign Out
        </button>
      </div>

      {/* ── Sub-tab row: Content Studio tabs (only when provided) ── */}
      {tabs && tabs.length > 0 && (
        <div style={{
          borderTop: "1px solid rgba(184,168,152,.1)",
          padding:   "0 24px",
          display:   "flex",
          overflowX: "auto",
          background:"rgba(0,0,0,.1)",
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              style={{
                background:   "none",
                border:       "none",
                borderBottom: activeTab === tab.id ? `2px solid ${STONE}` : "2px solid transparent",
                color:        activeTab === tab.id ? LINEN : STONE,
                fontFamily:   FONT,
                fontSize:     12,
                fontWeight:   activeTab === tab.id ? 600 : 400,
                padding:      "11px 18px",
                cursor:       "pointer",
                whiteSpace:   "nowrap",
                transition:   "color 200ms",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
