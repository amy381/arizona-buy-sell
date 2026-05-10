"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  acres?: string;
  srt?: string;
  amin_yearBuilt?: string;
  amax_yearBuilt?: string;
  a_propSubType?: string | string[];
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
  acres: string;
  minYearBuilt: string;
  maxYearBuilt: string;
  receiveUpdates: boolean;
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
  acres: "",
  minYearBuilt: "",
  maxYearBuilt: "",
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
    acres: src.acres ?? "",
    minYearBuilt: src.amin_yearBuilt ?? "",
    maxYearBuilt: src.amax_yearBuilt ?? "",
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
  if (form.acres) body.append("search[acres]", form.acres);
  if (form.minYearBuilt)
    body.append("search[amin_yearBuilt]", form.minYearBuilt);
  if (form.maxYearBuilt)
    body.append("search[amax_yearBuilt]", form.maxYearBuilt);

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

// ─── Main View ────────────────────────────────────────────────────────────────

function MainView({
  contact,
  leadId,
  searches,
  confirmDeleteId,
  deletingId,
  onCreate,
  onEdit,
  onDelete,
  onConfirmDelete,
  onToggleUpdates,
}: {
  contact: Contact | null;
  leadId: string | null;
  searches: IDXSearch[];
  confirmDeleteId: string | null;
  deletingId: string | null;
  onCreate: () => void;
  onEdit: (s: IDXSearch) => void;
  onDelete: (id: string) => void;
  onConfirmDelete: (id: string | null) => void;
  onToggleUpdates: (s: IDXSearch) => void;
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

        {/* SqFt / Acres */}
        <div style={{ ...S.field, ...S.halfRow }}>
          <div>
            <label style={S.label}>Min SqFt</label>
            <input
              style={S.input}
              type="number"
              value={form.sqft}
              onChange={(e) =>
                setForm((f) => ({ ...f, sqft: e.target.value }))
              }
              placeholder="Any"
              min={0}
            />
          </div>
          <div>
            <label style={S.label}>Min Acres</label>
            <input
              style={S.input}
              type="number"
              value={form.acres}
              onChange={(e) =>
                setForm((f) => ({ ...f, acres: e.target.value }))
              }
              placeholder="Any"
              min={0}
              step="0.01"
            />
          </div>
        </div>

        {/* Year Built */}
        <div style={{ ...S.field, ...S.halfRow }}>
          <div>
            <label style={S.label}>Year Built Min</label>
            <input
              style={S.input}
              type="number"
              value={form.minYearBuilt}
              onChange={(e) =>
                setForm((f) => ({ ...f, minYearBuilt: e.target.value }))
              }
              placeholder="Any"
              min={1800}
              max={new Date().getFullYear() + 2}
            />
          </div>
          <div>
            <label style={S.label}>Year Built Max</label>
            <input
              style={S.input}
              type="number"
              value={form.maxYearBuilt}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxYearBuilt: e.target.value }))
              }
              placeholder="Any"
              min={1800}
              max={new Date().getFullYear() + 2}
            />
          </div>
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

  const loadSearches = useCallback(async (lid: string) => {
    const res = await fetch(`/api/fub/listing-alerts/searches/${lid}`);
    if (!res.ok) return;
    const data = await res.json();
    setSearches(data.searches ?? []);
  }, []);

  useEffect(() => {
    const context = searchParams.get("context");
    const signature = searchParams.get("signature");

    if (!context) {
      // No FUB context — dev/preview mode
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
      onCreate={startCreate}
      onEdit={startEdit}
      onDelete={handleDelete}
      onConfirmDelete={setConfirmDeleteId}
      onToggleUpdates={handleToggleUpdates}
    />
  );
}
