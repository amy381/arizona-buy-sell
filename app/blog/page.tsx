import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:       "Blog — Amy Casanova Real Estate | Western Arizona",
  description: "Real estate tips, market updates, and Western Arizona community insights from Amy Casanova.",
  openGraph: {
    title:       "Blog — Amy Casanova Real Estate | Western Arizona",
    description: "Real estate tips, market updates, and Western Arizona community insights from Amy Casanova.",
    type:        "website",
  },
};

const FONT  = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";
const STEEL = "#2E3338";

interface Post {
  id:           number;
  slug:         string;
  title:        string;
  excerpt:      string;
  published_at: string | null;
}

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default async function BlogIndexPage() {
  let posts: Post[] = [];
  try {
    const { data } = await getSupabase()
      .from("blog_posts")
      .select("id, slug, title, excerpt, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    posts = data ?? [];
  } catch {
    // renders empty state on error
  }

  return (
    <main>

      {/* ── Hero ── */}
      <section
        style={{
          background:     SLATE,
          minHeight:      "40vh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          textAlign:      "center",
          padding:        "100px 24px 72px",
        }}
      >
        <div>
          <p style={{
            fontFamily:    FONT,
            fontSize:      12,
            color:         STONE,
            textTransform: "uppercase",
            letterSpacing: ".25em",
            margin:        "0 0 20px",
          }}>
            Insights &amp; Updates
          </p>
          <h1 style={{
            fontFamily: "var(--font-alex-brush), cursive",
            fontSize:   "clamp(48px, 8vw, 64px)",
            color:      LINEN,
            lineHeight: 1.05,
            margin:     "0 0 20px",
          }}>
            The Blog
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 18, color: STONE, margin: 0 }}>
            Real estate tips, market updates, and Arizona life.
          </p>
        </div>
      </section>

      {/* ── Posts grid ── */}
      <section style={{ background: STEEL, padding: "80px 24px 96px" }}>
        <div className="max-w-[1240px] mx-auto">
          {posts.length === 0 ? (
            <p style={{
              fontFamily: FONT, fontSize: 16, color: STONE,
              textAlign: "center", padding: "64px 0",
            }}>
              No posts published yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 desk:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                  className="group"
                >
                  <article
                    className="group-hover:-translate-y-1 group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.32)] transition-[transform,box-shadow] duration-[220ms]"
                    style={{
                      background:    SLATE,
                      borderRadius:  14,
                      overflow:      "hidden",
                      height:        "100%",
                      display:       "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{
                      height:     200,
                      background: "linear-gradient(135deg, #2E3338 0%, #3a4045 50%, #212529 100%)",
                      flexShrink: 0,
                    }} />
                    <div style={{ padding: "22px 24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                      {post.published_at && (
                        <p style={{
                          fontFamily:    FONT,
                          fontSize:      11,
                          color:         STONE,
                          textTransform: "uppercase",
                          letterSpacing: ".18em",
                          margin:        "0 0 10px",
                        }}>
                          {fmtDate(post.published_at)}
                        </p>
                      )}
                      <h2 style={{
                        fontFamily: FONT,
                        fontSize:   18,
                        fontWeight: 600,
                        color:      LINEN,
                        lineHeight: 1.35,
                        margin:     "0 0 12px",
                      }}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p style={{
                          fontFamily: FONT,
                          fontSize:   14,
                          color:      STONE,
                          lineHeight: 1.6,
                          margin:     "0 0 20px",
                          flex:       1,
                        }}>
                          {post.excerpt}
                        </p>
                      )}
                      <span style={{ fontFamily: FONT, fontSize: 13, color: LINEN }}>
                        Read more →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
