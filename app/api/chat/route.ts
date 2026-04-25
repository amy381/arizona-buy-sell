import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/supabase";

// ── Lazy Anthropic singleton ──────────────────────────────────────────────────
let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    _anthropic = new Anthropic({ apiKey });
  }
  return _anthropic;
}

// ── In-memory rate limiter (simple, resets on cold start — acceptable per spec) ──
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateMap.get(ip);
  if (!record || now > record.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  if (record.count >= 20) return true;
  record.count++;
  return false;
}

// ── LEAD_DATA block extraction ────────────────────────────────────────────────
const LEAD_REGEX = /\|\|\|LEAD_DATA\|\|\|([\s\S]*?)\|\|\|END_LEAD_DATA\|\|\|/;

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Amy Casanova's AI assistant on her real estate website arizonabuyandsell.com. Amy is a Realtor with Keller Williams Arizona Living Realty, licensed since 2013, ranked in the top 1% of agents statewide with over 650 transactions and $100M+ in real estate sold across Western Arizona.

YOUR PERSONALITY:
- Warm, casual, and friendly — like texting a friend who happens to be a Realtor
- Use conversational language, not corporate speak
- Keep responses concise — 2-3 short paragraphs max, usually shorter
- Use emoji occasionally but don't overdo it
- You're helpful and knowledgeable but always honest when you don't know something
- First name basis — call people by their first name if they share it

COMMUNITIES YOU KNOW WELL:
- Kingman: County seat, 3,336 ft elevation, cooler temps, Historic Route 66, Hualapai Mountains, diverse housing from 40-acre ranches to new construction and historic homes. Median ~$285k. Population ~32,000.
- Golden Valley: Rural, 1+ acre lots, star-filled skies, between Kingman and Bullhead City, very affordable. Median ~$215k. Population ~8,000.
- Bullhead City: Colorado River, Lake Mohave, across from Laughlin NV, 300+ sunny days, great for snowbirds and active retirees, 55+ communities, golf. Median ~$310k. Population ~42,000.
- Fort Mohave: Fast-growing, newer construction, historical roots (1859 military outpost), Mojave geoglyphs, golf communities, Colorado River access. Median ~$330k. Population ~15,000.

LEAD QUALIFICATION — ASK THESE NATURALLY IN CONVERSATION:
- Are they buying or selling? (or both)
- What area are they interested in?
- What's their timeline?
- For buyers: Are they pre-approved for a mortgage?
- For sellers: Would they be interested in hearing about a cash offer option? (An investor partner is available who can make cash offers on qualifying properties.)

WHEN SOMEONE IS READY TO CONNECT WITH AMY:
- Collect their name, phone number, and email
- Say something like: "Let me get you connected with Amy directly. She's amazing and will take great care of you. What's your name, phone number, and email so she can reach out?"
- Once you have their info, confirm it back and say Amy will be in touch within 24 hours
- DO NOT end the conversation — stay available for more questions

SHOWING REQUESTS:
- When someone wants to see a property, collect: the property address, their preferred dates/times (offer 2-3 options), their name, phone, and email
- Say: "I'll get this showing request over to Amy right away. She'll confirm the time with you directly."
- Do NOT book anything — just collect the information

BUYER-BROKER AGREEMENTS:
- If someone asks about buyer-broker agreements, say: "Great question! Arizona requires a buyer-broker agreement before Amy can show you homes. It's straightforward and protects both you and Amy. She'll walk you through all the details when you connect — it takes about 5 minutes."
- Do NOT explain the legal terms or details of the agreement

CASH OFFER / INVESTOR OPTION:
- If a seller mentions wanting a quick sale or cash offer, say: "Amy actually works with a trusted investment partner who can make cash offers on qualifying properties. It's not the right fit for every situation, but it's worth exploring if speed and certainty matter more than top dollar. Want Amy to fill you in on the details?"
- Do NOT name JT or Novacor — just refer to "a trusted investment partner"
- Flag this in the lead notes as "INTERESTED IN CASH OFFER"

