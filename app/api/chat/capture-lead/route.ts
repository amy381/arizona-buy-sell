import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let body: {
    sessionId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    type: string;
    timeline: string;
    area: string;
    showingRequest: string;
    cashOfferInterest: boolean;
    notes: string;
    conversationTranscript: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    sessionId,
    firstName,
    lastName,
    phone,
    email,
    type,
    showingRequest,
    cashOfferInterest,
    notes,
    conversationTranscript,
  } = body;

  if (!sessionId || (!phone && !email)) {
    return NextResponse.json(
      { error: "sessionId and at least one of phone or email are required" },
      { status: 422 }
    );
  }

  // Build note with special flags first
  const prefixes: string[] = [];
  if (cashOfferInterest) prefixes.push("⚠️ INTERESTED IN CASH OFFER");
  if (showingRequest)    prefixes.push(`🏠 SHOWING REQUEST — ${showingRequest}`);
  const prefix = prefixes.length ? prefixes.join(" | ") + " — " : "";

  const fullNote = `AI Chatbot Lead — ${prefix}${notes}\n\nFull conversation:\n${conversationTranscript}`;

  // ── Post to Follow Up Boss ────────────────────────────────────────────────
  const apiKey = process.env.FOLLOW_UP_BOSS_API_KEY;
  if (apiKey) {
    try {
      const credentials = Buffer.from(`${apiKey}:`).toString("base64");
      const fubRes = await fetch("https://api.followupboss.com/v1/events", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Basic ${credentials}`,
          "X-System":      "ArizonaBuySell",
          "X-System-Key":  apiKey,
        },
        body: JSON.stringify({
          source: "AI Chatbot — arizonabuyandsell.com",
          type:   type === "seller" ? "Seller Inquiry" : "General Inquiry",
          person: {
            firstName: firstName || "Chat",
            lastName:  lastName  || "Lead",
            emails: email ? [{ value: email }] : [],
            phones: phone ? [{ value: phone }] : [],
          },
          note: fullNote,
        }),
      });

      if (!fubRes.ok) {
        const text = await fubRes.text();
        console.error("[Chat/capture-lead] FUB error:", fubRes.status, text);
      }
    } catch (fubErr) {
      console.error("[Chat/capture-lead] FUB request failed:", fubErr);
    }
  } else {
    console.warn("[Chat/capture-lead] FOLLOW_UP_BOSS_API_KEY not set — skipping FUB");
  }

  // ── Update Supabase conversation record ───────────────────────────────────
  try {
    const { error: dbError } = await getSupabase()
      .from("chat_conversations")
      .update({
        lead_captured: true,
        lead_name:  `${firstName || ""} ${lastName || ""}`.trim() || "Unknown",
        lead_email: email || "",
        lead_phone: phone || "",
      })
      .eq("session_id", sessionId);

    if (dbError) console.error("[Chat/capture-lead] Supabase update error:", dbError);
  } catch (dbErr) {
    console.error("[Chat/capture-lead] Supabase connection error:", dbErr);
  }

  return NextResponse.json({ ok: true });
}
