import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

const PLATFORMS = [
  {
    label: "Follow on Instagram",
    href: "https://www.instagram.com/realist_agent",
    Icon: FaInstagram,
  },
  {
    label: "Follow on Facebook",
    href: "https://www.facebook.com/amy.casanova.355732",
    Icon: FaFacebook,
  },
  {
    label: "Follow on TikTok",
    href: "https://www.tiktok.com/@therealistagent",
    Icon: FaTiktok,
  },
  {
    label: "Subscribe on YouTube",
    href: "https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q",
    Icon: FaYoutube,
  },
];

export default function SocialFeedPreview() {
  return (
    <section className="bg-brand-slate py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-linen text-[48px] mb-3"
          style={{ fontFamily: "var(--font-alex-brush), cursive" }}
        >
          Follow Along
        </h2>
        <p
          className="text-brand-stone text-[16px] mb-14"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Real estate, real life, real Arizona.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          {PLATFORMS.map(({ label, href, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-steel text-linen text-sm px-6 py-4 rounded-xl
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              <Icon className="text-brand-stone text-xl" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
