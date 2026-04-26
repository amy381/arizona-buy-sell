import Image from "next/image";
import Link  from "next/link";
import {
  FaInstagram, FaFacebook, FaTiktok, FaYoutube,
} from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

const NAV_LINKS = [
  { label: "Home",              href: "/"                  },
  { label: "Search Properties", href: "/search-properties" },
  { label: "Listing Alerts",    href: "/listing-alerts"    },
  { label: "Communities",       href: "/communities"       },
  { label: "Sell",              href: "/sell"              },
  { label: "About",             href: "/about"             },
  { label: "Follow Along",      href: "/follow-along"      },
  { label: "Blog",              href: "/blog"              },
  { label: "Contact",           href: "/contact"           },
];

const SOCIAL = [
  { Icon: FaInstagram, href: "https://www.instagram.com/realist_agent",                       label: "Instagram" },
  { Icon: FaFacebook,  href: "https://www.facebook.com/amy.casanova.355732",                  label: "Facebook"  },
  { Icon: FaTiktok,    href: "https://www.tiktok.com/@therealistagent",                        label: "TikTok"    },
  { Icon: FaYoutube,   href: "https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q",     label: "YouTube"   },
];

export default function Footer() {
  return (
    <footer style={{ background: SLATE }}>
      <div
        className="max-w-[1240px] mx-auto"
        style={{ padding: "100px 48px 36px" }}
      >

        {/* ── Three-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[60px]">

          {/* Column 1 — Brand */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image
              src="/images/logo-black.png"
              width={140}
              height={140}
              alt="Amy Casanova Real Estate"
              style={{ filter: "brightness(0) invert(1)", width: 140, height: "auto", marginBottom: 20 }}
            />
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14, color: STONE,
              lineHeight: 1.7, maxWidth: 320, margin: "0 0 16px",
            }}>
              Crafting Real Estate Success Stories since 2013 — guiding buyers and sellers
              across Western Arizona with honesty, hustle, and heart.
            </p>
            <span style={{
              fontFamily: "var(--font-alex-brush), cursive",
              fontSize: 26, color: `rgba(184,168,152,.7)`,
            }}>
              — Amy
            </span>
          </div>

          {/* Column 2 — Explore */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11, color: STONE,
              textTransform: "uppercase", letterSpacing: ".25em",
              marginBottom: 20,
            }}>
              Explore
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-brand-stone transition-colors duration-200"
                  style={{
                    fontFamily:     "var(--font-inter), sans-serif",
                    fontSize:       14, color: LINEN,
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Get In Touch */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11, color: STONE,
              textTransform: "uppercase", letterSpacing: ".25em",
              marginBottom: 20,
            }}>
              Get In Touch
            </p>

            {/* Contact rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
              <a
                href="tel:9285309393"
                className="hover:text-brand-stone transition-colors duration-200"
                style={{ display: "flex", alignItems: "center", gap: 10, color: LINEN, textDecoration: "none", fontFamily: "var(--font-inter), sans-serif", fontSize: 14 }}
              >
                <FiPhone size={15} style={{ color: STONE, flexShrink: 0 }} />
                928.530.9393
              </a>
              <a
                href="mailto:amy@desert-legacy.com"
                className="hover:text-brand-stone transition-colors duration-200"
                style={{ display: "flex", alignItems: "center", gap: 10, color: LINEN, textDecoration: "none", fontFamily: "var(--font-inter), sans-serif", fontSize: 14 }}
              >
                <FiMail size={15} style={{ color: STONE, flexShrink: 0 }} />
                amy@desert-legacy.com
              </a>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: LINEN }}>
                <FiMapPin size={15} style={{ color: STONE, flexShrink: 0, marginTop: 2 }} />
                <span>2800 Hualapai Mountain Rd, Suite G<br />Kingman, AZ 86401</span>
              </div>
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:bg-brand-stone hover:text-brand-slate transition-colors duration-200"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 38, height: 38, borderRadius: "50%",
                    border: `1px solid ${STONE}`,
                    color: STONE, textDecoration: "none",
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Broker block ── */}
        <div style={{
          marginTop: 64, paddingTop: 36,
          borderTop: "1px solid rgba(240,235,227,.08)",
          textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        }}>
          {/* AC badge */}
          <div style={{
            width: 54, height: 54, borderRadius: "50%",
            border: "1.5px solid #F0EBE3",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 700, fontSize: 16, color: LINEN,
            }}>
              AC
            </span>
          </div>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: LINEN,
            textTransform: "uppercase", letterSpacing: ".15em",
            lineHeight: 1.8, margin: 0,
          }}>
            Licensed Realtor · Western Arizona<br />
            Independently Owned &amp; Operated
          </p>
        </div>

        {/* ── Copyright bar ── */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3"
          style={{
            marginTop: 48, paddingTop: 24,
            borderTop: "1px solid rgba(240,235,227,.06)",
          }}
        >
          <span style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: STONE, letterSpacing: ".08em",
          }}>
            &copy; 2026 Amy Casanova Real Estate. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Fair Housing", "Accessibility", "Admin"].map((label) => (
              <a
                key={label}
                href={label === "Admin" ? "/admin/content" : "#"}
                className="hover:text-linen transition-colors duration-200"
                style={{
                  fontFamily:     "var(--font-inter), sans-serif",
                  fontSize:       12, color: STONE,
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
