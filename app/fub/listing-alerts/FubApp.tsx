"use client";

import { useState, useEffect, useCallback } from "react";
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
  sqft?: string;
  amax_sqFt?: string;
  acres?: string;
  amax_acres?: string;
  srt?: string;
  amin_yearBuilt?: string;
  amax_yearBuilt?: string;
  a_propSubType?: string | string[];
  amax_associationFee?: string;
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
];

const PARKING_OPTIONS = [
  "Air Conditioned Garage",
  "Attached",
  "Carport",
  "Common",
  "Detached",
  "Drive Through",
  "Electric Vehicle Charging Station(s)",
];

const COOLING_OPTIONS = [
  "Central Air",
  "Ductless",
  "Electric",
  "Evaporative/Swamp",
  "Evaporative Cooling",
  "Heat Pump",
  "Multi Units",
];

const HOA_OPTIONS = [
  { value: "", label: "Any" },
  { value: "0", label: "No HOA" },
  { value: "50", label: "Max $50/mo" },
  { value: "100", label: "Max $100/mo" },
  { value: "200", label: "Max $200/mo" },
  { value: "300", label: "Max $300/mo" },
];

const DEFAULT_FORM: FormValues = {
  searchName: "",
  cities: [],
  pt: "1",
  subtypes: [],
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
  if (s.sqft) parts.push(`${parseInt(s.sqft).toLocaleString()}+ sqft`);

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
    lp: src.lp ?? "",
    hp: src.hp ?? "",
    bd: src.bd ?? "0",
    tb: src.tb ?? "0",
    sqft: src.sqft ?? "",
    maxSqft: src.amax_sqFt ?? "",
    acres: src.acres ?? "",
    maxAcres: src.amax_acres ?? "",
    minYearBuilt: src.amin_yearBuilt ?? "",
    maxYearBuilt: src.amax_yearBuilt ?? "",
    maxAssocFee: src.amax_associationFee ?? "",
    fencing,
    parkingFeatures,
    cooling,
    receiveUpdates: s.receiveUpdates !== "n",
  };
}

function buildPayload(form: FormValues): string {
  const body = new URLSearchParams();
  body.append("searchName", form.searchName.trim());
  body.append("receiveUpdates", form.receiveUpdates ? "y" : "n");
  body.append("search[idxID]", "c090");
  body.append("search[srt]", "newest");

  if (form.cities.length > 0) {
    body.append("search[ccz]", "city");
    form.cities.forEach((id) => body.append("search[city][]", id));
  }

  if (form.pt) body.append("search[pt]", form.pt);

  form.subtypes.forEach((sub) =>
    body.append("search[a_propSubType][]", sub)
  );

  if (form.lp) body.append("search[lp]", form.lp);
  if (form.hp) body.append("search[hp]", form.hp);
  if (form.bd !== "0") body.append("search[bd]", form.bd);
  if (form.tb !== "0") body.append("search[tb]", form.tb);
  if (form.sqft) body.append("search[sqft]", form.sqft);
  if (form.maxSqft) body.append("search[amax_sqFt]", form.maxSqft);
  if (form.acres) body.append("search[acres]", form.acres);
  if (form.maxAcres) body.append("search[amax_acres]", form.maxAcres);
  if (form.minYearBuilt)
    body.append("search[amin_yearBuilt]", form.minYearBuilt);
  if (form.maxYearBuilt)
    body.append("search[amax_yearBuilt]", form.maxYearBuilt);
  if (form.maxAssocFee !== "")
    body.append("search[amax_associationFee]", form.maxAssocFee);
  form.fencing.forEach((v) => body.append("search[a_fencing][]", v));
  form.parkingFeatures.forEach((v) =>
    body.append("search[a_parkingFeatures][]", v)
  );
  form.cooling.forEach((v) => body.append("search[a_cooling][]", v));

  return body.toString();
}

