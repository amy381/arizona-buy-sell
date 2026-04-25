import Image from "next/image";
import Link  from "next/link";
import FadeIn from "@/components/FadeIn";
import CommunityListingsSection from "@/components/CommunityListingsSection";

// ── Palette ──────────────────────────────────────────────────────────────────
const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";
const STEEL = "#2E3338";

// ── All communities (for "Explore Other" section) ────────────────────────────
const ALL_COMMUNITIES = [
  {
    slug:      "kingman",
    name:      "Kingman",
    desc:      "Historic Route 66 charm meets mountain-backed desert living.",
    heroImage: "/images/communities/kingman-hero.jpg",
    bg:        "radial-gradient(ellipse at 60% 40%, #6b4c2e 0%, #3d2b1a 55%, #2a1e11 100%)",
  },
  {
    slug:      "golden-valley",
    name:      "Golden Valley",
    desc:      "Wide-open lots, big skies, and room to breathe.",
    heroImage: "/images/communities/golden-valley-hero.jpg",
    bg:        "radial-gradient(ellipse at 60% 40%, #b8862a 0%, #7a5520 55%, #3d2b10 100%)",
  },
  {
    slug:      "bullhead-city",
    name:      "Bullhead City",
    desc:      "Riverfront living along the Colorado with year-round sun.",
    heroImage: "/images/communities/bullhead-city-hero.jpg",
    bg:        "radial-gradient(ellipse at 60% 40%, #1e5f74 0%, #153d4d 55%, #0c2530 100%)",
  },
  {
    slug:      "fort-mohave",
    name:      "Fort Mohave",
    desc:      "Family-friendly neighborhoods with deep historical roots.",
    heroImage: "/images/communities/fort-mohave-hero.jpg",
    bg:        "radial-gradient(ellipse at 60% 40%, #8b4a2e 0%, #5c2e1a 55%, #361a0e 100%)",
  },
];

// ── Inline Feather-style SVG icons ───────────────────────────────────────────
type IconName =
  | "mountain" | "users" | "home" | "calendar"
  | "maximize" | "car" | "sun" | "waves"
  | "landmark" | "flag" | "star" | "dollar"
  | "map-pin"  | "navigation" | "anchor" | "building" | "book";

