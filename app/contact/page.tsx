import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact | Amy Casanova Real Estate",
  description: "Reach Amy Casanova at 928-530-9393. Serving buyers and sellers across Kingman, Golden Valley, Bullhead City, and Fort Mohave.",
};

export default function ContactPage() {
  return (
    <main className="page-fade bg-brand-slate min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left — info */}
        <div style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          <h1
            className="text-linen text-[48px] leading-none mb-10"
            style={{ fontFamily: "var(--font-alex-brush), cursive" }}
          >
            Let&apos;s Connect
          </h1>

          <div className="flex flex-col gap-5 text-linen text-[15px]">
            <div>
              <p className="text-brand-stone text-xs uppercase tracking-widest mb-1">Phone</p>
              <a href="tel:9285309393" className="hover:text-brand-stone transition-colors">
                928-530-9393
              </a>
            </div>
            <div>
              <p className="text-brand-stone text-xs uppercase tracking-widest mb-1">Email</p>
              <a href="mailto:amy@desert-legacy.com" className="hover:text-brand-stone transition-colors">
                amy@desert-legacy.com
              </a>
            </div>
            <div>
              <p className="text-brand-stone text-xs uppercase tracking-widest mb-1">Office</p>
              <p>2800 Hualapai Mountain Rd, Suite G</p>
              <p>Kingman AZ 86401</p>
            </div>
          </div>

          {/* Social icons */}
          <div className="mt-10 flex gap-5">
            {[
              { Icon: FaInstagram, href: "https://www.instagram.com/realist_agent",            label: "Instagram" },
              { Icon: FaFacebook,  href: "https://www.facebook.com/amy.casanova.355732",        label: "Facebook"  },
              { Icon: FaTiktok,    href: "https://www.tiktok.com/@therealistagent",             label: "TikTok"    },
              { Icon: FaYoutube,   href: "https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q", label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-brand-stone text-xl hover:text-linen transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div>
          <ContactForm />
        </div>

      </div>
    </main>
  );
}