function buildResultsURL(form: FormValues): string {
  const p = new URLSearchParams();
  p.set("page", "listings");
  p.set("idxID", "c090");
  if (form.pt) p.set("pt", form.pt);
  if (form.cities.length > 0) {
    p.set("ccz", "city");
    form.cities.forEach((id) => p.append("city[]", id));
  }
  if (form.lp) p.set("lp", form.lp);
  if (form.hp) p.set("hp", form.hp);
  if (form.bd !== "0") p.set("bd", form.bd);
  if (form.tb !== "0") p.set("tb", form.tb);
  if (form.sqft) p.set("sqft", form.sqft);
  p.set("srt", "newest");
  return `https://search.arizonabuyandsell.com/idx/results?${p.toString()}`;
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
  const name = contact
    ? `${contact.firstName} ${contact.lastName}`.trim()
    : "";

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        {name && <p style={S.name}>{name}</p>}
        {contact?.email && <p style={S.email}>{contact.email}</p>}
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
            style={S.input}
            type="text"
            value={form.searchName}
            onChange={(e) =>
              setForm((f) => ({ ...f, searchName: e.target.value }))
            }
            placeholder="e.g. Kingman Homes Under $400k"
          />
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

        <div style={S.divider} />

        {/* Price Range */}
        <div style={{ ...S.field, ...S.priceRow }}>
          <div>
            <label style={S.label}>Min Price</label>
            <input
              style={S.input}
              type="number"
              value={form.lp}
              onChange={(e) =>
                setForm((f) => ({ ...f, lp: e.target.value }))
              }
              placeholder="$0"
              min={0}
            />
          </div>
          <div>
            <label style={S.label}>Max Price</label>
            <input
              style={S.input}
              type="number"
              value={form.hp}
              onChange={(e) =>
                setForm((f) => ({ ...f, hp: e.target.value }))
              }
              placeholder="No max"
              min={0}
            />
          </div>
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
          <div style={S.halfRow}>
            <input
              style={S.input}
              type="number"
              value={form.sqft}
              onChange={(e) =>
                setForm((f) => ({ ...f, sqft: e.target.value }))
              }
              placeholder="Min"
              min={0}
            />
            <input
              style={S.input}
              type="number"
              value={form.maxSqft}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxSqft: e.target.value }))
              }
              placeholder="Max"
              min={0}
            />
          </div>
        </div>

        {/* Approx Acres */}
        <div style={S.field}>
          <label style={S.label}>Approx Acres</label>
          <div style={S.halfRow}>
            <input
              style={S.input}
              type="number"
              value={form.acres}
              onChange={(e) =>
                setForm((f) => ({ ...f, acres: e.target.value }))
              }
              placeholder="Min"
              min={0}
              step="0.01"
            />
            <input
              style={S.input}
              type="number"
              value={form.maxAcres}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxAcres: e.target.value }))
              }
              placeholder="Max"
              min={0}
              step="0.01"
            />
          </div>
        </div>

        {/* Year Built */}
        <div style={S.field}>
          <label style={S.label}>Year Built</label>
          <div style={S.halfRow}>
            <input
              style={S.input}
              type="number"
              value={form.minYearBuilt}
              onChange={(e) =>
                setForm((f) => ({ ...f, minYearBuilt: e.target.value }))
              }
              placeholder="Min"
              min={1800}
              max={new Date().getFullYear() + 2}
            />
            <input
              style={S.input}
              type="number"
              value={form.maxYearBuilt}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxYearBuilt: e.target.value }))
              }
              placeholder="Max"
              min={1800}
              max={new Date().getFullYear() + 2}
            />
          </div>
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
            onClick={onSave}
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
    const context = searchParams.get("context");
    const signature = searchParams.get("signature");

    if (!context) {
      setPhase("idle");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/fub/listing-alerts/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context, signature }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError((err as { error?: string }).error ?? "Verification failed");
          setPhase("error");
          return;
        }
        const data = await res.json() as { leadId: string; contact: Contact };
        setContact(data.contact);
        setLeadId(data.leadId);
        await loadSearches(data.leadId);
        setPhase("idle");
      } catch {
        setError("Network error — please reload.");
        setPhase("error");
      }
    })();
  }, [searchParams, loadSearches]);

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
    if (!leadId) return;
    if (!form.searchName.trim()) {
      setError("Alert name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const url = editingId
        ? `/api/fub/listing-alerts/searches/${leadId}/${editingId}`
        : `/api/fub/listing-alerts/searches/${leadId}`;
      const method = editingId ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: buildPayload(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError((err as { error?: string }).error ?? "Failed to save.");
        return;
      }

      await loadSearches(leadId);
      setPhase("idle");
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
