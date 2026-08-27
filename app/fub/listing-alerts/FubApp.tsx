"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppTab = "alerts" | "activity";

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
}

interface IDXSearchCriteria {
  idxID?: string;
  pt?: string;
  lp?: string;
  hp?: string;
  city?: string | string[];
  ccz?: string;
  bd?: string;
  tb?: string;
  amin_sqFt?: string;
  amax_sqFt?: string;
  amin_acres?: string;
  amax_acres?: string;
  srt?: string;
  amin_yearBuilt?: string;
  amax_yearBuilt?: string;
  a_propSubType?: string | string[];
  a_status?: string | string[];
  a_associationYN?: string;
  a_fencing?: string | string[];
  a_parkingFeatures?: string | string[];
  a_cooling?: string | string[];
}

interface IDXSearch {
  id: string;
  searchName: string;
  search: IDXSearchCriteria;
  receiveUpdates: "y" | "n";
  created: string;
  lastEdited: string | null;
  resultsURL?: string;
}

interface FormValues {
  searchName: string;
  cities: string[];
  pt: string;
  subtypes: string[];
  status: string[];
  lp: string;
  hp: string;
  bd: string;
  tb: string;
  sqft: string;
  maxSqft: string;
  acres: string;
  maxAcres: string;
  minYearBuilt: string;
  maxYearBuilt: string;
  maxAssocFee: string;
  fencing: string[];
  parkingFeatures: string[];
  cooling: string[];
  receiveUpdates: boolean;
}

interface ActivitySummary {
  lastActivityDate: string | null;
  lastActivity: string | null;
  totalViewedIDXPages: number;
  activityScores: string;
  savedProperties: number;
  savedSearches: number;
}

interface TrafficEntry {
  date?: string;
  page?: string;
  ip?: string;
  [key: string]: unknown;
}

interface PropertyEntry {
  mlsNumber?: string;
  address?: string;
  listingID?: string;
  idxPropType?: string;
  [key: string]: unknown;
}