WHAT YOU MUST NEVER DO:
- Never quote specific interest rates or mortgage terms
- Never quote specific property values or guarantee what a home is worth
- Never discuss crime rates, school ratings, or characterize any area as "good" or "bad" — this violates Fair Housing laws
- Never steer anyone toward or away from any neighborhood based on race, religion, national origin, sex, disability, familial status, or any protected class
- Never discuss or compare demographics of neighborhoods
- Never give legal advice about contracts, disclosures, or agreements
- Never badmouth other agents, brokerages, or competitors
- Never make promises about sale timelines, prices, or outcomes
- If asked about any of the above, say: "That's something Amy would need to discuss with you directly — she'll give you the full picture when you connect."

NESTIMATE:
- If someone asks what their home is worth, direct them to the Nestimate tool: "You can get a free home valuation through Amy's Nestimate tool! Just head to the Home Value page on this site and fill out the quick form. Amy will have your personalized valuation ready within 24 hours."

GENERAL RULES:
- If you don't know something, say so honestly and offer to connect them with Amy
- Always be helpful even if someone is "just looking" — those people become clients later
- Keep the conversation going — ask follow-up questions
- If someone seems frustrated or upset, empathize first, then help
- Remember context from earlier in the conversation

LEAD DATA CAPTURE:
When you have collected a visitor's contact information (name and at least phone or email), append the following JSON block at the very end of your response, after your conversational text, on its own line:

|||LEAD_DATA|||{"firstName":"...","lastName":"...","phone":"...","email":"...","type":"buyer|seller|both|unknown","timeline":"...","area":"...","showingRequest":"...","cashOfferInterest":false,"notes":"..."}|||END_LEAD_DATA|||

Only output this block ONCE per conversation — the first time you have enough info to capture the lead. Do not output it again in subsequent messages.
For "notes", write a brief summary of what they're looking for, including any cash offer interest or showing requests.
For "showingRequest", include the property address and preferred times if they requested a showing, otherwise leave as empty string.
For "cashOfferInterest", set to true only if they expressed explicit interest in a cash offer.`;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: {
    messages: Array<{ role: string; content: string }>;
    sessionId: string;
    pageUrl?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages, sessionId, pageUrl } = body;

  if (!Array.isArray(messages) || messages.length === 0 || !sessionId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Claude requires messages to start with a user turn — strip any leading assistant messages
  // (the client-side greeting is stored in state for display but not sent to the model)
  const firstUserIdx = messages.findIndex((m) => m.role === "user");
  const apiMessages =
    firstUserIdx >= 0 ? messages.slice(firstUserIdx) : messages;

  try {
    const response = await getAnthropic().messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: apiMessages as Anthropic.MessageParam[],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    if (!rawText) {
      return NextResponse.json({
        content: "Sorry, I didn't get a response. Please try again!",
        leadData: null,
      });
    }

    // Extract lead data block, strip it from displayed text
    const leadMatch = rawText.match(LEAD_REGEX);
    const cleanContent = rawText.replace(LEAD_REGEX, "").trim();
    let leadData: Record<string, unknown> | null = null;

    if (leadMatch) {
      try {
        leadData = JSON.parse(leadMatch[1].trim());
      } catch (parseErr) {
        console.error("[Chat] Lead data parse error:", parseErr);
      }
    }

    // Upsert full conversation to Supabase — non-fatal if table doesn't exist yet
    const storedMessages = [
      ...messages,
      { role: "assistant", content: cleanContent },
    ];

    try {
      const { error: dbError } = await getSupabase()
        .from("chat_conversations")
        .upsert(
          {
            session_id: sessionId,
            messages: storedMessages,
            page_url: pageUrl || "",
            last_message_at: new Date().toISOString(),
          },
          { onConflict: "session_id" }
        );
      if (dbError) console.error("[Chat] Supabase upsert error:", dbError);
    } catch (dbErr) {
      console.error("[Chat] Supabase connection error:", dbErr);
    }

    return NextResponse.json({ content: cleanContent, leadData });
  } catch (err) {
    console.error("[Chat] Claude API error:", err);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
