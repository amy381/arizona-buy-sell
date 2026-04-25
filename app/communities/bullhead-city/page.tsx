import type { Metadata } from "next";
import CommunityPageTemplate from "@/components/CommunityPageTemplate";

export const metadata: Metadata = {
  title:       "Bullhead City Homes for Sale | Amy Casanova Real Estate",
  description: "Bullhead City, AZ homes for sale — Colorado River living, 300+ days of sun, and Laughlin across the bridge. Amy Casanova, top Mohave County Realtor.",
  openGraph: {
    title:       "Bullhead City Homes for Sale | Amy Casanova Real Estate",
    description: "Bullhead City, AZ homes for sale — Colorado River living, 300+ days of sun, and Laughlin across the bridge. Amy Casanova, top Mohave County Realtor.",
    images:      [{ url: "/images/communities/bullhead-city-hero.jpg" }],
    type:        "website",
  },
};

export default function BullheadCityPage() {
  return <CommunityPageTemplate slug="bullhead-city" />;
}
