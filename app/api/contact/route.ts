import { NextRequest, NextResponse } from "next/server";
import { submitFubEvent } from "@/lib/followupboss";

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { firstName, lastName, email, phone, inquiryType, message } =
    body as Record<string, string>;

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name, and email are required." },
      { status: 422 }
    );
  }

  try {
    await submitFubEvent({
      source:    "Contact Form",
      type:      inquiryType || "General Inquiry",
      firstName,
      lastName,
      email,
      phone:     phone || "",
      note:      message || "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form FUB error:", err);
    return NextResponse.json({ error: "Failed to submit." }, { status: 500 });
  }
}
