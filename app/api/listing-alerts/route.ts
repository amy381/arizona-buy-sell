import { NextRequest, NextResponse } from "next/server";
import { submitListingAlertLead, FubLeadPayload } from "@/lib/followupboss";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    minPrice,
    maxPrice,
    bedrooms,
    location,
  } = body as Record<string, string>;

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name, and email are required." },
      { status: 422 }
    );
  }

  const payload: FubLeadPayload = {
    firstName,
    lastName,
    email,
    phone: phone || "",
    searchCriteria: { minPrice, maxPrice, bedrooms, location },
  };

  try {
    await submitListingAlertLead(payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("FUB submission error:", err);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
