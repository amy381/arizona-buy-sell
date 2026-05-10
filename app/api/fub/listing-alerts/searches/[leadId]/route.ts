import { NextRequest, NextResponse } from "next/server";

const IDX_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  accesskey: process.env.IDX_BROKER_API_KEY!,
  outputtype: "json",
};

type Params = { params: Promise<{ leadId: string }> };

// GET — list saved searches for a lead
export async function GET(_req: NextRequest, { params }: Params) {
  const { leadId } = await params;

  const res = await fetch(
    `https://api.idxbroker.com/leads/search/${leadId}`,
    { headers: IDX_HEADERS }
  );

  if (res.status === 204) {
    return NextResponse.json({ searches: [] });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch searches" }, { status: res.status });
  }

  const data = await res.json();
  const searches = Array.isArray(data.searchInformation)
    ? data.searchInformation
    : [];

  return NextResponse.json({ searches });
}

// PUT — create a new saved search
export async function PUT(req: NextRequest, { params }: Params) {
  const { leadId } = await params;
  const body = await req.text();

  const res = await fetch(
    `https://api.idxbroker.com/leads/search/${leadId}`,
    {
      method: "PUT",
      headers: IDX_HEADERS,
      body,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text || "Failed to create search" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ ok: true, newID: data.newID });
}
