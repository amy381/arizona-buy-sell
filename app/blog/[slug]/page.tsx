import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getSupabase } from "@/lib/supabase";

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
  body:         string;
  published:    boolean;
  published_at: string | null;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data } = await getSupabase()
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found — Amy Casanova Real Estate" };
  return {
    title:       `${post.title} — Amy Casanova Real Estate`,
    description: post.excerpt || `Read ${post.title} on Amy Casanova's real estate blog.`,
    openGraph: {
      title:       `${post.title} — Amy Casanova Real Estate`,
      description: post.excerpt || `Read ${post.title} on Amy Casanova's real estate blog.`,
      type:        "article",
    },
  };
}

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

const BLOG_STYLES = `
  .blog-body h1, .blog-body h2, .blog-body h3 {
    color: #F0EBE3;
    font-weight: 600;
    line-height: 1.25;
    margin: 2em 0 .75em;
  }
  .blog-body h1 { font-size: 2em; }
  .blog-body h2 { font-size: 1.45em; }
  .blog-body h3 { font-size: 1.2em; }
  .blog-body p  { margin: 0 0 1.4em; }
  .blog-body ul, .blog-body ol { margin: 0 0 1.4em; padding-left: 1.8em; }
  .blog-body li { margin-bottom: .45em; }
  .blog-body a  { color: #B8A898; text-underline-offset: 3px; }
  .blog-body a:hover { color: #F0EBE3; }
  .blog-body strong { color: #F0EBE3; font-weight: 600; }
  .blog-body blockquote {
    border-left: 3px solid #B8A898;
    margin: 1.5em 0;
    padding: .5em 0 .5em 1.5em;
    color: #B8A898;
    font-style: italic;
  }
  .blog-body hr {
    border: none;
    border-top: 1px solid rgba(184,168,152,.25);
    margin: 2.5em 0;
  }
  .blog-body code {
    background: rgba(0,0,0,.3);
    border-radius: 4px;
    padding: .15em .4em;
    font-size: .9em;
  }
  .blog-body pre {
    background: rgba(0,0,0,.3);
    border-radius: 8px;
    padding: 1em 1.25em;
    overflow-x: auto;
    margin: 0 0 1.4em;
  }
  .blog-body pre code {
    background: none;
    padding: 0;
  }
  .blog-body table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 1.4em;
  }
  .blog-body th, .blog-body td {
    padding: 8px 12px;
    border: 1px solid rgba(184,168,152,.2);
    font-size: .95em;
  }
  .blog-body th { background: rgba(0,0,0,.2); color: #F0EBE3; }
`;

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main>
      <style>{BLOG_STYLES}</style>

      {/* ── Hero ── */}
      <section
        style={{
          background: SLATE,
          minHeight:  "35vh",
          display:    "flex",
          alignItems: "flex-end",
          padding:    "100px 24px 56px",
        }}
      >
        <div className="max-w-[820px] mx-auto w-full">
          {post.published_at && (
            <p style={{
              fontFamily:    FONT,
              fontSize:      11,
              color:         STONE,
              textTransform: "uppercase",
              letterSpacing: ".22em",
              margin:        "0 0 18px",
            }}>
              {fmtDate(post.published_at)}
            </p>
          )}
          <h1 style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize:   "clamp(28px, 5vw, 44px)",
            color:      LINEN,
            lineHeight: 1.2,
            margin:     0,
          }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{
              fontFamily: FONT,
              fontSize:   18,
              color:      STONE,
              margin:     "18px 0 0",
              lineHeight: 1.6,
            }}>
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* ── Gradient image placeholder ── */}
      <div style={{
        height:     200,
        background: "linear-gradient(135deg, #2E3338 0%, #3a4045 50%, #212529 100%)",
      }} />

      {/* ── Body ── */}
      <section style={{ background: STEEL, padding: "64px 24px 96px" }}>
        <div className="max-w-[820px] mx-auto">
          <div
            className="blog-body"
            style={{
              fontFamily: FONT,
              fontSize:   17,
              lineHeight: 1.8,
              color:      "rgba(240,235,227,.9)",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </div>

          <div style={{
            marginTop:  56,
            paddingTop: 36,
            borderTop:  "1px solid rgba(184,168,152,.2)",
          }}>
            <Link
              href="/blog"
              style={{ fontFamily: FONT, fontSize: 14, color: STONE, textDecoration: "none" }}
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
