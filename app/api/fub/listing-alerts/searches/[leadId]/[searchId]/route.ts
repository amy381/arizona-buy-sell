import { NextRequest, NextResponse } from "next/server";

const IDX_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  accesskey: process.env.IDX_BROKER_API_KEY!,
  outputtype: "json",
};

type Params = { params: Promise<{ leadId: string; searchId: string }> };

// TEMP — see app/api/fub/listing-alerts/searches/[leadId]/route.ts for context.
function decodeIdxBody(raw: string): Record<string, string | string[]> {
  const params = new URLSearchParams(raw);
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of params.entries()) {
    if (k in out) {
      const existing = out[k];
      out[k] = Array.isArray(existing) ? [...existing, v] : [existing, v];
    } else {
      out[k] = v;
    }
  }
  return out;
}

// POST — update an existing saved search
export async function POST(req: NextRequest, { params }: Params) {
  const { leadId, searchId } = await params;
  const body = await req.text();

  // TEMP: log + echo the decoded IDX query.
  const debugIdxQuery = decodeIdxBody(body);
  console.log(
    "[IDX POST search] leadId=%s searchId=%s query=%s",
    leadId, searchId, JSON.stringify(debugIdxQuery)
  );

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
    return NextResponse.json(
      { error: text || "Failed to update search", _debug_idxQuery: debugIdxQuery, _debug_idxQueryString: body },
      { status: res.status }
    );
  }

  return NextResponse.json({
    ok: true,
    _debug_idxQuery: debugIdxQuery,
    _debug_idxQueryString: body,
  });
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
