import type { Metadata } from "next";
import CommunityPageTemplate from "@/components/CommunityPageTemplate";

export const metadata: Metadata = {
  title:       "Kingman Homes for Sale | Amy Casanova Real Estate",
  description: "Explore homes for sale in Kingman, AZ — the heart of Route 66. Mountain views, affordable living, and small-town charm. Amy Casanova, top 1% Realtor.",
  openGraph: {
    title:       "Kingman Homes for Sale | Amy Casanova Real Estate",
    description: "Explore homes for sale in Kingman, AZ — the heart of Route 66. Mountain views, affordable living, and small-town charm. Amy Casanova, top 1% Realtor.",
    images:      [{ url: "/images/communities/kingman-hero.jpg" }],
    type:        "website",
  },
};

export default function KingmanPage() {
  return <CommunityPageTemplate slug="kingman" />;
}
