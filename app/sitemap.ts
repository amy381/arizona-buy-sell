import { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

const BASE = "https://arizonabuyandsell.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,                                  changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/search-properties`,           changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/communities`,                 changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/communities/kingman`,         changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/communities/golden-valley`,   changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/communities/bullhead-city`,   changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/communities/fort-mohave`,     changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/sell`,                        changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/home-value`,                  changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/buyers`,                      changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/sellers`,                     changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/listing-alerts`,              changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/mortgage-calculator`,         changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`,                       changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`,                     changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/follow-along`,                changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/blog`,                        changeFrequency: "weekly",  priority: 0.8 },
  ];

  let blog_entries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await getSupabase()
      .from("blog_posts")
      .select("slug, published_at")
      .eq("status", "published");

    if (data) {
      blog_entries = data.map((post) => ({
        url:             `${BASE}/blog/${post.slug}`,
        lastModified:    post.published_at ? new Date(post.published_at) : undefined,
        changeFrequency: "monthly" as const,
        priority:        0.6,
      }));
    }
  } catch {
    // Supabase unavailable at build time — blog posts omitted
  }

  return [...static_pages, ...blog_entries];
}
