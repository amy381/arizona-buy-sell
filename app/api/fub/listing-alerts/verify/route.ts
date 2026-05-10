import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const IDX_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  accesskey: process.env.IDX_BROKER_API_KEY!,
  outputtype: "json",
};

interface IDXLead {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

async function getAllIDXLeads(): Promise<IDXLead[]> {
  const res = await fetch("https://api.idxbroker.com/leads/lead", {
    headers: IDX_HEADERS,
  });
  if (!res.ok) throw new Error(`IDX leads fetch failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

export async function POST(req: NextRequest) {
  let body: { context?: string; signature?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { context, signature } = body;

  if (!context) {
    return NextResponse.json({ error: "Missing context" }, { status: 400 });
  }

  // Verify HMAC-SHA256 signature when secret is configured
  const secret = process.env.FUB_EMBEDDED_APP_SECRET;
  if (secret && signature) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(context)
      .digest("hex");
    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // Decode base64 context
  let decoded: Record<string, unknown>;
  try {
    decoded = JSON.parse(Buffer.from(context, "base64").toString("utf-8"));
  } catch {
    return NextResponse.json({ error: "Invalid context encoding" }, { status: 400 });
  }

  const email =
    (decoded.email as string) ||
    (decoded.emails as Array<{ value: string }>)?.[0]?.value;

  if (!email) {
    return NextResponse.json({ error: "No email in context" }, { status: 422 });
  }

  const nameParts = ((decoded.name as string) || "").split(" ");
  const firstName =
    (decoded.firstName as string) || nameParts[0] || "";
  const lastName =
    (decoded.lastName as string) || nameParts.slice(1).join(" ") || "";

  const contact = { firstName, lastName, email };

  // Look up existing IDX lead by email
  let leads: IDXLead[];
  try {
    leads = await getAllIDXLeads();
  } catch {
    return NextResponse.json({ error: "Failed to fetch IDX leads" }, { status: 502 });
  }

  const existing = leads.find(
    (l) => l.email?.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return NextResponse.json({ leadId: existing.id, contact });
  }

  // Create new IDX lead
  const createBody = new URLSearchParams();
  createBody.append("firstName", firstName);
  createBody.append("lastName", lastName || " "); // IDX requires lastName
  createBody.append("email", email);

  const createRes = await fetch("https://api.idxbroker.com/leads/lead", {
    method: "POST",
    headers: IDX_HEADERS,
    body: createBody.toString(),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    console.error("IDX create lead failed:", createRes.status, text);
    return NextResponse.json({ error: "Failed to create IDX lead" }, { status: 502 });
  }

  const created = await createRes.json();
  const leadId = String(created.newID || created.id || "");

  if (!leadId) {
    return NextResponse.json({ error: "No lead ID returned from IDX" }, { status: 502 });
  }

  return NextResponse.json({ leadId, contact });
}
