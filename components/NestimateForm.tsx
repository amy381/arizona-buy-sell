"use client";

import { useState } from "react";
import Image from "next/image";

const INTENT_OPTIONS = [
  "Just curious about my home's value",
  "Possibly in the next 12 months",
  "Actively looking to sell soon",
  "Ready to sell now",
];

interface FormState {
  address:       string;
  city:          string;
  state:         string;
  zip:           string;
  owner_first:   string;
  owner_last:    string;
  phone:         string;
  email:         string;
  intent_signal: string;
}

const EMPTY: FormState = {
  address:       "",
  city:          "Kingman",
  state:         "AZ",
  zip:           "",
  owner_first:   "",
  owner_last:    "",
  phone:         "",
  email:         "",
  intent_signal: "",
};

type Status = "idle" | "loading" | "success" | "error";

export default function NestimateForm() {
  const [form,   setForm]   = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/nestimate/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error("non-2xx");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-brand-slate border border-brand-stone/30 rounded px-4 py-2.5 text-linen " +
    "text-sm placeholder:text-brand-stone/50 focus:outline-none focus:border-brand-stone transition-colors";
  const labelClass =
    "block text-brand-stone text-xs uppercase tracking-widest mb-1.5";

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-linen"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p
          className="text-linen font-medium text-[24px]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          You&apos;re all set, {form.owner_first}!
        </p>
        <p
          className="text-brand-stone text-[16px] leading-relaxed max-w-sm"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Amy will have your personalized Nestimate ready within 24 hours. She&apos;ll reach out
          to <span className="text-linen">{form.email}</span> with your results.
        </p>
        <p
          className="text-brand-stone text-[14px]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Have questions in the meantime? Call Amy directly at{" "}
          <a href="tel:9285309393" className="text-linen hover:underline">928-530-9393</a>.
        </p>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} noValidate>
      <p
        className="text-linen font-medium text-[20px] mb-6"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        Tell Amy About Your Home
      </p>

      <div className="flex flex-col gap-4">
        {/* Address */}
        <div>
          <label className={labelClass}>Property Address</label>
          <input
            className={inputClass}
            type="text"
            required
            placeholder="Street address"
            value={form.address}
            onChange={set("address")}
          />
        </div>

        {/* City / State / ZIP */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>City</label>
            <input
              className={inputClass}
              type="text"
              required
              placeholder="Kingman"
              value={form.city}
              onChange={set("city")}
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              className={`${inputClass} opacity-60 cursor-not-allowed`}
              type="text"
              required
              value={form.state}
              readOnly
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>ZIP Code</label>
          <input
            className={inputClass}
            type="text"
            required
            placeholder="86401"
            value={form.zip}
            onChange={set("zip")}
          />
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First Name</label>
            <input
              className={inputClass}
              type="text"
              required
              value={form.owner_first}
              onChange={set("owner_first")}
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              className={inputClass}
              type="text"
              required
              value={form.owner_last}
              onChange={set("owner_last")}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            className={inputClass}
            type="tel"
            required
            value={form.phone}
            onChange={set("phone")}
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            className={inputClass}
            type="email"
            required
            value={form.email}
            onChange={set("email")}
          />
        </div>

        {/* Intent */}
        <div>
          <label className={labelClass}>Considering selling?</label>
          <select
            className={`${inputClass} appearance-none`}
            required
            value={form.intent_signal}
            onChange={set("intent_signal")}
          >
            <option value="" disabled>Select one…</option>
            {INTENT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <p
          className="text-brand-stone text-sm mt-4"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Something went wrong. Please try again or call Amy directly at{" "}
          <a href="tel:9285309393" className="text-linen hover:underline">928-530-9393</a>.
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full bg-brand-stone text-brand-slate text-sm uppercase tracking-widest
                   font-medium py-3.5 rounded hover:bg-linen transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {status === "loading" ? "Sending…" : "Get My Nestimate"}
      </button>

      <p
        className="text-center text-brand-stone/60 text-xs mt-3"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        Your information is never shared or sold.
      </p>
    </form>
  );
}

/* ── Left-column trust content (also used by the page) ── */
export function NestimateLeft() {
  return (
    <div className="flex flex-col">
      <span
        className="text-brand-stone text-[14px] uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        AI-Powered Valuation
      </span>
      <h1
        className="text-linen leading-none mb-5"
        style={{
          fontFamily: "var(--font-alex-brush), cursive",
          fontSize: "clamp(2.75rem, 6vw, 4rem)",
        }}
      >
        What Is Your Home Worth?
      </h1>
      <p
        className="text-brand-stone text-[16px] leading-[1.7] mb-8 max-w-md"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        Get your personalized Nestimate delivered within 24 hours. No obligation. No pressure.
        Just honest numbers from someone who knows this market.
      </p>

      <ul className="flex flex-col gap-3 mb-10">
        {[
          "Based on real MLS data — not algorithms",
          "Specific to your neighborhood and property type",
          "Delivered personally by Amy Casanova",
        ].map(signal => (
          <li
            key={signal}
            className="flex items-start gap-2 text-brand-stone text-[14px]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <span className="text-brand-stone mt-0.5 shrink-0">—</span>
            {signal}
          </li>
        ))}
      </ul>

      {/* Headshot — desktop only */}
      <div className="hidden md:block relative w-48 h-56 rounded-xl overflow-hidden border border-brand-stone/20">
        <Image
          src="/images/headshot.jpg"
          alt="Amy Casanova, Realtor"
          fill
          className="object-cover object-top"
          sizes="192px"
        />
      </div>
    </div>
  );
}
