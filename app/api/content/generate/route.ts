import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/supabase";

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    _anthropic = new Anthropic({ apiKey });
  }
  return _anthropic;
}

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateMap.get(ip);
  if (!record || now > record.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (record.count >= 10) return true;
  record.count++;
  return false;
}

type ContentType =
  | "blog_post"
  | "listing_description"
  | "social_caption"
  | "market_update"
  | "newsletter";

interface PromptConfig {
  maxTokens:   number;
  buildPrompt: (inputs: Record<string, string>) => string;
}

const PROMPTS: Record<ContentType, PromptConfig> = {
  blog_post: {
    maxTokens: 2000,
    buildPrompt: ({ topic, keywords, tone }) =>
      `Write a blog post for Amy Casanova's real estate website about: ${topic}
Keywords to include naturally: ${keywords || "none"}
Tone: ${tone || "warm, professional, informative"}

Write a complete blog post with:
- An engaging title (as a # heading)
- 4-6 sections with ## headings
- Practical, helpful content for home buyers and sellers in Mohave County
- A brief call-to-action at the end mentioning Amy Casanova

Format in Markdown. Do not include a meta description or front matter.`,
  },

  listing_description: {
    maxTokens: 500,
    buildPrompt: ({ address, beds, baths, sqft, features }) =>
      `Write a compelling MLS listing description for this property:
Address: ${address || "Mohave County, AZ home"}
Beds: ${beds || "—"}, Baths: ${baths || "—"}, Sq Ft: ${sqft || "—"}
Key features: ${features || "none provided"}

Write 2-3 paragraphs (150-250 words total). Engaging and accurate, no hyperbole. Do not include price or agent info. No markdown formatting.`,
  },

  social_caption: {
    maxTokens: 200,
    buildPrompt: ({ topic, platform, tone }) =>
      `Write a social media caption for Amy Casanova's real estate accounts.
Platform: ${platform || "Instagram"}
Topic: ${topic}
Tone: ${tone || "engaging, friendly"}

Write one caption (50-150 words). Include 3-5 relevant hashtags at the end. No markdown, no quotes around the caption.`,
  },

  market_update: {
    maxTokens: 1000,
    buildPrompt: ({ area, timeframe, highlights }) =>
      `Write a real estate market update for Amy Casanova's blog.
Area: ${area || "Mohave County (Kingman, Bullhead City, Fort Mohave, Golden Valley)"}
Timeframe: ${timeframe || "current market"}
Key data/highlights: ${highlights || "use general market commentary"}

Write in Markdown:
- ## heading with area and timeframe
- 3-4 paragraphs covering market conditions, buyer and seller takeaways
- Keep it factual and helpful
- Brief closing note encouraging readers to contact Amy`,
  },

  newsletter: {
    maxTokens: 1500,
    buildPrompt: ({ topic, audience, highlights }) =>
      `Write a real estate newsletter for Amy Casanova to send to her client list.
Main topic: ${topic}
Audience: ${audience || "past clients, prospective buyers and sellers in Mohave County"}
Sections to include: ${highlights || "market update, tip of the month, featured listing teaser"}

Write in Markdown:
- Friendly, personal opening from Amy
- 2-4 content sections with ## headings
- Warm closing with contact placeholders ([PHONE] and [EMAIL])
- Keep it under 600 words`,
  },
};

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 10 requests per hour" },
      { status: 429 }
    );
  }

  let body: { type: ContentType; inputs: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, inputs } = body;

  if (!type || !PROMPTS[type]) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  const { maxTokens, buildPrompt } = PROMPTS[type];
  const prompt = buildPrompt(inputs || {});

  try {
    const response = await getAnthropic().messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: maxTokens,
      messages:   [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0]?.type === "text"
        ? response.content[0].text.trim()
        : "";

    if (!text) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    try {
      await getSupabase()
        .from("generated_content")
        .insert({ type, input_data: inputs, output_text: text });
    } catch (dbErr) {
      console.error("[Generate] Supabase insert failed:", dbErr);
    }

    return NextResponse.json({ text });
  } catch (err) {
    const isError = err instanceof Error;
    console.error("[Generate] Claude error:", isError ? err.message : String(err));
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
