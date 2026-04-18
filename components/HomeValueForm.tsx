"use client";

import { useState } from "react";

const inputClass =
  "w-full bg-transparent border border-brand-stone/40 rounded px-4 py-2.5 text-linen text-sm placeholder:text-brand-stone/60 focus:outline-none focus:border-brand-stone transition-colors";
const labelClass =
  "block text-brand-stone text-xs uppercase tracking-widest mb-1.5";

export default function HomeValueForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", propertyAddress: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/home-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="text-linen text-center py-10"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <div className="text-4xl mb-4">✓</div>
        <p className="text-lg mb-2">You&apos;re all set.</p>
        <p className="text-brand-stone text-sm">
          Amy will have your valuation ready within 24 hours.
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
      <div className="mb-5">
        <label className={labelClass}>Your Name <span className="text-linen/50">*</span></label>
        <input className={inputClass} type="text" name="name" value={form.name}
          onChange={handleChange} required autoComplete="name" />
      </div>
      <div className="mb-5">
        <label className={labelClass}>Email <span className="text-linen/50">*</span></label>
        <input className={inputClass} type="email" name="email" value={form.email}
          onChange={handleChange} required autoComplete="email" />
      </div>
      <div className="mb-5">
        <label className={labelClass}>Phone</label>
        <input className={inputClass} type="tel" name="phone" value={form.phone}
          onChange={handleChange} autoComplete="tel" placeholder="Optional" />
      </div>
      <div className="mb-8">
        <label className={labelClass}>Property Address <span className="text-linen/50">*</span></label>
        <input className={inputClass} type="text" name="propertyAddress" value={form.propertyAddress}
          onChange={handleChange} required placeholder="123 Main St, Kingman AZ 86401" />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm mb-4">
          Something went wrong. Please call Amy at{" "}
          <a href="tel:9285309393" className="underline">928-530-9393</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-linen text-brand-slate text-sm uppercase tracking-widest py-3 rounded
                   hover:bg-brand-stone transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Get My Home Value"}
      </button>
    </form>
  );
}