interface ActivityData {
  summary: ActivitySummary;
  traffic: TrafficEntry[];
  properties: PropertyEntry[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CITIES = [
  { id: "24281", name: "Kingman" },
  { id: "6295", name: "Bullhead City" },
  { id: "18350", name: "Golden Valley" },
  { id: "16601", name: "Fort Mohave" },
];

const PROP_TYPES = [
  { value: "1", label: "Residential" },
  { value: "7", label: "Land" },
  { value: "4", label: "Commercial" },
  { value: "3", label: "Commercial Lease" },
  { value: "5", label: "Farm/Ranch" },
  { value: "6", label: "Multi-Family" },
];

const SUBTYPES_BY_TYPE: Record<string, string[]> = {
  "1": ["Single Family Residence", "Condominium", "Manufactured Home", "Townhouse"],
  "7": ["Residential Lot", "Commercial/Industrial", "Farm/Ranch"],
};

const STATUS_OPTIONS = ["Active", "Pending", "Closed"];

const BD_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const BA_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const FENCING_OPTIONS = [
  "Back Yard",
  "Block",
  "Chain Link",
  "Front Yard",
  "None",
  "Privacy",
  "Stucco Wall",
  "Vinyl",
  "Wire",
  "Wood",
  "Wrought Iron",
];

const PARKING_OPTIONS = [
  "Air Conditioned Garage",
  "Attached",
  "Carport",
  "Common",
  "Detached",
  "Drive Through",
  "Electric Vehicle Charging Station(s)",
  "Finished",
  "Garage",
  "Garage Door Opener",
  "None",
  "RV/Access Parking",
  "RV Garage",
  "Storage",
];

const COOLING_OPTIONS = [
  "Central Air",
  "Ductless",
  "Electric",
  "Evaporative/Swamp",
  "Evaporative Cooling",
  "Heat Pump",
  "Multi Units",
  "None",
  "Wall/Window Unit(s)",
];

// IDX's Association Yes/No filter is the a_associationYN field: "yes" = has HOA,
// "no" = no HOA. (NOT amax_associationFee — that's the fee field and ignores a
// yes/no value. Confirmed against the c090 advanced-search URL.)
const HOA_OPTIONS = [
  { value: "", label: "Any" },
  { value: "yes", label: "Has HOA" },
  { value: "no", label: "No HOA" },
];

const DEFAULT_FORM: FormValues = {
  searchName: "",
  cities: [],
  pt: "1",
  subtypes: [],
  status: ["Active"],
  lp: "",
  hp: "",
  bd: "0",
  tb: "0",
  sqft: "",
  maxSqft: "",
  acres: "",
  maxAcres: "",
  minYearBuilt: "",
  maxYearBuilt: "",
  maxAssocFee: "",
  fencing: [],
  parkingFeatures: [],
  cooling: [],
  receiveUpdates: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSummary(s: IDXSearchCriteria): string {
  const parts: string[] = [];

  const cityArr = Array.isArray(s.city)
    ? s.city
    : s.city
    ? [s.city]
    : [];
  if (cityArr.length > 0) {
    const names = cityArr.map(
      (id) => CITIES.find((c) => c.id === id)?.name ?? id
    );
    parts.push(names.join(", "));
  }

  if (s.lp || s.hp) {
    const lo = s.lp
      ? `$${(parseInt(s.lp) / 1000).toFixed(0)}k`
      : "Any";
    const hi = s.hp
      ? `$${(parseInt(s.hp) / 1000).toFixed(0)}k`
      : "Any";
    parts.push(`${lo}–${hi}`);
  }

  if (s.bd && s.bd !== "0") parts.push(`${s.bd}+ bd`);
  if (s.tb && s.tb !== "0") parts.push(`${s.tb}+ ba`);
  if (s.amin_sqFt) parts.push(`${parseInt(s.amin_sqFt).toLocaleString()}+ sqft`);

  const typeLabel =
    PROP_TYPES.find((p) => p.value === s.pt)?.label ?? "";
  if (typeLabel && typeLabel !== "Residential") parts.push(typeLabel);

  return parts.join(" · ") || "All listings";
}

function searchToForm(s: IDXSearch): FormValues {
  const src = s.search ?? {};
  const cities = Array.isArray(src.city)
    ? src.city
    : src.city
    ? [src.city]
    : [];
  const subtypes = Array.isArray(src.a_propSubType)
    ? src.a_propSubType
    : src.a_propSubType
    ? [src.a_propSubType]
    : [];
  const status = Array.isArray(src.a_status)
    ? src.a_status
    : src.a_status
    ? [src.a_status]
    : [];
  const fencing = Array.isArray(src.a_fencing)
    ? src.a_fencing
    : src.a_fencing
    ? [src.a_fencing]
    : [];
  const parkingFeatures = Array.isArray(src.a_parkingFeatures)
    ? src.a_parkingFeatures
    : src.a_parkingFeatures
    ? [src.a_parkingFeatures]
    : [];
  const cooling = Array.isArray(src.a_cooling)
    ? src.a_cooling
    : src.a_cooling
    ? [src.a_cooling]
    : [];

  return {
    searchName: s.searchName,
    cities,
    pt: src.pt ?? "1",
    subtypes,
    status,
    lp: src.lp ?? "",
    hp: src.hp ?? "",
    bd: src.bd ?? "0",
    tb: src.tb ?? "0",
    sqft: src.amin_sqFt ?? "",
    maxSqft: src.amax_sqFt ?? "",
    acres: src.amin_acres ?? "",
    maxAcres: src.amax_acres ?? "",
    minYearBuilt: src.amin_yearBuilt ?? "",
    maxYearBuilt: src.amax_yearBuilt ?? "",
    maxAssocFee: src.a_associationYN ?? "",
    fencing,
    parkingFeatures,
    cooling,
    receiveUpdates: s.receiveUpdates !== "n",
  };
}

// ─── Single source of truth for active IDX filter params ──────────────────────
// collectIdxParams returns one entry per active FILTER — what the lead will
// see narrowed to. Envelope concerns (which MLS, which page of the IDX site,
// what sort order to render in) are NOT filters and live in each adapter:
//
//   • buildPayload (saved-search criteria for PUT /leads/search/{leadId}):
//     emits filters only. The leadId path already binds the search to the
//     account's MLS, and sort order is a results-page concern, not stored
//     criteria.
//   • buildResultsURL (the public preview link): prepends the envelope
//     keys page=listings, idxID=c090, srt=newest before iterating filters.
//
// Both adapters iterate the SAME collectIdxParams output for the actual
// filter set, so adding a filter to one path without the other is
// structurally impossible. The dev-only parity guard at the bottom of this
// block catches anyone who tries to bypass it.
//
// Param-name mapping confirmed against IDX Broker's /mls/searchfields/c090
// endpoint on 2026-06-06. The results-URL convention strips only the
// `search[...]` wrapper from the API form (verified by IDX's URL parameter
// docs; range/array fields use the same camelCase names in both).

type IdxParam = { key: string; value: string; array?: boolean };

function collectIdxParams(form: FormValues): IdxParam[] {
  const out: IdxParam[] = [];

  if (form.cities.length > 0) {
    out.push({ key: "ccz", value: "city" });
    form.cities.forEach((id) =>
      out.push({ key: "city", value: id, array: true })
    );
  }
  if (form.pt) out.push({ key: "pt", value: form.pt });

  form.subtypes.forEach((v) =>
    out.push({ key: "a_propSubType", value: v, array: true })
  );
  form.status.forEach((v) =>
    out.push({ key: "a_status", value: v, array: true })
  );

  if (form.lp)         out.push({ key: "lp", value: form.lp });
  if (form.hp)         out.push({ key: "hp", value: form.hp });
  if (form.bd !== "0") out.push({ key: "bd", value: form.bd });
  if (form.tb !== "0") out.push({ key: "tb", value: form.tb });

  if (form.sqft)         out.push({ key: "amin_sqFt",          value: form.sqft });
  if (form.maxSqft)      out.push({ key: "amax_sqFt",          value: form.maxSqft });
  if (form.acres)        out.push({ key: "amin_acres",         value: form.acres });
  if (form.maxAcres)     out.push({ key: "amax_acres",         value: form.maxAcres });
  if (form.minYearBuilt) out.push({ key: "amin_yearBuilt",     value: form.minYearBuilt });
  if (form.maxYearBuilt) out.push({ key: "amax_yearBuilt",     value: form.maxYearBuilt });
  if (form.maxAssocFee !== "")
    out.push({ key: "a_associationYN", value: form.maxAssocFee });

  form.fencing.forEach((v) =>
    out.push({ key: "a_fencing", value: v, array: true })
  );
  form.parkingFeatures.forEach((v) =>
    out.push({ key: "a_parkingFeatures", value: v, array: true })
  );
  form.cooling.forEach((v) =>
    out.push({ key: "a_cooling", value: v, array: true })
  );

  return out;
}

const wrapApiKey = (key: string, array: boolean) =>
  array ? `search[${key}][]` : `search[${key}]`;

const wrapUrlKey = (key: string, array: boolean) =>
  array ? `${key}[]` : key;

function buildPayload(form: FormValues): string {
  const body = new URLSearchParams();
  body.append("searchName", form.searchName.trim());
  body.append("receiveUpdates", form.receiveUpdates ? "y" : "n");
  for (const p of collectIdxParams(form)) {
    body.append(wrapApiKey(p.key, !!p.array), p.value);
  }
  return body.toString();
}

function buildResultsURL(form: FormValues): string {
  const params = new URLSearchParams();
  // URL-only envelope: page tells IDX which view to render, idxID picks the
  // MLS dataset, srt sets the on-page sort order. None of these belong in the
  // stored saved-search criteria.
  params.append("page",  "listings");
  params.append("idxID", "c090");
  params.append("srt",   "newest");
  for (const p of collectIdxParams(form)) {
    params.append(wrapUrlKey(p.key, !!p.array), p.value);
  }
  return `https://search.arizonabuyandsell.com/idx/results?${params.toString()}`;
}

// ─── Parity guard ─────────────────────────────────────────────────────────────
// Module-load assertion (dev only). Renders a fully-populated sample form
// through both buildPayload and buildResultsURL and compares the LOGICAL key
// sets (after stripping the API's `search[...]` wrapper and either path's
// `[]` repeat suffix). If they ever diverge — someone hand-edited one renderer
// to special-case a key, or added a new filter to only one path — the dev
// server fails on first load with a clear message. Cheap; runs once per HMR.
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  const SAMPLE_FORM: FormValues = {
    searchName: "Parity Self-Check",
    cities: ["24281"],
    pt: "1",
    subtypes: ["Single Family Residence"],
    status: ["Active"],
    lp: "200000", hp: "500000",
    bd: "3", tb: "2",
    sqft: "1500", maxSqft: "4000",
    acres: "0.25", maxAcres: "2",
    minYearBuilt: "2000", maxYearBuilt: "2024",
    maxAssocFee: "200",
    fencing: ["Block"],
    parkingFeatures: ["Garage"],
    cooling: ["Central Air"],
    receiveUpdates: true,
  };

  const stripArray = (k: string) => k.replace(/\[\]$/, "");
  // Envelope keys — never part of the filter set, so the parity check
  // excludes them on both sides. If a key appears here it's intentionally
  // emitted by one adapter only (or by both, but as boilerplate, not a filter).
  const NON_FILTER_API = new Set(["searchName", "receiveUpdates"]);
  const NON_FILTER_URL = new Set(["page", "idxID", "srt"]);

  const fromApiKey = (k: string): string | null => {
    if (NON_FILTER_API.has(k)) return null;
    const m = k.match(/^search\[(.+?)\](\[\])?$/);
    return m ? m[1] : null;
  };
  const fromUrlKey = (k: string): string | null => {
    if (NON_FILTER_URL.has(k)) return null;
    return stripArray(k);
  };

  const collectedKeys = new Set(collectIdxParams(SAMPLE_FORM).map((p) => p.key));
  const apiKeys = new Set<string>();
  for (const [k] of new URLSearchParams(buildPayload(SAMPLE_FORM)).entries()) {
    const lk = fromApiKey(k);
    if (lk) apiKeys.add(lk);
  }
  const urlKeys = new Set<string>();
  const urlQuery = buildResultsURL(SAMPLE_FORM).split("?")[1] || "";
  for (const [k] of new URLSearchParams(urlQuery).entries()) {
    const lk = fromUrlKey(k);
    if (lk) urlKeys.add(lk);
  }

  const diff = (a: Set<string>, b: Set<string>) =>
    [...a].filter((k) => !b.has(k));
  const apiOnly      = diff(apiKeys, urlKeys);
  const urlOnly      = diff(urlKeys, apiKeys);
  const missingApi   = diff(collectedKeys, apiKeys);
  const missingUrl   = diff(collectedKeys, urlKeys);

  if (apiOnly.length || urlOnly.length || missingApi.length || missingUrl.length) {
    throw new Error(
      "[FUB listing-alerts] buildPayload / buildResultsURL filter drift:\n" +
      `  in API payload but not preview URL:    ${apiOnly.join(", ") || "(none)"}\n` +
      `  in preview URL but not API payload:    ${urlOnly.join(", ") || "(none)"}\n` +
      `  in collectIdxParams but missing API:   ${missingApi.join(", ") || "(none)"}\n` +
      `  in collectIdxParams but missing URL:   ${missingUrl.join(", ") || "(none)"}`
    );
  }
}

function formatActivityType(type: string | null): string {
  if (!type) return "Unknown";
  const map: Record<string, string> = {
    signUp: "Sign Up",
    login: "Login",
    propertyView: "Property View",
    savedSearch: "Saved Search",
    savedProperty: "Saved Property",
    emailUpdate: "Email Update",
  };
  return map[type] ?? type.replace(/([A-Z])/g, " $1").trim();
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function truncateUrl(url: string | undefined, max = 48): string {
  if (!url) return "—";
  try {
    const u = new URL(url);
    const path = u.pathname + u.search;
    return path.length > max ? path.slice(0, max) + "…" : path;
  } catch {
    return url.length > max ? url.slice(0, max) + "…" : url;
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  wrap: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 13,
    color: "#111827",
    background: "#fff",
    minHeight: "100vh",
    padding: "0 0 40px",
  } as React.CSSProperties,

  header: {
    padding: "14px 16px 12px",
    borderBottom: "1px solid #E5E7EB",
    background: "#F9FAFB",
  } as React.CSSProperties,

  name: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 2px",
  } as React.CSSProperties,

  email: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
  } as React.CSSProperties,

  badge: (connected: boolean) =>
    ({
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 11,
      fontWeight: 500,
      color: connected ? "#059669" : "#D97706",
      marginTop: 6,
    } as React.CSSProperties),

  dot: (connected: boolean) =>
    ({
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: connected ? "#10B981" : "#F59E0B",
      flexShrink: 0,
    } as React.CSSProperties),

  // Tab bar
  tabBar: {
    display: "flex",
    borderBottom: "1px solid #E5E7EB",
    background: "#fff",
    padding: "0 16px",
  } as React.CSSProperties,

  tab: (active: boolean) =>
    ({
      padding: "10px 0",
      marginRight: 20,
      fontSize: 13,
      fontWeight: active ? 600 : 400,
      color: active ? "#111827" : "#6B7280",
      borderBottom: active ? "2px solid #2563EB" : "2px solid transparent",
      background: "none",
      border: "none",
      cursor: "pointer",
      lineHeight: 1,
    } as React.CSSProperties),

  body: {
    padding: "16px",
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: ".07em",
    color: "#6B7280",
    marginBottom: 10,
  } as React.CSSProperties,

  card: {
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "12px 12px 10px",
    marginBottom: 8,
    background: "#fff",
  } as React.CSSProperties,

  cardName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 2px",
  } as React.CSSProperties,

