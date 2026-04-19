import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.NESTIMATE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Query param ─────────────────────────────────────────────────────────────
  const address = req.nextUrl.searchParams.get("address");
  if (!address || address.trim() === "") {
    return NextResponse.json({ error: "address query parameter is required" }, { status: 400 });
  }

  // ── Lookup ──────────────────────────────────────────────────────────────────
  const { data, error } = await getSupabase()
    .from("nestimate_submissions")
    .select("owner_first, owner_last, phone, email, intent_signal, submitted_at, is_duplicate")
    .ilike("address", `%${address.trim()}%`)
    .order("submitted_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[Nestimate/lookup] Supabase error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ found: false });
  }

  const row = data[0];
  return NextResponse.json({
    found: true,
    submission: {
      name:          `${row.owner_first} ${row.owner_last}`,
      phone:         row.phone,
      email:         row.email,
      intent_signal: row.intent_signal,
      submitted_at:  row.submitted_at,
      is_duplicate:  row.is_duplicate,
    },
  });
}
