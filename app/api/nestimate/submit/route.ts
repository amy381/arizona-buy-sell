import { NextRequest, NextResponse } from "next/server";
import { getSupabase }     from "@/lib/supabase";
import { submitFubEvent }  from "@/lib/followupboss";
import { Resend }          from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      address,
      city,
      state,
      zip,
      owner_first,
      owner_last,
      phone,
      email,
      intent_signal,
    } = body;

    // ── Step 1: Duplicate check ──────────────────────────────────────────────
    const { data: existing } = await getSupabase()
      .from("nestimate_submissions")
      .select("id")
      .ilike("address", `%${address}%`)
      .limit(1);

    const is_duplicate = !!(existing && existing.length > 0);

    // ── Step 2: Save to Supabase ─────────────────────────────────────────────
    const submitted_at = new Date().toISOString();

    const { data: inserted, error: insertError } = await getSupabase()
      .from("nestimate_submissions")
      .insert({
        address,
        city,
        state,
        zip,
        owner_first,
        owner_last,
        phone,
        email,
        intent_signal,
        submitted_at,
        forwarded_to_fub: false,
        is_duplicate,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[Nestimate] Supabase insert error:", insertError);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    const recordId = inserted?.id;

    const isHighPriority = intent_signal === "Ready to sell now";

    const fubNote =
      `Nestimate Request — Address: ${address}, ${city}, ${state} ${zip}. ` +
      `Intent: ${intent_signal}. Submitted: ${submitted_at}.` +
      (is_duplicate   ? " NOTE: Duplicate address submission." : "") +
      (isHighPriority ? " ⚠️ HIGH PRIORITY — Ready to sell now." : "");

    // ── Step 3: Post to Follow Up Boss ───────────────────────────────────────
    let fubSucceeded = false;
    try {
      await submitFubEvent({
        source:    "Nestimate — Home Value Request",
        type:      isHighPriority ? "Seller Inquiry" : "General Inquiry",
        firstName: owner_first,
        lastName:  owner_last,
        email,
        phone,
        note:      fubNote,
      });
      fubSucceeded = true;
    } catch (fubErr) {
      console.error("[Nestimate] FUB post failed (non-fatal):", fubErr);
    }

    if (fubSucceeded && recordId) {
      await getSupabase()
        .from("nestimate_submissions")
        .update({ forwarded_to_fub: true })
        .eq("id", recordId);
    }

    // ── Step 4: Send email notification to Amy ───────────────────────────────
    try {
      await resend.emails.send({
        from:    "Nestimate <noreply@desert-legacy.com>",
        to:      "amy@desert-legacy.com",
        subject: `New Nestimate Request — ${address}, ${city}`,
        text: [
          "New Nestimate submission received.",
          "",
          `Name: ${owner_first} ${owner_last}`,
          `Phone: ${phone}`,
          `Email: ${email}`,
          `Address: ${address}, ${city}, ${state} ${zip}`,
          `Intent: ${intent_signal}`,
          `Submitted: ${submitted_at}`,
          "",
          isHighPriority ? "⚠️ HIGH PRIORITY — This person is ready to sell now." : "",
          is_duplicate   ? "Note: This address has been submitted before." : "",
        ]
          .filter(line => line !== undefined)
          .join("\n")
          .trim(),
      });
    } catch (emailErr) {
      console.error("[Nestimate] Resend email failed (non-fatal):", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Nestimate] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