  cardSummary: {
    fontSize: 12,
    color: "#6B7280",
    margin: "0 0 8px",
  } as React.CSSProperties,

  cardRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,

  toggleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
  } as React.CSSProperties,

  toggleLabel: {
    fontSize: 11,
    color: "#6B7280",
  } as React.CSSProperties,

  actions: {
    display: "flex",
    gap: 4,
  } as React.CSSProperties,

  iconBtn: {
    width: 28,
    height: 28,
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6B7280",
    padding: 0,
    fontSize: 12,
  } as React.CSSProperties,

  dangerBtn: {
    width: 28,
    height: 28,
    border: "1px solid #FECACA",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#EF4444",
    padding: 0,
    fontSize: 12,
  } as React.CSSProperties,

  confirmRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #FEE2E2",
  } as React.CSSProperties,

  confirmText: {
    fontSize: 11,
    color: "#991B1B",
    flex: 1,
  } as React.CSSProperties,

  createBtn: {
    width: "100%",
    padding: "10px 16px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  } as React.CSSProperties,

  emptyState: {
    textAlign: "center" as const,
    padding: "28px 0 20px",
    color: "#9CA3AF",
    fontSize: 13,
  } as React.CSSProperties,

  // Activity styles
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 16,
  } as React.CSSProperties,

  statCard: {
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "10px 12px",
  } as React.CSSProperties,

  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1,
    margin: "0 0 3px",
  } as React.CSSProperties,

  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    margin: 0,
  } as React.CSSProperties,

  lastActive: {
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 16,
  } as React.CSSProperties,

  lastActiveLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: ".07em",
    color: "#6B7280",
    margin: "0 0 3px",
  } as React.CSSProperties,

  lastActiveValue: {
    fontSize: 13,
    fontWeight: 500,
    color: "#111827",
    margin: 0,
  } as React.CSSProperties,

  trafficItem: {
    padding: "8px 0",
    borderBottom: "1px solid #F3F4F6",
  } as React.CSSProperties,

  trafficDate: {
    fontSize: 11,
    color: "#9CA3AF",
    margin: "0 0 2px",
  } as React.CSSProperties,

  trafficUrl: {
    fontSize: 12,
    color: "#2563EB",
    textDecoration: "none",
    margin: 0,
    wordBreak: "break-all" as const,
    display: "block",
  } as React.CSSProperties,

  propertyItem: {
    padding: "8px 0",
    borderBottom: "1px solid #F3F4F6",
  } as React.CSSProperties,

  propertyAddress: {
    fontSize: 12,
    fontWeight: 500,
    color: "#111827",
    margin: "0 0 2px",
  } as React.CSSProperties,

  propertyMeta: {
    fontSize: 11,
    color: "#6B7280",
    margin: 0,
  } as React.CSSProperties,

  activityEmptyState: {
    padding: "16px 0 8px",
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 1.5,
  } as React.CSSProperties,

  // Form styles
  formHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#F9FAFB",
  } as React.CSSProperties,

  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6B7280",
    padding: "2px 4px",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
  } as React.CSSProperties,

  formTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  } as React.CSSProperties,

  field: {
    marginBottom: 14,
  } as React.CSSProperties,

  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 4,
  } as React.CSSProperties,

  input: {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #D1D5DB",
    borderRadius: 6,
    fontSize: 13,
    color: "#111827",
    background: "#fff",
    boxSizing: "border-box" as const,
    outline: "none",
  } as React.CSSProperties,

  select: {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #D1D5DB",
    borderRadius: 6,
    fontSize: 13,
    color: "#111827",
    background: "#fff",
    boxSizing: "border-box" as const,
    outline: "none",
    cursor: "pointer",
  } as React.CSSProperties,

  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    cursor: "pointer",
  } as React.CSSProperties,

  checkLabel: {
    fontSize: 13,
    color: "#374151",
    userSelect: "none" as const,
  } as React.CSSProperties,

  priceRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  } as React.CSSProperties,

  halfRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  } as React.CSSProperties,

  toggle: (on: boolean) =>
    ({
      width: 32,
      height: 18,
      borderRadius: 9,
      background: on ? "#2563EB" : "#D1D5DB",
      position: "relative" as const,
      cursor: "pointer",
      border: "none",
      padding: 0,
      flexShrink: 0,
      transition: "background 150ms",
    } as React.CSSProperties),

  toggleThumb: (on: boolean) =>
    ({
      position: "absolute" as const,
      top: 2,
      left: on ? 14 : 2,
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "#fff",
      transition: "left 150ms",
      boxShadow: "0 1px 2px rgba(0,0,0,.2)",
    } as React.CSSProperties),

  resultsLink: {
    display: "block",
    fontSize: 12,
    color: "#2563EB",
    textDecoration: "none",
    marginBottom: 16,
    textAlign: "center" as const,
  } as React.CSSProperties,

  formActions: {
    display: "flex",
    gap: 8,
    marginTop: 20,
  } as React.CSSProperties,

  cancelBtn: {
    flex: 1,
    padding: "9px",
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    background: "#fff",
    color: "#374151",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  } as React.CSSProperties,

  saveBtn: (disabled: boolean) =>
    ({
      flex: 2,
      padding: "9px",
      border: "none",
      borderRadius: 8,
      background: disabled ? "#93C5FD" : "#2563EB",
      color: "#fff",
      fontSize: 13,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
    } as React.CSSProperties),

  errorBox: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 12,
    color: "#991B1B",
    marginBottom: 12,
  } as React.CSSProperties,

  divider: {
    height: 1,
    background: "#F3F4F6",
    margin: "14px 0",
  } as React.CSSProperties,

  collapseHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    userSelect: "none" as const,
    marginBottom: 4,
  } as React.CSSProperties,

  collapseToggleBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
    fontSize: 10,
    padding: 0,
    lineHeight: 1,
  } as React.CSSProperties,

  collapseSummary: {
    fontSize: 12,
    color: "#6B7280",
    margin: "0 0 2px",
    fontStyle: "italic" as const,
  } as React.CSSProperties,

  collapseContent: {
    paddingTop: 4,
  } as React.CSSProperties,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button style={S.toggle(on)} onClick={onToggle} aria-label="Toggle">
      <span style={S.toggleThumb(on)} />
    </button>
  );
}

