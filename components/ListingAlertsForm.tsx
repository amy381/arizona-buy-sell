"use client";

import { useState } from "react";

const inputClass = `
  w-full bg-transparent border border-brand-stone/40 rounded px-4 py-2.5
  text-linen text-sm placeholder:text-brand-stone/60 focus:outline-none
  focus:border-brand-stone transition-colors
`.trim();

const labelClass = "block text-brand-stone text-xs uppercase tracking-widest mb-1.5";

export default function ListingAlertsForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    location: "", minPrice: "", maxPrice: "", bedrooms: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/listing-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="text-center py-12 text-linen"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <div className="text-4xl mb-4">✓</div>
        <p className="text-lg mb-2">You&apos;re on the list.</p>
        <p className="text-brand-stone text-sm">
          I&apos;ll reach out as soon as something matching your criteria comes available.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
      noValidate
    >
      {/* Name row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelClass}>First Name <span className="text-linen/50">*</span></label>
          <input
            className={inputClass}
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className={labelClass}>Last Name <span className="text-linen/50">*</span></label>
          <input
            className={inputClass}
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className={labelClass}>Email <span className="text-linen/50">*</span></label>
        <input
          className={inputClass}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </div>

      {/* Phone */}
      <div className="mb-5">
        <label className={labelClass}>Phone</label>
        <input
          className={inputClass}
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="Optional"
        />
      </div>

      {/* Location */}
      <div className="mb-5">
        <label className={labelClass}>Area / City</label>
        <input
          className={inputClass}
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Kingman, Golden Valley, Lake Havasu"
        />
      </div>

      {/* Price range */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelClass}>Min Price</label>
          <input
            className={inputClass}
            type="text"
            name="minPrice"
            value={form.minPrice}
            onChange={handleChange}
            placeholder="e.g. 150,000"
          />
        </div>
        <div>
          <label className={labelClass}>Max Price</label>
          <input
            className={inputClass}
            type="text"
            name="maxPrice"
            value={form.maxPrice}
            onChange={handleChange}
            placeholder="e.g. 400,000"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-8">
        <label className={labelClass}>Minimum Bedrooms</label>
        <select
          className={inputClass}
          name="bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      {errorMsg && (
        <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-linen text-brand-slate text-sm uppercase tracking-widest py-3 rounded
                   hover:bg-brand-stone transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Sign Me Up"}
      </button>
    </form>
  );
}
