import { NextRequest, NextResponse } from "next/server";
import { submitFubEvent } from "@/lib/followupboss";

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, propertyAddress } = body as Record<string, string>;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 422 }
    );
  }

  const [firstName, ...rest] = name.trim().split(" ");
  const lastName = rest.join(" ") || "";

  try {
    await submitFubEvent({
      source:    "Home Value Request",
      type:      "Seller Inquiry",
      firstName,
      lastName,
      email,
      phone:     phone || "",
      note:      propertyAddress ? `Property: ${propertyAddress}` : "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Home value FUB error:", err);
    return NextResponse.json({ error: "Failed to submit." }, { status: 500 });
  }
}