function SearchCard({
  search,
  onEdit,
  onDelete,
  onToggleUpdates,
  confirmDeleteId,
  setConfirmDeleteId,
  deletingId,
}: {
  search: IDXSearch;
  onEdit: (s: IDXSearch) => void;
  onDelete: (id: string) => void;
  onToggleUpdates: (s: IDXSearch) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
  deletingId: string | null;
}) {
  const isConfirming = confirmDeleteId === search.id;
  const isDeleting = deletingId === search.id;

  return (
    <div style={S.card}>
      <p style={S.cardName}>{search.searchName}</p>
      <p style={S.cardSummary}>{buildSummary(search.search)}</p>

      <div style={S.cardRow}>
        <div
          style={S.toggleWrap}
          onClick={() => onToggleUpdates(search)}
          title="Toggle email updates"
        >
          <Toggle
            on={search.receiveUpdates === "y"}
            onToggle={() => onToggleUpdates(search)}
          />
          <span style={S.toggleLabel}>
            {search.receiveUpdates === "y" ? "Updates on" : "Updates off"}
          </span>
        </div>

        <div style={S.actions}>
          <button
            style={S.iconBtn}
            onClick={() => onEdit(search)}
            title="Edit"
            aria-label="Edit search"
          >
            ✎
          </button>
          <button
            style={S.dangerBtn}
            onClick={() => setConfirmDeleteId(search.id)}
            title="Delete"
            aria-label="Delete search"
          >
            ✕
          </button>
        </div>
      </div>

      {isConfirming && (
        <div style={S.confirmRow}>
          <span style={S.confirmText}>Delete this alert?</span>
          <button
            style={{
              ...S.cancelBtn,
              flex: "none",
              padding: "4px 10px",
              fontSize: 11,
            }}
            onClick={() => setConfirmDeleteId(null)}
          >
            Keep
          </button>
          <button
            style={{
              flex: "none",
              padding: "4px 10px",
              border: "none",
              borderRadius: 6,
              background: "#EF4444",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              opacity: isDeleting ? 0.6 : 1,
            }}
            onClick={() => onDelete(search.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────

function ActivityView({
  data,
  loading,
  error,
}: {
  data: ActivityData | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div
        style={{
          padding: "32px 16px",
          textAlign: "center",
          color: "#9CA3AF",
          fontSize: 13,
        }}
      >
        Loading activity…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={S.errorBox}>{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, traffic, properties } = data;

  const lastActiveText =
    summary.lastActivityDate
      ? `${formatDate(summary.lastActivityDate)} — ${formatActivityType(summary.lastActivity)}`
      : summary.lastActivity
      ? formatActivityType(summary.lastActivity)
      : "No activity yet";

  // Sort traffic newest first
  const sortedTraffic = [...traffic].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return (
    <div style={S.body}>
      {/* Last Active */}
      <div style={S.lastActive}>
        <p style={S.lastActiveLabel}>Last Active</p>
        <p style={S.lastActiveValue}>{lastActiveText}</p>
      </div>

      {/* Stats grid */}
      <div style={S.statGrid}>
        <div style={S.statCard}>
          <p style={S.statValue}>{summary.totalViewedIDXPages}</p>
          <p style={S.statLabel}>Pages Viewed</p>
        </div>
        <div style={S.statCard}>
          <p style={S.statValue}>{summary.savedProperties}</p>
          <p style={S.statLabel}>Saved Props</p>
        </div>
        <div style={S.statCard}>
          <p style={S.statValue}>{summary.savedSearches}</p>
          <p style={S.statLabel}>Saved Searches</p>
        </div>
        <div style={S.statCard}>
          <p style={S.statValue}>{summary.activityScores}</p>
          <p style={S.statLabel}>Activity Score</p>
        </div>
      </div>

      {/* Recent Activity */}
      <p style={{ ...S.sectionLabel, marginBottom: 4 }}>Recent Activity</p>
      {sortedTraffic.length === 0 ? (
        <p style={S.activityEmptyState}>
          No browsing activity recorded yet. Activity will appear here once
          the lead visits your IDX search pages.
        </p>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {sortedTraffic.slice(0, 20).map((entry, i) => (
            <div key={i} style={S.trafficItem}>
              <p style={S.trafficDate}>{formatDateTime(entry.date)}</p>
              {entry.page ? (
                <a
                  href={entry.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={S.trafficUrl}
                  title={entry.page}
                >
                  {truncateUrl(entry.page)}
                </a>
              ) : (
                <p style={{ ...S.trafficUrl, color: "#6B7280" }}>
                  Page visit
                </p>
              )}
            </div>
          ))}
          {sortedTraffic.length > 20 && (
            <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
              +{sortedTraffic.length - 20} more visits
            </p>
          )}
        </div>
      )}

      {/* Saved Properties */}
      <p style={{ ...S.sectionLabel, marginTop: 8, marginBottom: 4 }}>
        Saved Properties
      </p>
      {properties.length === 0 ? (
        <p style={S.activityEmptyState}>No saved properties yet.</p>
      ) : (
        <div>
          {properties.map((prop, i) => (
            <div key={i} style={S.propertyItem}>
              <p style={S.propertyAddress}>
                {(prop.address as string) ||
                  (prop.mlsNumber as string) ||
                  `Listing ${i + 1}`}
              </p>
              {prop.mlsNumber && (
                <p style={S.propertyMeta}>MLS# {prop.mlsNumber}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

function MainView({
  contact,
  leadId,
  searches,
  confirmDeleteId,
  deletingId,
  activeTab,
  onTabChange,
  onCreate,
  onEdit,
  onDelete,
  onConfirmDelete,
  onToggleUpdates,
  activityData,
  activityLoading,
  activityError,
}: {
  contact: Contact | null;
  leadId: string | null;
  searches: IDXSearch[];
  confirmDeleteId: string | null;
  deletingId: string | null;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onCreate: () => void;
  onEdit: (s: IDXSearch) => void;
  onDelete: (id: string) => void;
  onConfirmDelete: (id: string | null) => void;
  onToggleUpdates: (s: IDXSearch) => void;
  activityData: ActivityData | null;
  activityLoading: boolean;
  activityError: string | null;
}) {
  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={S.badge(!!leadId)}>
          <span style={S.dot(!!leadId)} />
          {leadId ? "Connected to IDX Broker" : "No IDX lead found"}
        </div>
      </div>

      {/* Tab bar */}
      <div style={S.tabBar}>
        <button
          style={S.tab(activeTab === "alerts")}
          onClick={() => onTabChange("alerts")}
        >
          Alerts
        </button>
        <button
          style={S.tab(activeTab === "activity")}
          onClick={() => onTabChange("activity")}
        >
          Activity
        </button>
      </div>

      {activeTab === "alerts" ? (
        <div style={S.body}>
          <p style={S.sectionLabel}>Saved Searches</p>

          {searches.length === 0 ? (
            <div style={S.emptyState}>
              No saved searches yet.
              <br />
              Create one to start sending alerts.
            </div>
          ) : (
            searches.map((s) => (
              <SearchCard
                key={s.id}
                search={s}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleUpdates={onToggleUpdates}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={onConfirmDelete}
                deletingId={deletingId}
              />
            ))
          )}

          {leadId && (
            <button style={S.createBtn} onClick={onCreate}>
              + Create Saved Search
            </button>
          )}
        </div>
      ) : (
        <ActivityView
          data={activityData}
          loading={activityLoading}
          error={activityError}
        />
      )}
    </div>
  );
}

// ─── Collapsible Multi-Select ─────────────────────────────────────────────────

function CollapsibleMultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  function toggle(val: string) {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    );
  }

  const summary =
    selected.length > 0 ? selected.join(", ") : "None selected";

  return (
    <div style={S.field}>
      <div style={S.collapseHeader} onClick={() => setOpen((o) => !o)}>
        <span style={S.label}>{label}</span>
        <button
          type="button"
          style={S.collapseToggleBtn}
          aria-label={open ? "Collapse" : "Expand"}
        >
          {open ? "▲" : "▼"}
        </button>
      </div>
      {!open && <p style={S.collapseSummary}>{summary}</p>}
      {open && (
        <div style={S.collapseContent}>
          {options.map((opt) => (
            <label key={opt} style={S.checkRow}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span style={S.checkLabel}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Range parsing / formatting ──────────────────────────────────────────────
// Single-box range input grammar:
//   "1300-1500"  →  range  (digits on BOTH sides of dash)
//   "1500+"      →  minimum only
//   "1500-"      →  maximum only (nothing after dash)
//   "1500"       →  exact (min === max)
//   ""           →  no filter
// Decimals are allowed (for acres). Spaces, commas, and dollar signs are
// stripped. Anything that doesn't match returns null, which the input renders
// as an invalid state — the form value is preserved at its last good parse.

type ParsedRange = { min: string; max: string };

const NUM = String.raw`(\d+(?:\.\d+)?)`;
const RE_RANGE    = new RegExp(`^${NUM}-${NUM}$`);
const RE_MIN_ONLY = new RegExp(`^${NUM}\\+$`);
const RE_MAX_ONLY = new RegExp(`^${NUM}-$`);
const RE_EXACT    = new RegExp(`^${NUM}$`);

function parseRangeInput(raw: string): ParsedRange | null {
  const s = raw.replace(/[\s,$]/g, "");
  if (s === "") return { min: "", max: "" };
  let m: RegExpMatchArray | null;
  if ((m = s.match(RE_RANGE)))    return { min: m[1], max: m[2] };
  if ((m = s.match(RE_MIN_ONLY))) return { min: m[1], max: "" };
  if ((m = s.match(RE_MAX_ONLY))) return { min: "", max: m[1] };
  if ((m = s.match(RE_EXACT)))    return { min: m[1], max: m[1] };
  return null;
}

function formatRangeForInput(min: string, max: string): string {
  if (!min && !max) return "";
  if (min && max && min === max) return min;
  if (min && max) return `${min}-${max}`;
  if (min) return `${min}+`;
  return `${max}-`;
}

// Price preview helper — shows the actual dollar amounts under the price input
// so the "in thousands" convention is unambiguous. Operates on the underlying
// stored values (lp/hp in dollars), not the input's thousands form.
function formatDollarsRange(lp: string, hp: string): string {
  if (!lp && !hp) return "";
  const fmt = (v: string) => "$" + Number(v).toLocaleString("en-US");
  if (lp && hp && lp === hp) return fmt(lp);
  if (lp && hp) return `${fmt(lp)}–${fmt(hp)}`;
  if (lp) return `${fmt(lp)}+`;
  return `up to ${fmt(hp)}`;
}

// ─── Single-box range input ──────────────────────────────────────────────────
// Drives two underlying state fields (min/max) from one user-visible textbox.
// On change: parse → if valid, propagate to parent; if invalid, hold the
// invalid string in local state and tint the border red without touching
// parent state. On parent-prop changes (e.g. searchToForm load), local state
// re-syncs.

function RangeInput({
  min,
  max,
  onChange,
  placeholder,
  preview,
}: {
  min: string;
  max: string;
  onChange: (next: ParsedRange) => void;
  placeholder?: string;
  preview?: string;
}) {
  const [local, setLocal] = useState<string>(() => formatRangeForInput(min, max));
  const [invalid, setInvalid] = useState(false);
  const propString = formatRangeForInput(min, max);

  // Sync from parent when the underlying min/max changes externally
  // (initial load, saved-search load, programmatic reset).
  useEffect(() => {
    setLocal(propString);
    setInvalid(false);
  }, [propString]);

  function handleChange(value: string) {
    setLocal(value);
    const parsed = parseRangeInput(value);
    if (parsed === null) {
      setInvalid(true);
      return; // keep parent state intact while user is still typing
    }
    setInvalid(false);
    onChange(parsed);
  }

  return (
    <>
      <input
        style={{
          ...S.input,
          ...(invalid ? { borderColor: "#DC2626", background: "#FEF2F2" } : {}),
        }}
        type="text"
        inputMode="decimal"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
      />
      {preview && (
        <p
          style={{
            fontSize: 11,
            color: "#6B7280",
            margin: "4px 0 0",
          }}
        >
          = {preview}
        </p>
      )}
    </>
  );
}

// ─── Form View ────────────────────────────────────────────────────────────────

function FormView({
  form,
  setForm,
  isEditing,
  saving,
  error,
  onSave,
  onCancel,
}: {
  form: FormValues;
  setForm: React.Dispatch<React.SetStateAction<FormValues>>;
  isEditing: boolean;
  saving: boolean;
  error: string | null;
  onSave: () => void;
  onCancel: () => void;
  leadId: string | null;
}) {
  const subtypeOptions = SUBTYPES_BY_TYPE[form.pt] ?? [];
  const nameRef = useRef<HTMLInputElement>(null);
  const [nameMissing, setNameMissing] = useState(false);

  function toggleCity(id: string) {
    setForm((f) => ({
      ...f,
      cities: f.cities.includes(id)
        ? f.cities.filter((c) => c !== id)
        : [...f.cities, id],
    }));
  }

  function toggleSubtype(name: string) {
    setForm((f) => ({
      ...f,
      subtypes: f.subtypes.includes(name)
        ? f.subtypes.filter((s) => s !== name)
        : [...f.subtypes, name],
    }));
  }

  return (
    <div style={S.wrap}>
      <div style={S.formHeader}>
        <button style={S.backBtn} onClick={onCancel} aria-label="Back">
          ←
        </button>
        <p style={S.formTitle}>
          {isEditing ? "Edit Alert" : "New Alert"}
        </p>
      </div>

      <div style={S.body}>
        {error && <div style={S.errorBox}>{error}</div>}

        {/* Search Name */}
        <div style={S.field}>
          <label style={S.label}>Alert Name</label>
          <input
            ref={nameRef}
            style={{
              ...S.input,
              ...(nameMissing ? { borderColor: "#c0392b", outline: "none" } : {}),
            }}
            type="text"
            value={form.searchName}
            onChange={(e) => {
              if (nameMissing) setNameMissing(false);
              setForm((f) => ({ ...f, searchName: e.target.value }));
            }}
            placeholder="e.g. Kingman Homes Under $400k"
          />
          {nameMissing && (
            <p style={{ color: "#c0392b", fontSize: 12, marginTop: 6 }}>
              Please name this alert before saving.
            </p>
          )}
        </div>

        {/* Cities */}
        <div style={S.field}>
          <label style={S.label}>Cities</label>
          {CITIES.map((c) => (
            <label key={c.id} style={S.checkRow}>
              <input
                type="checkbox"
                checked={form.cities.includes(c.id)}
                onChange={() => toggleCity(c.id)}
              />
              <span style={S.checkLabel}>{c.name}</span>
            </label>
          ))}
        </div>

        {/* Property Type */}
        <div style={S.field}>
          <label style={S.label}>Property Type</label>
          <select
            style={S.select}
            value={form.pt}
            onChange={(e) =>
              setForm((f) => ({ ...f, pt: e.target.value, subtypes: [] }))
            }
          >
            {PROP_TYPES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Property Subtype */}
        {subtypeOptions.length > 0 && (
          <div style={S.field}>
            <label style={S.label}>Property Subtype</label>
            {subtypeOptions.map((name) => (
              <label key={name} style={S.checkRow}>
                <input
                  type="checkbox"
                  checked={form.subtypes.includes(name)}
                  onChange={() => toggleSubtype(name)}
                />
                <span style={S.checkLabel}>{name}</span>
              </label>
            ))}
          </div>
        )}

        {/* Status */}
        <CollapsibleMultiSelect
          label="Status"
          options={STATUS_OPTIONS}
          selected={form.status}
          onChange={(values) => setForm((f) => ({ ...f, status: values }))}
        />

        <div style={S.divider} />

        {/* Price (in thousands) — single box, multiplied by 1000 into lp/hp */}
        <div style={S.field}>
          <label style={S.label}>Price (in thousands)</label>
          <RangeInput
            min={form.lp ? String(Number(form.lp) / 1000) : ""}
            max={form.hp ? String(Number(form.hp) / 1000) : ""}
            onChange={({ min, max }) =>
              setForm((f) => ({
                ...f,
                lp: min ? String(Math.round(Number(min) * 1000)) : "",
                hp: max ? String(Math.round(Number(max) * 1000)) : "",
              }))
            }
            placeholder="e.g. 250-350"
            preview={formatDollarsRange(form.lp, form.hp)}
          />
        </div>

        {/* Beds / Baths */}
        <div style={{ ...S.field, ...S.halfRow }}>
          <div>
            <label style={S.label}>Bedrooms</label>
            <select
              style={S.select}
              value={form.bd}
              onChange={(e) =>
                setForm((f) => ({ ...f, bd: e.target.value }))
              }
            >
              {BD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={S.label}>Bathrooms</label>
            <select
              style={S.select}
              value={form.tb}
              onChange={(e) =>
                setForm((f) => ({ ...f, tb: e.target.value }))
              }
            >
              {BA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Approx SqFt */}
        <div style={S.field}>
          <label style={S.label}>Approx SqFt</label>
          <RangeInput
            min={form.sqft}
            max={form.maxSqft}
            onChange={({ min, max }) =>
              setForm((f) => ({ ...f, sqft: min, maxSqft: max }))
            }
            placeholder="e.g. 1300-1500"
          />
        </div>

        {/* Approx Acres */}
        <div style={S.field}>
          <label style={S.label}>Approx Acres</label>
          <RangeInput
            min={form.acres}
            max={form.maxAcres}
            onChange={({ min, max }) =>
              setForm((f) => ({ ...f, acres: min, maxAcres: max }))
            }
            placeholder="e.g. 0.25-2"
          />
        </div>

        {/* Year Built */}
        <div style={S.field}>
          <label style={S.label}>Year Built</label>
          <RangeInput
            min={form.minYearBuilt}
            max={form.maxYearBuilt}
            onChange={({ min, max }) =>
              setForm((f) => ({ ...f, minYearBuilt: min, maxYearBuilt: max }))
            }
            placeholder="e.g. 2010-2025"
          />
        </div>

        {/* Fencing */}
        <CollapsibleMultiSelect
          label="Fencing"
          options={FENCING_OPTIONS}
          selected={form.fencing}
          onChange={(values) => setForm((f) => ({ ...f, fencing: values }))}
        />

        {/* Parking Features */}
        <CollapsibleMultiSelect
          label="Parking Features"
          options={PARKING_OPTIONS}
          selected={form.parkingFeatures}
          onChange={(values) =>
            setForm((f) => ({ ...f, parkingFeatures: values }))
          }
        />

        {/* Cooling */}
        <CollapsibleMultiSelect
          label="Cooling"
          options={COOLING_OPTIONS}
          selected={form.cooling}
          onChange={(values) => setForm((f) => ({ ...f, cooling: values }))}
        />

        {/* HOA */}
        <div style={S.field}>
          <label style={S.label}>HOA</label>
          <select
            style={S.select}
            value={form.maxAssocFee}
            onChange={(e) =>
              setForm((f) => ({ ...f, maxAssocFee: e.target.value }))
            }
          >
            {HOA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div style={S.divider} />

        {/* Receive Updates Toggle */}
        <div style={{ ...S.checkRow, marginBottom: 16 }}>
          <Toggle
            on={form.receiveUpdates}
            onToggle={() =>
              setForm((f) => ({ ...f, receiveUpdates: !f.receiveUpdates }))
            }
          />
          <span style={{ ...S.checkLabel, fontSize: 13, fontWeight: 500 }}>
            Send daily email alerts
          </span>
        </div>

        {/* Preview link */}
        <a
          href={buildResultsURL(form)}
          target="_blank"
          rel="noopener noreferrer"
          style={S.resultsLink}
        >
          🔗 Preview matching listings →
        </a>

        {/* Actions */}
        <div style={S.formActions}>
          <button style={S.cancelBtn} onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button
            style={S.saveBtn(saving)}
            onClick={() => {
              if (!form.searchName.trim()) {
                setNameMissing(true);
                nameRef.current?.focus();
                nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
              }
              onSave();
            }}
            disabled={saving}
          >
            {saving ? "Saving…" : isEditing ? "Update Alert" : "Save Alert"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Loading / Error ──────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        gap: 10,
        color: "#9CA3AF",
        fontSize: 13,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D1D5DB"
        strokeWidth="2.5"
        style={{ animation: "spin 1s linear infinite" }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#6B7280" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Loading…
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: 20,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={S.errorBox}>{message}</div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function FubApp() {
  const searchParams = useSearchParams();
  // Read primitive values outside the effect so the dependency is the stable
  // string, not the URLSearchParams object reference (which can change on every
  // render in Next.js App Router, causing the effect to re-run and abort itself).
  const context = searchParams.get("context");
  const signature = searchParams.get("signature");

  const [phase, setPhase] = useState<
    "loading" | "idle" | "creating" | "editing" | "error"
  >("loading");
  const [contact, setContact] = useState<Contact | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [searches, setSearches] = useState<IDXSearch[]>([]);
  const [form, setForm] = useState<FormValues>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Tab + activity state
  const [activeTab, setActiveTab] = useState<AppTab>("alerts");
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  const loadSearches = useCallback(async (lid: string) => {
    const res = await fetch(`/api/fub/listing-alerts/searches/${lid}`);
    if (!res.ok) return;
    const data = await res.json();
    setSearches(data.searches ?? []);
  }, []);

  const loadActivity = useCallback(async (lid: string) => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const res = await fetch(`/api/fub/listing-alerts/activity/${lid}`);
      if (!res.ok) {
        setActivityError("Failed to load activity data.");
        return;
      }
      const data = await res.json() as ActivityData;
      setActivityData(data);
    } catch {
      setActivityError("Network error loading activity.");
    } finally {
      setActivityLoading(false);
    }
  }, []);

  function handleTabChange(tab: AppTab) {
    setActiveTab(tab);
    // Lazy-load activity on first visit; don't re-fetch on subsequent switches
    if (tab === "activity" && leadId && !activityData && !activityLoading) {
      loadActivity(leadId);
    }
  }

  useEffect(() => {
    console.log("[FubApp] init effect, context:", context ? "present" : "absent");

    if (!context) {
      console.log("[FubApp] no context → idle (dev/preview mode)");
      setPhase("idle");
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        console.log("[FubApp] calling verify");
        const res = await fetch("/api/fub/listing-alerts/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context, signature }),
          signal: controller.signal,
        });

        console.log("[FubApp] verify status:", res.status);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn("[FubApp] verify failed:", err);
          setError((err as { error?: string }).error ?? "Verification failed");
          setPhase("error");
          return;
        }

        const data = await res.json() as { leadId: string; contact: Contact };
        console.log("[FubApp] verify ok, leadId:", data.leadId);
        setContact(data.contact);
        setLeadId(data.leadId);

        console.log("[FubApp] loading searches");
        await loadSearches(data.leadId);

        console.log("[FubApp] done → idle");
        setPhase("idle");
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          console.log("[FubApp] fetch aborted (effect cleanup)");
          return;
        }
        console.error("[FubApp] init error:", err);
        setError("Network error — please reload.");
        setPhase("error");
      }
    })();

    return () => {
      console.log("[FubApp] effect cleanup, aborting");
      controller.abort();
    };
  }, [context, signature, loadSearches]);

  function startCreate() {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setError(null);
    setPhase("creating");
  }

  function startEdit(s: IDXSearch) {
    setForm(searchToForm(s));
    setEditingId(s.id);
    setError(null);
    setPhase("editing");
  }

  async function handleSave() {
    if (!leadId) { setError("No IDX lead loaded — reopen the contact."); return; }
    if (!form.searchName.trim()) { setError("Alert name is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const url = editingId
        ? `/api/fub/listing-alerts/searches/${leadId}/${editingId}`
        : `/api/fub/listing-alerts/searches/${leadId}`;

      const res = await fetch(url, {
        method: editingId ? "POST" : "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: buildPayload(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError((err as { error?: string }).error ?? `Save failed (${res.status}).`);
        return;
      }

      await loadSearches(leadId);
      setPhase("idle");
    } catch (e) {
      console.error("[FubApp] save threw:", e);
      setError(`Couldn't save: ${(e as Error)?.message ?? "unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(searchId: string) {
    if (!leadId) return;
    setDeletingId(searchId);
    try {
      await fetch(
        `/api/fub/listing-alerts/searches/${leadId}/${searchId}`,
        { method: "DELETE" }
      );
      await loadSearches(leadId);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  async function handleToggleUpdates(s: IDXSearch) {
    if (!leadId) return;
    const updated: FormValues = {
      ...searchToForm(s),
      receiveUpdates: s.receiveUpdates !== "y",
    };
    await fetch(`/api/fub/listing-alerts/searches/${leadId}/${s.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: buildPayload(updated),
    });
    await loadSearches(leadId);
  }

  if (phase === "loading") return <LoadingView />;
  if (phase === "error") return <ErrorView message={error ?? "An error occurred."} />;

  if (phase === "creating" || phase === "editing") {
    return (
      <FormView
        form={form}
        setForm={setForm}
        isEditing={phase === "editing"}
        saving={saving}
        error={error}
        onSave={handleSave}
        onCancel={() => {
          setPhase("idle");
          setError(null);
        }}
        leadId={leadId}
      />
    );
  }

  return (
    <MainView
      contact={contact}
      leadId={leadId}
      searches={searches}
      confirmDeleteId={confirmDeleteId}
      deletingId={deletingId}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onCreate={startCreate}
      onEdit={startEdit}
      onDelete={handleDelete}
      onConfirmDelete={setConfirmDeleteId}
      onToggleUpdates={handleToggleUpdates}
      activityData={activityData}
      activityLoading={activityLoading}
      activityError={activityError}
    />
  );
}
