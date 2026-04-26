"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";

interface Submission {
  id:               number;
  address:          string;
  city:             string;
  state:            string;
  zip:              string;
  owner_first:      string;
  owner_last:       string;
  phone:            string;
  email:            string;
  intent_signal:    string;
  submitted_at:     string;
  forwarded_to_fub: boolean;
  is_duplicate:     boolean;
}

const FONT = "var(--font-inter), sans-serif";

const inputClass =
  "w-full bg-steel border border-brand-stone/30 rounded px-4 py-2.5 text-linen text-sm " +
  "placeholder:text-brand-stone/50 focus:outline-none focus:border-brand-stone transition-colors";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

async function fetchSubmissions(): Promise<Submission[]> {
  const res = await fetch("/api/admin/nestimate", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({}),
  });
  if (!res.ok) throw Object.assign(new Error("fetch failed"), { status: res.status });
  const data = await res.json() as { submissions?: Submission[] };
  return data.submissions ?? [];
}

export default function AdminNestimatePage() {
  const [password,       setPassword]       = useState("");
  const [authed,         setAuthed]         = useState(false);
  const [submissions,    setSubmissions]    = useState<Submission[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);

  // Try cookie session on mount
  useEffect(() => {
    fetchSubmissions()
      .then((data) => {
        setSubmissions(data);
        setAuthed(true);
      })
      .catch(() => {
        // 401 or error — show login form
      })
      .finally(() => setSessionChecked(true));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const sessionRes = await fetch("/api/admin/session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });
      if (sessionRes.status === 401) { setError("Incorrect password."); return; }
      if (!sessionRes.ok) { setError("Something went wrong. Try again."); return; }
      const data = await fetchSubmissions();
      setSubmissions(data);
      setAuthed(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Loading (session check in progress) ───────────────────────────────────
  if (!sessionChecked) {
    return (
      <>
        <AdminNav />
        <div className="min-h-screen bg-brand-slate flex items-center justify-center">
          <p className="text-brand-stone text-sm" style={{ fontFamily: FONT }}>Loading…</p>
        </div>
      </>
    );
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <AdminNav />
        <div className="min-h-screen bg-brand-slate flex items-center justify-center px-6">
          <form
            onSubmit={handleLogin}
            className="bg-steel rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5"
            style={{ fontFamily: FONT }}
          >
            <p className="text-linen font-medium text-[18px]">Nestimate Admin</p>
            <div>
              <label className="block text-brand-stone text-xs uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                className={inputClass}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="text-brand-stone text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-stone text-brand-slate text-sm uppercase tracking-widest font-medium
                         py-3 rounded hover:bg-linen transition-colors disabled:opacity-60"
            >
              {loading ? "Checking…" : "Sign In"}
            </button>
          </form>
        </div>
      </>
    );
  }

  // ── Submissions table ─────────────────────────────────────────────────────
  return (
    <>
      <AdminNav />
      <div
        className="min-h-screen bg-brand-slate px-6 py-12"
        style={{ fontFamily: FONT }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-linen font-medium text-[24px]">
              Nestimate Submissions
            </h1>
            <span className="text-brand-stone text-sm">
              {submissions.length} total
            </span>
          </div>

          {submissions.length === 0 ? (
            <p className="text-brand-stone text-sm">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-brand-stone/20">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-steel text-brand-stone text-xs uppercase tracking-widest">
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Address</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Name</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Phone</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Intent</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">FUB</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Dup</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => {
                    const isHighPriority = s.intent_signal === "Ready to sell now";
                    return (
                      <tr
                        key={s.id}
                        className={`border-t border-brand-stone/10 transition-colors
                          ${isHighPriority
                            ? "bg-brand-stone/10 hover:bg-brand-stone/15"
                            : i % 2 === 0
                              ? "bg-brand-slate hover:bg-steel/40"
                              : "bg-steel/20 hover:bg-steel/40"
                          }`}
                      >
                        <td className="px-4 py-3 text-brand-stone whitespace-nowrap">
                          {fmtDate(s.submitted_at)}
                        </td>
                        <td className="px-4 py-3 text-linen">
                          {s.address}
                          {s.city ? `, ${s.city}` : ""}
                          {s.zip  ? ` ${s.zip}`   : ""}
                        </td>
                        <td className="px-4 py-3 text-linen whitespace-nowrap">
                          {s.owner_first} {s.owner_last}
                        </td>
                        <td className="px-4 py-3 text-linen whitespace-nowrap">
                          <a href={`tel:${s.phone}`} className="hover:underline">{s.phone}</a>
                        </td>
                        <td className="px-4 py-3 text-linen">
                          <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap ${isHighPriority ? "text-brand-stone font-medium" : "text-linen"}`}>
                          {isHighPriority && "⚠️ "}{s.intent_signal}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.forwarded_to_fub
                            ? <span className="text-green-400 text-base leading-none">✓</span>
                            : <span className="text-red-400  text-base leading-none">✗</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s.is_duplicate && (
                            <span className="text-brand-stone text-xs">Yes</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
