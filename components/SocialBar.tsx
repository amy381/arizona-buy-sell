import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";

const PLATFORMS = [
  {
    label: "Instagram",
    href:  "https://www.instagram.com/realist_agent",
    Icon:  FaInstagram,
  },
  {
    label: "Facebook",
    href:  "https://www.facebook.com/amy.casanova.355732",
    Icon:  FaFacebook,
  },
  {
    label: "TikTok",
    href:  "https://www.tiktok.com/@therealistagent",
    Icon:  FaTiktok,
  },
  {
    label: "YouTube",
    href:  "https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q",
    Icon:  FaYoutube,
  },
];

export default function SocialBar() {
  return (
    <div
      style={{
        background:     "#2E3338",
        width:          "100%",
        minHeight:      80,
        display:        "flex",
        flexDirection:  "row",
        alignItems:     "center",
        justifyContent: "center",
        flexWrap:       "wrap",
        gap:            16,
        padding:        "16px 24px",
      }}
    >
      {PLATFORMS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            8,
            background:     "transparent",
            border:         `1px solid ${STONE}`,
            borderRadius:   999,
            padding:        "10px 22px",
            color:          LINEN,
            textDecoration: "none",
            fontFamily:     "var(--font-inter), sans-serif",
            fontSize:       13,
            transition:     "background 200ms, color 200ms",
            cursor:         "pointer",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = STONE;
            el.style.color      = SLATE;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color      = LINEN;
          }}
        >
          <Icon style={{ width: 16, height: 16, color: "inherit", flexShrink: 0 }} />
          {label}
        </a>
      ))}
    </div>
  );
}