function Icon({ name, size }: { name: IconName; size: number }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round"  as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "mountain":
      return <svg {...p}><path d="M8 3 L12 10 L16 5 L22 18 H2 Z" /></svg>;
    case "users":
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "home":
      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "calendar":
      return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "maximize":
      return <svg {...p}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;
    case "car":
      return <svg {...p}><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
    case "sun":
      return <svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    case "waves":
      return <svg {...p}><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>;
    case "landmark":
      return <svg {...p}><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/></svg>;
    case "flag":
      return <svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
    case "star":
      return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "dollar":
      return <svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case "map-pin":
      return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "navigation":
      return <svg {...p}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>;
    case "anchor":
      return <svg {...p}><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M6 10H2a10 10 0 0 0 20 0h-4"/></svg>;
    case "building":
      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>;
    case "book":
      return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    default:
      return <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface QuickFact {
  icon:  IconName;
  value: string;
  label: string;
}
interface LoveCard {
  icon:  IconName;
  title: string;
  desc:  string;
}
export interface CommunityConfig {
  name:         string;
  slug:         string;
  heroImage:    string;
  overviewImage: string;
  tagline:      string;
  overview:     string[];
  quickFacts:   QuickFact[];
  loves:        LoveCard[];
}

// ── City data ─────────────────────────────────────────────────────────────────
const CITIES: Record<string, CommunityConfig> = {
  kingman: {
    name:         "Kingman",
    slug:         "kingman",
    heroImage:    "/images/communities/kingman-hero.jpg",
    overviewImage: "/images/communities/kingman-aerial.jpg",
    tagline:      "The Heart of Historic Route 66 — Where Community Runs Deep",
    overview: [
      "Kingman is the seat of Mohave County and the heart of Western Arizona. Sitting at 3,300 feet elevation along the historic Route 66 corridor, Kingman offers cooler temperatures than the river communities to the west, panoramic mountain views in every direction, and a genuine small-town community feel that newcomers fall in love with almost immediately.",
      "The real estate market in Kingman is one of the most diverse in the region. Buyers can find everything from 40-acre ranches with mountain views to brand-new construction in master-planned communities, historic homes near downtown, and affordable manufactured homes on spacious lots. The median home price remains significantly below the national average, making Kingman one of the best values in Arizona.",
      "Downtown Kingman is experiencing a revival — local restaurants, breweries, and shops are breathing new life into the Route 66 corridor. The Hualapai Mountain Park sits just minutes from town, offering hiking, camping, and elevation-cooled summer escapes. Kingman is also perfectly positioned as a gateway to the Grand Canyon, Las Vegas, and Lake Mead, all within a 90-minute drive.",
      "Whether you are looking for your first home, a retirement destination with four mild seasons, or an investment property in a growing market — Kingman delivers options that most Arizona cities cannot match at this price point.",
    ],
    quickFacts: [
      { icon: "mountain",  value: "3,336 ft",   label: "Elevation" },
      { icon: "users",     value: "~32,000",     label: "Population" },
      { icon: "home",      value: "~$285,000",   label: "Median Home Price" },
      { icon: "calendar",  value: "1882",         label: "Founded" },
    ],
    loves: [
      {
        icon:  "map-pin",
        title: "Route 66 Culture",
        desc:  "Kingman's historic downtown is the heart of the longest remaining stretch of Route 66, with murals, museums, and local shops that keep the spirit alive.",
      },
      {
        icon:  "mountain",
        title: "Mountain Access",
        desc:  "Hualapai Mountain Park is 15 minutes from town with hiking trails, pine forests, and summer temperatures 20 degrees cooler than the valley floor.",
      },
      {
        icon:  "dollar",
        title: "Affordable Living",
        desc:  "Home prices well below Arizona averages with more land and square footage per dollar than Phoenix, Tucson, or Flagstaff.",
      },
    ],
  },

  "golden-valley": {
    name:         "Golden Valley",
    slug:         "golden-valley",
    heroImage:    "/images/communities/golden-valley-hero.jpg",
    overviewImage: "/images/communities/golden-valley-rock.jpg",
    tagline:      "Wide-Open Skies and Room to Breathe",
    overview: [
      "Golden Valley is where Western Arizona opens up. Located between Kingman and Bullhead City along Highway 68, Golden Valley is an unincorporated community defined by its wide-open spaces, one-acre-plus parcels, and a pace of life that city dwellers dream about. If you have ever wanted to step outside your front door and see nothing but desert, Joshua trees, and mountains — this is the place.",
      "The real estate landscape here is almost entirely rural residential. Most properties sit on one-acre lots or larger, many with no HOA restrictions, giving homeowners the freedom to build, garden, keep animals, or simply enjoy the solitude. Manufactured homes and site-built homes coexist throughout the valley, and prices remain among the most affordable in all of Mohave County.",
      "Golden Valley nights are legendary. With almost zero light pollution, the Milky Way is visible with the naked eye on clear evenings. The community is tight-knit and self-sufficient, with a growing number of small businesses, churches, and community organizations that give the area a quiet sense of belonging.",
      "For buyers looking for acreage, privacy, and a lower cost of living without sacrificing access to Kingman or Bullhead City — Golden Valley is the sweet spot. Both cities are a 20 to 30 minute drive in either direction, putting shopping, medical care, and the Colorado River within easy reach.",
    ],
    quickFacts: [
      { icon: "maximize",  value: "1+ acre",     label: "Avg Lot Size" },
      { icon: "users",     value: "~8,000",       label: "Population" },
      { icon: "home",      value: "~$215,000",    label: "Median Home Price" },
      { icon: "car",       value: "20 min",       label: "Drive to Kingman" },
    ],
    loves: [
      {
        icon:  "star",
        title: "Star-Filled Skies",
        desc:  "Near-zero light pollution makes Golden Valley one of the best stargazing locations in the Southwest. The Milky Way is visible most clear nights.",
      },
      {
        icon:  "maximize",
        title: "Space and Freedom",
        desc:  "One-acre minimum lots, no HOA restrictions, and room for horses, workshops, gardens, or whatever you need space for.",
      },
      {
        icon:  "navigation",
        title: "Central Location",
        desc:  "Perfectly positioned between Kingman and Bullhead City, with both towns a 20 to 30 minute drive for shopping, dining, and medical care.",
      },
    ],
  },

  "bullhead-city": {
    name:         "Bullhead City",
    slug:         "bullhead-city",
    heroImage:    "/images/communities/bullhead-city-hero.jpg",
    overviewImage: "/images/communities/bullhead-city-river.jpg",
    tagline:      "River Living on the Colorado — Where the Sun Never Quits",
    overview: [
      "Bullhead City sits on the banks of the Colorado River directly across from Laughlin, Nevada, and it is one of Western Arizona's most vibrant communities. With over 300 days of sunshine per year, immediate access to Lake Mohave and the Colorado River, and the Laughlin entertainment corridor right across the bridge — Bullhead City attracts snowbirds, retirees, water sports enthusiasts, and anyone who wants an active outdoor lifestyle year-round.",
      "The real estate market here ranges from affordable manufactured homes and starter properties to stunning riverfront estates with private docks. Active 55-plus communities like Vista del Rio and Sun Valley offer resort-style amenities for retirees, while family neighborhoods throughout the city provide solid schools and quiet streets. The Riverwalk is the community hub — a multi-mile paved trail along the river perfect for walking, cycling, and watching the sunset over the Laughlin skyline.",
      "Golfers will find several well-maintained courses including Chaparral Country Club and Mojave Resort Golf Club, both offering desert-mountain scenery that rivals Scottsdale at a fraction of the cost. Boating, jet skiing, kayaking, and fishing on the Colorado River and Lake Mohave are not weekend activities here — they are a way of life.",
      "For buyers who want sunshine, water access, and an active community with entertainment options just a bridge away — Bullhead City is the most lifestyle-rich market in Mohave County.",
    ],
    quickFacts: [
      { icon: "sun",       value: "300+",         label: "Sunny Days / Year" },
      { icon: "users",     value: "~42,000",       label: "Population" },
      { icon: "home",      value: "~$310,000",     label: "Median Home Price" },
      { icon: "waves",     value: "10+ miles",     label: "River Access" },
    ],
    loves: [
      {
        icon:  "waves",
        title: "Colorado River Access",
        desc:  "Boating, jet skiing, kayaking, and fishing are everyday activities, not weekend getaways. Lake Mohave and the river are minutes from most neighborhoods.",
      },
      {
        icon:  "anchor",
        title: "Laughlin Entertainment",
        desc:  "Casinos, dining, concerts, and nightlife are a five-minute drive across the bridge — all the fun without Nevada taxes on your Arizona home.",
      },
      {
        icon:  "users",
        title: "Active 55+ Communities",
        desc:  "Resort-style retirement communities with pools, golf, fitness centers, and organized social calendars make Bullhead City one of the top retirement destinations in Arizona.",
      },
    ],
  },

  "fort-mohave": {
    name:         "Fort Mohave",
    slug:         "fort-mohave",
    heroImage:    "/images/communities/fort-mohave-hero.jpg",
    overviewImage: "/images/communities/fort-mohave-tipi.jpg",
    tagline:      "Deep Roots, Modern Growth — Along the Colorado",
    overview: [
      "Fort Mohave is one of the fastest-growing communities in Mohave County, and for good reason. Sitting along the Colorado River south of Bullhead City, Fort Mohave combines historical significance with modern suburban growth — offering family-friendly neighborhoods, newer construction, and a quality of life that attracts relocators from across the country.",
      "The community takes its name from the 19th-century military outpost established here in 1859, and the Fort Mojave Indian Reservation borders the area, home to the ancient and massive Mojave Twin Intaglios — geoglyphs that are among the largest and oldest human-made figures on Earth. That sense of history grounds the community even as new housing developments, schools, and commercial centers continue to expand.",
      "Real estate in Fort Mohave skews newer than other Mohave County markets. Buyers will find a strong inventory of homes built in the last 15 to 20 years, many in planned subdivisions with modern amenities. Golf course communities like Los Lagos and Desert Lakes offer green fairway views in the middle of the Mojave Desert. The Colorado River is just minutes away, giving residents the same water recreation access as Bullhead City.",
      "Fort Mohave is also home to one of Arizona's highest-intensity solar energy production zones, reflecting the region's commitment to sustainable development. For families, retirees, and investors looking for newer construction, reasonable prices, and a growing community with deep historical roots — Fort Mohave is a compelling choice.",
    ],
    quickFacts: [
      { icon: "landmark",  value: "1859",         label: "Year Established" },
      { icon: "users",     value: "~15,000",       label: "Population" },
      { icon: "home",      value: "~$330,000",     label: "Median Home Price" },
      { icon: "flag",      value: "3+ nearby",     label: "Golf Courses" },
    ],
    loves: [
      {
        icon:  "building",
        title: "Newer Construction",
        desc:  "Fort Mohave's housing stock is significantly newer than surrounding communities, with modern floor plans, energy-efficient features, and planned subdivisions.",
      },
      {
        icon:  "book",
        title: "Historical Significance",
        desc:  "From the 1859 military outpost to the ancient Mojave geoglyphs, Fort Mohave has a historical depth that most growing communities lack.",
      },
      {
        icon:  "flag",
        title: "Golf and River Living",
        desc:  "Multiple golf course communities and easy Colorado River access give Fort Mohave residents the best of both desert and waterfront lifestyles.",
      },
    ],
  },
};

// ── JSON-LD schema builder ────────────────────────────────────────────────────
function buildSchema(city: CommunityConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "name":  "Amy Casanova",
        "url":   "https://arizonabuyandsell.com",
        "areaServed": {
          "@type": "City",
          "name":  city.name,
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name":  "Mohave County",
            "containedInPlace": { "@type": "State", "name": "Arizona" },
          },
        },
      },
      {
        "@type": "LocalBusiness",
        "name":  "Amy Casanova Real Estate",
        "url":   "https://arizonabuyandsell.com",
        "address": {
          "@type":           "PostalAddress",
          "addressLocality": city.name,
          "addressRegion":   "AZ",
          "addressCountry":  "US",
        },
        "description": `Top Realtor serving ${city.name}, AZ and Western Arizona.`,
      },
    ],
  };
}

