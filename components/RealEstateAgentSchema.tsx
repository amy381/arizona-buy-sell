/**
 * Site-wide RealEstateAgent structured data (JSON-LD).
 * Helps Google understand who Amy is as a local business — supports the
 * "someone searches my name" and local-pack scenarios.
 * All facts here are already published publicly on this site.
 */
export default function RealEstateAgentSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Amy Casanova Real Estate",
    "image": "https://arizonabuyandsell.com/images/headshot.jpg",
    "url": "https://arizonabuyandsell.com",
    "telephone": "+1-928-530-9393",
    "email": "amy@desert-legacy.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2800 Hualapai Mountain Rd, Suite G",
      "addressLocality": "Kingman",
      "addressRegion": "AZ",
      "postalCode": "86401",
      "addressCountry": "US",
    },
    "areaServed": [
      { "@type": "City", "name": "Kingman, AZ" },
      { "@type": "City", "name": "Golden Valley, AZ" },
      { "@type": "City", "name": "Bullhead City, AZ" },
      { "@type": "City", "name": "Fort Mohave, AZ" },
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Keller Williams Arizona Living Realty",
    },
    "sameAs": [
      "https://www.instagram.com/realist_agent",
      "https://www.facebook.com/amy.casanova.355732",
      "https://www.tiktok.com/@therealistagent",
      "https://www.youtube.com/channel/UC5SNiTBYLuVpt5VtMucM96Q",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
