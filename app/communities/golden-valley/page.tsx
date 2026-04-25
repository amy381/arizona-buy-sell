import type { Metadata } from "next";
import CommunityPageTemplate from "@/components/CommunityPageTemplate";

export const metadata: Metadata = {
  title:       "Golden Valley Homes for Sale | Amy Casanova Real Estate",
  description: "Golden Valley, AZ homes for sale — rural desert living with star-filled skies, one-acre lots, and mountain views. Amy Casanova, Mohave County Realtor.",
  openGraph: {
    title:       "Golden Valley Homes for Sale | Amy Casanova Real Estate",
    description: "Golden Valley, AZ homes for sale — rural desert living with star-filled skies, one-acre lots, and mountain views. Amy Casanova, Mohave County Realtor.",
    images:      [{ url: "/images/communities/golden-valley-hero.jpg" }],
    type:        "website",
  },
};

export default function GoldenValleyPage() {
  return <CommunityPageTemplate slug="golden-valley" />;
}
