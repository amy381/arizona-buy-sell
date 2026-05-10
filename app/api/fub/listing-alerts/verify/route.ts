import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface IDXLead {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

function getIdxHeaders() {
  const apiKey = process.env.IDX_BROKER_API_KEY;
  console.log(
    "[verify] IDX_BROKER_API_KEY:",
    apiKey ? `${apiKey.slice(0, 5)}… (set)` : "MISSING"
  );
  if (!apiKey) throw new Error("IDX_BROKER_API_KEY env var is not set");
  return {
    "Content-Type": "application/x-www-form-urlencoded",
    accesskey: apiKey,
    outputtype: "json",
  };
}

function idxFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, options);
}

async function getAllIDXLeads(headers: Record<string, string>): Promise<IDXLead[]> {
  const res = await idxFetch("https://api.idxbroker.com/leads/lead", {
    headers,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable body)");
    console.error(
      `[verify] IDX leads fetch failed: status=${res.status}`,
      body
    );
    throw new Error(`IDX leads fetch failed: ${res.status}`);
  }

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

  // Decode base64 context (handle URL-safe base64 from FUB)
  let decoded: Record<string, unknown>;
  try {
    const normalized = context.replace(/-/g, "+").replace(/_/g, "/");
    decoded = JSON.parse(Buffer.from(normalized, "base64").toString("utf-8"));
    console.log("[verify] decoded context:", JSON.stringify(decoded));
  } catch {
    return NextResponse.json({ error: "Invalid context encoding" }, { status: 400 });
  }

  // FUB context shape: { context: "person", person: { firstName, lastName, emails: [{value}] } }
  const person = (decoded.person as Record<string, unknown>) ?? decoded;

  const email =
    ((person.emails as Array<{ value: string }>)?.[0]?.value) ||
    (person.email as string) ||
    (decoded.email as string);

  console.log("[verify] extracted email:", email);

  if (!email) {
    return NextResponse.json({ error: "No email in context" }, { status: 422 });
  }

  const firstName = (person.firstName as string) || "";
  const lastName = (person.lastName as string) || "";
  const contact = { firstName, lastName, email };

  // Build headers per-request so env var is read at call time
  let idxHeaders: Record<string, string>;
  try {
    idxHeaders = getIdxHeaders();
  } catch (err) {
    console.error("[verify] header error:", err);
    return NextResponse.json(
      { error: "Server misconfiguration: missing API key" },
      { status: 500 }
    );
  }

  // Look up existing IDX lead by email
  let leads: IDXLead[];
  try {
    leads = await getAllIDXLeads(idxHeaders);
  } catch (err) {
    console.error("[verify] getAllIDXLeads error:", err);
    return NextResponse.json({ error: "Failed to fetch IDX leads" }, { status: 502 });
  }

  const existing = leads.find(
    (l) => l.email?.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    console.log("[verify] found existing lead:", existing.id);
    return NextResponse.json({ leadId: existing.id, contact });
  }

  // Create new IDX lead
  console.log("[verify] creating new IDX lead for:", email);
  const createBody = new URLSearchParams();
  createBody.append("firstName", firstName);
  createBody.append("lastName", lastName || " ");
  createBody.append("email", email);

  let createRes: Response;
  try {
    createRes = await idxFetch("https://api.idxbroker.com/leads/lead", {
      method: "POST",
      headers: idxHeaders,
      body: createBody.toString(),
    });
  } catch (err) {
    console.error("[verify] IDX create lead fetch error:", err);
    return NextResponse.json({ error: "Failed to create IDX lead" }, { status: 502 });
  }

  if (!createRes.ok) {
    const text = await createRes.text().catch(() => "(unreadable)");
    console.error(
      `[verify] IDX create lead failed: status=${createRes.status}`,
      text
    );
    return NextResponse.json({ error: "Failed to create IDX lead" }, { status: 502 });
  }

  const created = await createRes.json();
  const leadId = String(created.newID || created.id || "");
  console.log("[verify] created lead:", leadId);

  if (!leadId) {
    return NextResponse.json({ error: "No lead ID returned from IDX" }, { status: 502 });
  }

  return NextResponse.json({ leadId, contact });
}
