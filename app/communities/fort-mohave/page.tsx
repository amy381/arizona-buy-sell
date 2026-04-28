import type { Metadata } from "next";
import CommunityPageTemplate from "@/components/CommunityPageTemplate";

export const metadata: Metadata = {
  title:       "Fort Mohave Homes for Sale | Amy Casanova Real Estate",
  description: "Fort Mohave, AZ homes for sale — modern growth meets deep history along the Colorado River. Amy Casanova, Mohave County's top Realtor.",
  openGraph: {
    title:       "Fort Mohave Homes for Sale | Amy Casanova Real Estate",
    description: "Fort Mohave, AZ homes for sale — modern growth meets deep history along the Colorado River. Amy Casanova, Mohave County's top Realtor.",
    images:      [{ url: "/images/communities/fort-mohave-hero.jpg" }],
    type:        "website",
  },
};

export default function FortMohavePage() {
  return <CommunityPageTemplate slug="fort-mohave" />;
}
