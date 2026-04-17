export interface FubLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  searchCriteria: {
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    location?: string;
  };
}

export async function submitListingAlertLead(payload: FubLeadPayload): Promise<void> {
  const apiKey = process.env.FOLLOW_UP_BOSS_API_KEY;
  if (!apiKey) throw new Error("FOLLOW_UP_BOSS_API_KEY is not set");

  const criteriaLines = [
    payload.searchCriteria.location   && `Location: ${payload.searchCriteria.location}`,
    payload.searchCriteria.minPrice   && `Min Price: $${payload.searchCriteria.minPrice}`,
    payload.searchCriteria.maxPrice   && `Max Price: $${payload.searchCriteria.maxPrice}`,
    payload.searchCriteria.bedrooms   && `Bedrooms: ${payload.searchCriteria.bedrooms}+`,
  ].filter(Boolean).join("\n");

  const body = {
    source: "Listing Alert Signup",
    type: "Property Inquiry",
    person: {
      firstName: payload.firstName,
      lastName:  payload.lastName,
      emails:    [{ value: payload.email }],
      phones:    payload.phone ? [{ value: payload.phone }] : [],
    },
    note: criteriaLines || "No search criteria provided",
  };

  const credentials = Buffer.from(`${apiKey}:`).toString("base64");

  const res = await fetch("https://api.followupboss.com/v1/events", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Basic ${credentials}`,
      "X-System":      "ArizonaBuySell",
      "X-System-Key":  apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Follow Up Boss API error ${res.status}: ${text}`);
  }
}
