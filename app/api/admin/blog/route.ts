import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// ── Column mapping notes ──────────────────────────────────────────────────────
// The existing blog_posts table uses:
//   content  (not body)
//   status   text "published"|"draft"  (not published boolean)
// The existing generated_content table uses:
//   type        (not content_type)
//   input_data  (not prompt_inputs)
//   output_text (not generated_text)

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { password, action } = body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabase();

  switch (action) {
    case "list": {
      const { data, error } = await db
        .from("blog_posts")
        .select("id, slug, title, excerpt, status, published_at, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("[Admin/blog] list — Supabase error:", {
          code: error.code, message: error.message,
          details: error.details, hint: error.hint,
        });
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      // Map status string → published boolean for the frontend
      const posts = (data ?? []).map((p) => ({
        ...p,
        published: p.status === "published",
      }));
      return NextResponse.json({ posts });
    }

    case "get": {
      const { id } = body as { id: number };
      if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("[Admin/blog] get — Supabase error:", {
          code: error.code, message: error.message,
          details: error.details, hint: error.hint,
        });
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
      // Map content → body, status → published for the frontend
      const post = {
        ...data,
        body:      data.content,
        published: data.status === "published",
      };
      return NextResponse.json({ post });
    }

    case "create": {
      const { title, excerpt, body: postBody, published } = body as Record<string, unknown>;
      if (!title || !postBody) {
        return NextResponse.json({ error: "title and body are required" }, { status: 400 });
      }
      const slug        = slugify(String(title));
      const isPublished = !!published;
      const { data, error } = await db
        .from("blog_posts")
        .insert({
          slug,
          title,
          excerpt:      excerpt || "",
          content:      postBody,                                // code: body
          status:       isPublished ? "published" : "draft",    // code: published boolean
          published_at: isPublished ? new Date().toISOString() : null,
        })
        .select("id, slug")
        .single();
      if (error) {
        console.error("[Admin/blog] create — Supabase error:", {
          code: error.code, message: error.message,
          details: error.details, hint: error.hint,
        });
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ post: data });
    }

    case "update": {
      const { id, title, excerpt, body: postBody, published } = body as Record<string, unknown>;
      if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

      const updates: Record<string, unknown> = {};
      if (title    !== undefined) updates.title   = title;
      if (excerpt  !== undefined) updates.excerpt = excerpt;
      if (postBody !== undefined) updates.content = postBody;          // code: body
      if (published !== undefined) {
        updates.status       = published ? "published" : "draft";      // code: published boolean
        updates.published_at = published ? new Date().toISOString() : null;
      }

      const { data, error } = await db
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select("id, slug")
        .single();
      if (error) {
        console.error("[Admin/blog] update — Supabase error:", {
          code: error.code, message: error.message,
          details: error.details, hint: error.hint,
        });
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ post: data });
    }

    case "delete": {
      const { id } = body as { id: number };
      if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
      const { error } = await db.from("blog_posts").delete().eq("id", id);
      if (error) {
        console.error("[Admin/blog] delete — Supabase error:", {
          code: error.code, message: error.message,
          details: error.details, hint: error.hint,
        });
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
