import { NextRequest, NextResponse } from "next/server";

const IDX_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  accesskey: process.env.IDX_BROKER_API_KEY!,
  outputtype: "json",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;

  const [leadRes, trafficRes, propertyRes] = await Promise.all([
    fetch(`https://api.idxbroker.com/leads/lead/${leadId}`, {
      headers: IDX_HEADERS,
    }),
    fetch(`https://api.idxbroker.com/leads/traffic/${leadId}`, {
      headers: IDX_HEADERS,
    }),
    fetch(`https://api.idxbroker.com/leads/property/${leadId}`, {
      headers: IDX_HEADERS,
    }),
  ]);

  if (!leadRes.ok) {
    return NextResponse.json(
      { error: `IDX lead fetch failed: ${leadRes.status}` },
      { status: 502 }
    );
  }

  const lead = await leadRes.json();

  const traffic =
    trafficRes.status === 204
      ? []
      : trafficRes.ok
      ? await trafficRes.json().catch(() => [])
      : [];

  const properties =
    propertyRes.status === 204
      ? []
      : propertyRes.ok
      ? await propertyRes.json().catch(() => [])
      : [];

  return NextResponse.json({
    summary: {
      lastActivityDate: lead.lastActivityDate ?? null,
      lastActivity: lead.lastActivity ?? null,
      totalViewedIDXPages: Number(lead.totalViewedIDXPages ?? 0),
      activityScores: lead.activityScores ?? "0",
      savedProperties: Number(lead.savedProperties ?? 0),
      savedSearches: Number(lead.savedSearches ?? 0),
    },
    traffic: Array.isArray(traffic) ? traffic : [],
    properties: Array.isArray(properties) ? properties : [],
  });
}
