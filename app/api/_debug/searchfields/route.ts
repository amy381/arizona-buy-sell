import { NextResponse } from "next/server";

// TEMPORARY diagnostic route — proxies IDX Broker's /mls/searchfields/c090
// so we can inspect the live field list (Realty Candy just added a new
// HOA/Association field). Preview-branch only, not intended to reach main.
export async function GET() {
  const apiKey = process.env.IDX_BROKER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "IDX_BROKER_API_KEY not set" }, { status: 500 });
  }

  const res = await fetch("https://api.idxbroker.com/mls/searchfields/c090", {
    headers: {
      accesskey: apiKey,
      outputtype: "json",
    },
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
