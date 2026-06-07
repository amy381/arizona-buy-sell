import { NextRequest, NextResponse } from "next/server";

const IDX_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  accesskey: process.env.IDX_BROKER_API_KEY!,
  outputtype: "json",
};

type Params = { params: Promise<{ leadId: string; searchId: string }> };

// POST — update an existing saved search
export async function POST(req: NextRequest, { params }: Params) {
  const { leadId, searchId } = await params;
  const body = await req.text();

  const res = await fetch(
    `https://api.idxbroker.com/leads/search/${leadId}/${searchId}`,
    {
      method: "POST",
      headers: IDX_HEADERS,
      body,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text || "Failed to update search" }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — delete a saved search
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { leadId, searchId } = await params;

  const res = await fetch(
    `https://api.idxbroker.com/leads/search/${leadId}/${searchId}`,
    {
      method: "DELETE",
      headers: IDX_HEADERS,
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to delete search" }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