// ── Main template ─────────────────────────────────────────────────────────────
export default function CommunityPageTemplate({ slug }: { slug: string }) {
  const city   = CITIES[slug];
  const others = ALL_COMMUNITIES.filter(c => c.slug !== slug);
  const schema = buildSchema(city);

  return (
    <main>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "60vh", minHeight: 480 }}
      >
        <Image
          src={city.heroImage}
          alt={`${city.name}, Arizona`}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(33,37,41,.2) 0%, rgba(33,37,41,.75) 100%)" }}
        />
        <div className="relative z-10 text-center px-6" style={{ maxWidth: 720 }}>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12, color: STONE,
            textTransform: "uppercase", letterSpacing: ".25em",
            marginBottom: 16,
          }}>
            Explore {city.name}
          </p>
          <h1 style={{
            fontFamily:  "var(--font-inter), sans-serif",
            fontWeight:  500,
            fontSize:    "clamp(2.5rem, 6vw, 4rem)",
            color:       LINEN,
            lineHeight:  1.05,
            margin:      "0 0 16px",
          }}>
            {city.name}
          </h1>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 18, color: STONE,
            margin: "0 0 32px", lineHeight: 1.5,
          }}>
            {city.tagline}
          </p>
          <Link
            href="/search-properties"
            style={{
              display:        "inline-block",
              background:     LINEN,
              color:          SLATE,
              borderRadius:   999,
              fontFamily:     "var(--font-inter), sans-serif",
              fontWeight:     500,
              fontSize:       14,
              padding:        "16px 28px",
              textDecoration: "none",
            }}
          >
            Search {city.name} Homes
          </Link>
        </div>
      </section>

      {/* ── Section 2: Overview ──────────────────────────────────────────── */}
      <section className="px-6 py-20 desk:py-[120px]" style={{ background: LINEN }}>
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 desk:grid-cols-[3fr_2fr] gap-12 items-start">

            {/* Left — text */}
            <FadeIn>
              <p style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12, color: "#8a7f75",
                textTransform: "uppercase", letterSpacing: ".25em",
                marginBottom: 14,
              }}>
                About {city.name}
              </p>
              <h2 style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500, fontSize: 36, color: SLATE,
                margin: "0 0 28px",
              }}>
                Living in {city.name}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {city.overview.map((para, i) => (
                  <p key={i} style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 16, color: SLATE,
                    lineHeight: 1.8, margin: 0,
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </FadeIn>

            {/* Right — photo */}
            <FadeIn delay={100}>
              <div
                className="relative w-full"
                style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "3/4" }}
              >
                <Image
                  src={city.overviewImage}
                  alt={`${city.name} Arizona scenery`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 960px) 100vw, 40vw"
                />
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Section 3: Quick Facts ───────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: STEEL }}>
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-2 desk:grid-cols-4 gap-8">
            {city.quickFacts.map((fact, i) => (
              <FadeIn key={fact.label} delay={i * 80}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: STONE, marginBottom: 14, display: "flex", justifyContent: "center" }}>
                    <Icon name={fact.icon} size={28} />
                  </div>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500, fontSize: 28, color: LINEN,
                    margin: "0 0 6px",
                  }}>
                    {fact.value}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 12, color: STONE,
                    textTransform: "uppercase", letterSpacing: ".1em",
                    margin: 0,
                  }}>
                    {fact.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: What Residents Love ──────────────────────────────── */}
      <section className="px-6 py-20 desk:py-[120px]" style={{ background: LINEN }}>
        <div className="max-w-[1240px] mx-auto">
          <FadeIn style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12, color: "#8a7f75",
              textTransform: "uppercase", letterSpacing: ".25em",
              marginBottom: 14,
            }}>
              Why People Choose {city.name}
            </p>
            <h2 style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500, fontSize: 32, color: SLATE,
              margin: 0,
            }}>
              What Residents Love
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 desk:grid-cols-3 gap-8">
            {city.loves.map((card, i) => (
              <FadeIn key={card.title} delay={i * 100}>
                <div style={{
                  background:   "#ffffff",
                  borderRadius: 12,
                  padding:      32,
                  border:       "1px solid rgba(0,0,0,.06)",
                }}>
                  <div style={{ color: STONE, marginBottom: 16 }}>
                    <Icon name={card.icon} size={32} />
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500, fontSize: 18, color: SLATE,
                    margin: "0 0 10px",
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 15, color: "#6a6158",
                    lineHeight: 1.7, margin: 0,
                  }}>
                    {card.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Active Listings (client component) ────────────────── */}
      <CommunityListingsSection cityName={city.name} />

      {/* ── Section 6: Nestimate CTA ──────────────────────────────────────── */}
      <section className="py-20 desk:py-[120px] px-6" style={{ background: STEEL }}>
        <div className="max-w-[760px] mx-auto" style={{ textAlign: "center" }}>
          <FadeIn>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12, color: STONE,
              textTransform: "uppercase", letterSpacing: ".25em",
              marginBottom: 20,
            }}>
              AI-Powered Home Valuation
            </p>
            <h2 style={{
              fontFamily:  "var(--font-alex-brush), cursive",
              fontSize:    "clamp(3rem, 8vw, 3.5rem)",
              color:       LINEN,
              lineHeight:  1.05,
              margin:      "0 0 24px",
            }}>
              Own a Home in {city.name}?
            </h2>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 16, color: STONE,
              lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px",
            }}>
              Find out what it&apos;s worth. Get your free Nestimate — delivered within 24 hours.
            </p>
            <Link
              href="/home-value"
              style={{
                display:        "inline-block",
                background:     STONE,
                color:          SLATE,
                borderRadius:   999,
                fontFamily:     "var(--font-inter), sans-serif",
                fontWeight:     500,
                fontSize:       15,
                padding:        "18px 32px",
                textDecoration: "none",
              }}
            >
              Get My Free Home Valuation
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Section 7: Explore Other Communities ─────────────────────────── */}
      <section className="px-6 py-20" style={{ background: LINEN }}>
        <div className="max-w-[1240px] mx-auto">
          <FadeIn style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500, fontSize: 24, color: SLATE,
              margin: 0,
            }}>
              Explore Other Communities
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 desk:grid-cols-3 gap-5">
            {others.map((c, i) => (
              <FadeIn key={c.slug} delay={i * 100}>
                <Link
                  href={`/communities/${c.slug}`}
                  className="group relative block rounded-[12px] overflow-hidden no-underline"
                  style={{ aspectRatio: "16/9" }}
                >
                  <div
                    className="absolute inset-0 group-hover:scale-105 transition-transform duration-[600ms]"
                    style={{ background: c.bg }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg,rgba(33,37,41,.2) 0%,rgba(33,37,41,.75) 100%)" }}
                  />
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                    style={{ padding: "24px 32px" }}
                  >
                    <h3 style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 500, fontSize: 22, color: LINEN,
                      margin: "0 0 8px",
                    }}>
                      {c.name}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 13, color: STONE,
                      margin: "0 0 14px", lineHeight: 1.5,
                    }}>
                      {c.desc}
                    </p>
                    <span style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 12, color: LINEN,
                      textTransform: "uppercase", letterSpacing: ".15em",
                      borderBottom: `1px solid ${LINEN}`,
                      paddingBottom: 2,
                    }}>
                      Explore
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
