import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// GET — list saved search templates
export async function GET() {
  const { data, error } = await getSupabase()
    .from("search_templates")
    .select("id, name, criteria, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ templates: data ?? [] });
}

// POST — save the current form state as a new template
export async function POST(req: NextRequest) {
  let body: { name?: string; criteria?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Template name is required" }, { status: 400 });
  }
  if (!body.criteria || typeof body.criteria !== "object") {
    return NextResponse.json({ error: "Missing criteria" }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("search_templates")
    .insert({ name, criteria: body.criteria })
    .select("id, name, criteria, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ template: data });
}
