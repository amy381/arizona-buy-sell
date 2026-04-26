import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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
        .select("id, slug, title, excerpt, published, published_at, created_at")
        .order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ posts: data ?? [] });
    }

    case "get": {
      const { id } = body as { id: number };
      if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ post: data });
    }

    case "create": {
      const { title, excerpt, body: postBody, published } = body as Record<string, unknown>;
      if (!title || !postBody) {
        return NextResponse.json({ error: "title and body are required" }, { status: 400 });
      }
      const slug       = slugify(String(title));
      const isPublished = !!published;
      const { data, error } = await db
        .from("blog_posts")
        .insert({
          slug,
          title,
          excerpt:      excerpt || "",
          body:         postBody,
          published:    isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
        })
        .select("id, slug")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ post: data });
    }

    case "update": {
      const { id, title, excerpt, body: postBody, published } = body as Record<string, unknown>;
      if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

      const updates: Record<string, unknown> = {};
      if (title    !== undefined) updates.title   = title;
      if (excerpt  !== undefined) updates.excerpt = excerpt;
      if (postBody !== undefined) updates.body    = postBody;
      if (published !== undefined) {
        updates.published    = published;
        updates.published_at = published ? new Date().toISOString() : null;
      }

      const { data, error } = await db
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select("id, slug")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ post: data });
    }

    case "delete": {
      const { id } = body as { id: number };
      if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
      const { error } = await db.from("blog_posts").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
