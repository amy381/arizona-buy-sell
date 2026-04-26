import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { isAdminAuthorized } from "@/lib/adminSession";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  if (!isAdminAuthorized(req, body)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabase()
    .from("chat_conversations")
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("[Admin/chats] Supabase error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }

  return NextResponse.json({ conversations: data });
}
