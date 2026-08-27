import { NextRequest, NextResponse } from "next/server";

// Daily lead-activity digest.
// Triggered by Vercel Cron (see vercel.json). Pulls leads active in the last
// 24h from IDX Broker and emails Amy one summary via Resend.

export const dynamic = "force-dynamic";
export const maxDuration = 60; // the IDX all-leads call can be slow; give it room

const IDX_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  accesskey: process.env.IDX_BROKER_API_KEY!,
  outputtype: "json",
};

const WINDOW_MS = 24 * 60 * 60 * 1000;
const TZ = "America/Phoenix";

type AnyRec = Record<string, unknown>;

function pick(o: AnyRec | undefined, keys: string[]): string | null {
  if (!o) return null;
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return null;
}

function parseDate(s: string | null): number | null {
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : t;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function idxJson(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: IDX_HEADERS });
  if (res.status === 204) return [];
  if (!res.ok) {
    console.error(`[digest] IDX ${url} -> ${res.status}`);
    return null;
  }
  return res.json().catch(() => null);
}

async function sendEmail(subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.DIGEST_TO_EMAIL;
  const from = process.env.DIGEST_FROM_EMAIL;
  if (!key || !to || !from) {
    console.error("[digest] missing RESEND_API_KEY / DIGEST_TO_EMAIL / DIGEST_FROM_EMAIL");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    console.error("[digest] Resend failed", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

function buildEmail(dateLabel: string, count: number, rowsHtml: string): string {
  const body =
    count === 0
      ? `<p style="color:#666;font-size:15px;margin:24px 0">No lead activity in the last 24 hours.</p>`
      : `<table style="width:100%;border-collapse:collapse">${rowsHtml}</table>`;
  return `<!doctype html><html><body style="margin:0;background:#F0EBE3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:28px 24px">
      <div style="background:#212529;color:#F0EBE3;border-radius:8px 8px 0 0;padding:22px 26px">
        <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#B8A898">Amy Casanova Real Estate</div>
        <div style="font-size:20px;font-weight:600;margin-top:4px">Daily Lead Activity</div>
        <div style="font-size:13px;color:#B8A898;margin-top:2px">${escapeHtml(dateLabel)} &nbsp;&middot;&nbsp; ${count} active ${count === 1 ? "lead" : "leads"}</div>
      </div>
      <div style="background:#fff;border-radius:0 0 8px 8px;padding:8px 26px 24px">
        ${body}
      </div>
      <p style="color:#9A917F;font-size:11px;text-align:center;margin-top:16px">
        Activity from IDX Broker over the last 24 hours. Reply STOP-DIGEST to Amy to turn this off.
      </p>
    </div>
  </body></html>`;
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nowMs = Date.now();
  const cutoff = nowMs - WINDOW_MS;

  // 1. All leads in one call.
  const leadsRaw = await idxJson("https://api.idxbroker.com/leads/lead");
  if (leadsRaw === null) {
    return NextResponse.json({ error: "IDX leads fetch failed" }, { status: 502 });
  }
  const leads: AnyRec[] = Array.isArray(leadsRaw)
    ? (leadsRaw as AnyRec[])
    : Array.isArray((leadsRaw as AnyRec).data)
    ? ((leadsRaw as AnyRec).data as AnyRec[])
    : (Object.values(leadsRaw as AnyRec).filter((v) => v && typeof v === "object") as AnyRec[]);

  // First-run visibility: log the shape so field names can be tuned if needed.
  if (leads[0]) console.log("[digest] sample lead keys:", Object.keys(leads[0]).join(","));

  // 2. Keep leads active in the last 24h.
  const active = leads
    .map((l) => ({ l, last: parseDate(pick(l, ["lastActivityDate", "lastActive"])) }))
    .filter((x) => x.last !== null && x.last >= cutoff)
    .sort((a, b) => (b.last as number) - (a.last as number));

  // 3. Per active lead, pull recent property/page views (best-effort).
  const rows: string[] = [];
  for (const { l, last } of active) {
    const id = pick(l, ["id", "leadID", "leadId"]);
    const name =
      [pick(l, ["firstName"]), pick(l, ["lastName"])].filter(Boolean).join(" ").trim() || "(no name)";
    const email = pick(l, ["email"]) ?? "";
    const lastType = pick(l, ["lastActivity", "lastActivityType"]) ?? "activity";
    const pages = pick(l, ["totalViewedIDXPages"]);
    const savedProps = pick(l, ["savedProperties"]) ?? "0";

    let viewed: string[] = [];
    if (id) {
      const traffic = await idxJson(`https://api.idxbroker.com/leads/traffic/${id}`);
      if (Array.isArray(traffic)) {
        if (traffic[0]) console.log("[digest] sample traffic keys:", Object.keys(traffic[0]).join(","));
        viewed = traffic
          .filter((t: AnyRec) => {
            const d = parseDate(pick(t, ["date", "datetime", "timestamp", "created", "activityDate"]));
            return d !== null && d >= cutoff;
          })
          .map(
            (t: AnyRec) =>
              pick(t, ["address", "streetName", "mlsNumber", "pageTitle", "url", "page", "detailsURL"]) ??
              "a listing"
          )
          .slice(0, 8);
      }
    }

    const when = last ? new Date(last).toLocaleString("en-US", { timeZone: TZ }) : "";
    const viewedHtml = viewed.length
      ? `<ul style="margin:6px 0 0;padding-left:18px;color:#333;font-size:14px">${viewed
          .map((v) => `<li>${escapeHtml(v)}</li>`)
          .join("")}</ul>`
      : `<div style="color:#777;font-size:13px;margin-top:4px">${
          pages ? `${escapeHtml(pages)} IDX pages viewed` : "Active on site"
        }</div>`;

    rows.push(`<tr><td style="padding:14px 0;border-bottom:1px solid #eee">
      <div style="font-weight:600;color:#111;font-size:15px">${escapeHtml(name)}${
      email
        ? ` <a href="mailto:${escapeHtml(email)}" style="font-weight:400;color:#A85A3C;text-decoration:none;font-size:13px">&middot; ${escapeHtml(email)}</a>`
        : ""
    }</div>
      <div style="color:#666;font-size:13px;margin-top:2px">Last active ${escapeHtml(when)} &middot; ${escapeHtml(
      lastType
    )}${savedProps !== "0" ? ` &middot; ${escapeHtml(savedProps)} saved` : ""}</div>
      ${viewedHtml}
    </td></tr>`);
  }

  const dateLabel = new Date(nowMs).toLocaleDateString("en-US", {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const html = buildEmail(dateLabel, active.length, rows.join(""));
  const emailSent = await sendEmail(
    `Daily lead activity — ${active.length} active ${active.length === 1 ? "lead" : "leads"}`,
    html
  );

  return NextResponse.json({ ok: true, activeLeads: active.length, emailSent });
}
