import { NextRequest, NextResponse } from "next/server";

const IDX_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  accesskey: process.env.IDX_BROKER_API_KEY!,
  outputtype: "json",
};

type Params = { params: Promise<{ leadId: string }> };

// ─── TEMP diagnostics for Year Built / range-field debugging ─────────────────
// Decode the application/x-www-form-urlencoded body into a readable map so we
// can confirm exactly which IDX param keys we sent (e.g. search[amin_yearBuilt]
// vs search[amax_yearBuilt]). Multi-valued keys (search[city][], etc.) collapse
// into arrays. Remove this helper + its call sites once the bug is fixed.
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

  // TEMP: log the search criteria IDX returned for each saved search so we can
  // see whether keys like amin_yearBuilt persisted as sent, got remapped by
  // IDX, or were silently dropped on storage. Strip out clearly noisy fields
  // to keep the log readable.
  console.log(
    "[IDX GET searches] leadId=%s storedCriteria=%s",
    leadId,
    JSON.stringify(searches.map((s: { id: string; searchName: string; search?: Record<string, unknown> }) => ({
      id: s.id,
      name: s.searchName,
      // Only the keys we actually set on the saved-search payload
      yearBuilt: { amin: s.search?.amin_yearBuilt, amax: s.search?.amax_yearBuilt },
      sqFt:      { amin: s.search?.amin_sqFt,      amax: s.search?.amax_sqFt },
      acres:     { amin: s.search?.amin_acres,     amax: s.search?.amax_acres },
      price:     { lp:   s.search?.lp,             hp:   s.search?.hp },
      assocFee:  { amax: s.search?.amax_associationFee },
    })))
  );

  return NextResponse.json({ searches });
}

// PUT — create a new saved search
export async function PUT(req: NextRequest, { params }: Params) {
  const { leadId } = await params;
  const body = await req.text();

  // TEMP: log + echo the decoded IDX query for range-field debugging.
  const debugIdxQuery = decodeIdxBody(body);
  console.log("[IDX PUT search] leadId=%s query=%s", leadId, JSON.stringify(debugIdxQuery));

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
    return NextResponse.json(
      { error: text || "Failed to create search", _debug_idxQuery: debugIdxQuery, _debug_idxQueryString: body },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({
    ok: true,
    newID: data.newID,
    _debug_idxQuery: debugIdxQuery,
    _debug_idxQueryString: body,
  });
}
