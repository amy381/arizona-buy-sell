import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

// ─── IDX helpers ──────────────────────────────────────────────────────────────

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

interface IDXLead {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Fetch ALL leads from IDX with a hard 5-second timeout.
// Only used as a fallback when the Supabase cache misses.
async function fetchAllIDXLeads(
  headers: Record<string, string>
): Promise<IDXLead[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const res = await fetch("https://api.idxbroker.com/leads/lead", {
      headers,
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "(unreadable)");
      console.error(`[verify] IDX leads fetch failed: ${res.status}`, body);
      return null;
    }
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    if ((err as Error)?.name === "AbortError") {
      console.warn("[verify] IDX leads fetch timed out after 5s");
    } else {
      console.error("[verify] IDX leads fetch error:", err);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Create a single new lead in IDX Broker. Creating is much faster than
// fetching all leads and is not subject to the 5-second timeout.
async function createIDXLead(
  headers: Record<string, string>,
  firstName: string,
  lastName: string,
  email: string
): Promise<string | null> {
  const body = new URLSearchParams();
  body.append("firstName", firstName);
  body.append("lastName", lastName || " ");
  body.append("email", email);

  const t = Date.now();
  console.log("[verify] starting IDX create lead", t);
  try {
    const res = await fetch("https://api.idxbroker.com/leads/lead", {
      method: "POST",
      headers,
      body: body.toString(),
    });
    console.log("[verify] IDX create lead complete", `${Date.now() - t}ms`, res.status);
    if (!res.ok) {
      const text = await res.text().catch(() => "(unreadable)");
      console.error(`[verify] IDX create lead failed: ${res.status}`, text);
      return null;
    }
    const created = await res.json();
    return String(created.newID || created.id || "") || null;
  } catch (err) {
    console.error("[verify] IDX create lead error:", err);
    return null;
  }
}

// ─── Supabase cache helpers ───────────────────────────────────────────────────

async function getCachedLeadId(email: string): Promise<string | null> {
  try {
    const { data, error } = await getSupabase()
      .from("idx_lead_map")
      .select("idx_lead_id")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (error) {
      console.error("[verify] Supabase lookup error:", error.message);
      return null;
    }
    return data?.idx_lead_id ?? null;
  } catch (err) {
    console.error("[verify] Supabase lookup threw:", err);
    return null;
  }
}

async function cacheLeadId(
  email: string,
  idx_lead_id: string,
  first_name: string,
  last_name: string
): Promise<void> {
  try {
    const { error } = await getSupabase()
      .from("idx_lead_map")
      .upsert({ email: email.toLowerCase(), idx_lead_id, first_name, last_name });
    if (error) console.error("[verify] Supabase upsert error:", error.message);
  } catch (err) {
    console.error("[verify] Supabase upsert threw:", err);
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

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

  // Decode FUB base64 context (handle URL-safe base64)
  let decoded: Record<string, unknown>;
  try {
    const normalized = context.replace(/-/g, "+").replace(/_/g, "/");
    decoded = JSON.parse(Buffer.from(normalized, "base64").toString("utf-8"));
    console.log("[verify] decoded context:", JSON.stringify(decoded));
  } catch {
    return NextResponse.json({ error: "Invalid context encoding" }, { status: 400 });
  }

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

  // ── 1. Check Supabase cache first (fast, <100ms) ──────────────────────────
  console.log("[verify] checking Supabase cache");
  const cached = await getCachedLeadId(email);
  if (cached) {
    console.log("[verify] cache hit, leadId:", cached);
    return NextResponse.json({ leadId: cached, contact });
  }
  console.log("[verify] cache miss, falling back to IDX Broker");

  // ── 2. Build IDX headers ──────────────────────────────────────────────────
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

  // ── 3. Try to find the lead in IDX (5s timeout) ───────────────────────────
  const t0 = Date.now();
  console.log("[verify] starting IDX leads fetch", t0);
  const leads = await fetchAllIDXLeads(idxHeaders);
  console.log(
    "[verify] IDX leads fetch done",
    `${Date.now() - t0}ms`,
    leads === null ? "timed out / failed" : `${leads.length} leads`
  );

  if (leads !== null) {
    const existing = leads.find(
      (l) => l.email?.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      console.log("[verify] found in IDX, caching leadId:", existing.id);
      await cacheLeadId(email, existing.id, firstName, lastName);
      return NextResponse.json({ leadId: existing.id, contact });
    }
  }

  // ── 4. Lead not found — create it in IDX ─────────────────────────────────
  console.log("[verify] lead not in IDX, creating new lead");
  const newLeadId = await createIDXLead(idxHeaders, firstName, lastName, email);

  if (!newLeadId) {
    return NextResponse.json(
      { error: "IDX Broker is slow right now — please try again in a moment." },
      { status: 503 }
    );
  }

  console.log("[verify] created new lead, caching leadId:", newLeadId);
  await cacheLeadId(email, newLeadId, firstName, lastName);
  return NextResponse.json({ leadId: newLeadId, contact });
}
