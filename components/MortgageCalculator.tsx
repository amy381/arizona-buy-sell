"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const AZ_TAX_RATE = 0.0065; // 0.65% annually

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function parseNumber(s: string) {
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

export default function MortgageCalculator() {
  const [homePrice,    setHomePrice]    = useState("350000");
  const [downPct,      setDownPct]      = useState("20");
  const [downAmt,      setDownAmt]      = useState("70000");
  const [interestRate, setInterestRate] = useState("7.0");
  const [loanTerm,     setLoanTerm]     = useState<15 | 30>(30);

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [monthlyPI,      setMonthlyPI]      = useState(0);
  const [monthlyTax,     setMonthlyTax]     = useState(0);

  // Sync down payment % → $
  function handleDownPct(val: string) {
    setDownPct(val);
    const price = parseNumber(homePrice);
    const pct   = parseFloat(val) || 0;
    setDownAmt(String(Math.round(price * pct / 100)));
  }

  // Sync down payment $ → %
  function handleDownAmt(val: string) {
    setDownAmt(val);
    const price = parseNumber(homePrice);
    const amt   = parseNumber(val);
    setDownPct(price > 0 ? String(Math.round((amt / price) * 100)) : "0");
  }

  // Recalc when home price changes (keep % fixed, update $)
  function handleHomePrice(val: string) {
    setHomePrice(val);
    const price = parseNumber(val);
    const pct   = parseFloat(downPct) || 0;
    setDownAmt(String(Math.round(price * pct / 100)));
  }

  useEffect(() => {
    const price      = parseNumber(homePrice);
    const down       = parseNumber(downAmt);
    const loan       = Math.max(price - down, 0);
    const r          = (parseFloat(interestRate) || 0) / 100 / 12;
    const n          = loanTerm * 12;
    const tax        = price * AZ_TAX_RATE / 12;

    let pi = 0;
    if (r === 0) {
      pi = n > 0 ? loan / n : 0;
    } else {
      const factor = Math.pow(1 + r, n);
      pi = loan * (r * factor) / (factor - 1);
    }

    setMonthlyPI(pi);
    setMonthlyTax(tax);
    setMonthlyPayment(pi + tax);
  }, [homePrice, downAmt, interestRate, loanTerm]);

  const inputClass =
    "w-full bg-brand-slate border border-brand-stone/40 rounded px-4 py-2.5 text-linen text-sm focus:outline-none focus:border-brand-stone transition-colors";
  const labelClass =
    "block text-brand-stone text-xs uppercase tracking-widest mb-1.5";

  return (
    <section className="bg-steel py-16 px-6">
      <div
        className="max-w-2xl mx-auto"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Home Price */}
          <div>
            <label className={labelClass}>Home Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-stone text-sm">$</span>
              <input
                className={`${inputClass} pl-7`}
                type="text"
                value={homePrice}
                onChange={(e) => handleHomePrice(e.target.value)}
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className={labelClass}>Interest Rate</label>
            <div className="relative">
              <input
                className={`${inputClass} pr-7`}
                type="text"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-stone text-sm">%</span>
            </div>
          </div>

          {/* Down Payment % */}
          <div>
            <label className={labelClass}>Down Payment</label>
            <div className="relative">
              <input
                className={`${inputClass} pr-7`}
                type="text"
                value={downPct}
                onChange={(e) => handleDownPct(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-stone text-sm">%</span>
            </div>
          </div>

          {/* Down Payment $ */}
          <div>
            <label className={labelClass}>Down Payment ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-stone text-sm">$</span>
              <input
                className={`${inputClass} pl-7`}
                type="text"
                value={downAmt}
                onChange={(e) => handleDownAmt(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loan Term Toggle */}
        <div className="mb-10">
          <label className={labelClass}>Loan Term</label>
          <div className="flex rounded overflow-hidden border border-brand-stone/40 w-fit">
            {([30, 15] as const).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setLoanTerm(yr)}
                className={`px-8 py-2.5 text-sm transition-colors ${
                  loanTerm === yr
                    ? "bg-brand-stone text-brand-slate font-medium"
                    : "text-brand-stone hover:bg-brand-stone/10"
                }`}
              >
                {yr} yr
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {monthlyPayment !== null && (
          <div className="bg-brand-slate rounded-xl p-8">
            <p className={labelClass}>Estimated Monthly Payment</p>
            <p className="text-linen font-medium text-5xl mb-6" style={{ lineHeight: 1.1 }}>
              {formatCurrency(monthlyPayment)}
            </p>
            <div className="space-y-3 border-t border-linen/10 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-brand-stone">Principal &amp; Interest</span>
                <span className="text-linen">{formatCurrency(monthlyPI)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-stone">Est. Property Taxes</span>
                <span className="text-linen">{formatCurrency(monthlyTax)}</span>
              </div>
              <p className="text-brand-stone/60 text-xs pt-1">
                Tax estimate based on Arizona average rate of 0.65%. Actual taxes vary by county.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <p
            className="text-brand-stone text-sm mb-5"
          >
            Ready to find homes in your budget?
          </p>
          <Link
            href="/search-properties"
            className="inline-block bg-linen text-brand-slate text-sm uppercase tracking-widest px-8 py-3 rounded hover:bg-brand-stone transition-colors"
          >
            Search Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
