import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
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
