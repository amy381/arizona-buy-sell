"use client";

import { useState } from "react";

const inputClass =
  "w-full bg-transparent border border-brand-stone/40 rounded px-4 py-2.5 text-linen text-sm placeholder:text-brand-stone/60 focus:outline-none focus:border-brand-stone transition-colors";

const labelClass =
  "block text-brand-stone text-xs uppercase tracking-widest mb-1.5";

const INQUIRY_TYPES = ["Buyer", "Seller", "Investor", "Just Looking"];

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
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
        className="text-linen py-12 text-center"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <div className="text-4xl mb-4">✓</div>
        <p className="text-lg mb-2">Thanks!</p>
        <p className="text-brand-stone text-sm">Amy will be in touch within 24 hours.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="text-linen py-12 text-center"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <p className="text-red-400 mb-3">Something went wrong.</p>
        <p className="text-brand-stone text-sm">
          Please call Amy directly at{" "}
          <a href="tel:9285309393" className="text-linen hover:underline">
            928-530-9393
          </a>
          .
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
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelClass}>First Name <span className="text-linen/50">*</span></label>
          <input className={inputClass} type="text" name="firstName" value={form.firstName}
            onChange={handleChange} required autoComplete="given-name" />
        </div>
        <div>
          <label className={labelClass}>Last Name <span className="text-linen/50">*</span></label>
          <input className={inputClass} type="text" name="lastName" value={form.lastName}
            onChange={handleChange} required autoComplete="family-name" />
        </div>
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

      <div className="mb-5">
        <label className={labelClass}>I am a...</label>
        <select
          className={`${inputClass} bg-brand-slate`}
          name="inquiryType"
          value={form.inquiryType}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <label className={labelClass}>Message</label>
        <textarea
          className={`${inputClass} min-h-[120px] resize-y`}
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="How can Amy help you?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-brand-stone text-brand-slate text-sm uppercase tracking-widest py-3 rounded
                   hover:bg-linen transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
