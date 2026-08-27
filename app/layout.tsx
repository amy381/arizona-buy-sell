import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import FooterConditional from "@/components/FooterConditional";
import ChatWidget from "@/components/ChatWidget";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const TITLE       = "Amy Casanova Real Estate | Homes for Sale in Kingman, Golden Valley, Bullhead City & Fort Mohave AZ";
const DESCRIPTION = "Top 1% Arizona Realtor Amy Casanova — $100M+ sold, 650+ transactions. Search homes, get your free Nestimate valuation, and explore Mohave County, AZ communities.";
const SITE_URL    = "https://arizonabuyandsell.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  TITLE,
    template: "%s | Amy Casanova Real Estate",
  },
  description: DESCRIPTION,
  openGraph: {
    title:       TITLE,
    description: DESCRIPTION,
    siteName:    "Amy Casanova Real Estate",
    type:        "website",
    url:         SITE_URL,
  },
  twitter: {
    card:        "summary_large_image",
    title:       TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon:  "/favicon.ico",
    apple: "/images/logo-black.png",
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = "GTM-W5V2ZNTX";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager */}
        <Header />
        {children}
        <FooterConditional />
        <ChatWidget />
        {gaId && <GoogleAnalytics id={gaId} />}
      </body>
    </html>
  );
}
