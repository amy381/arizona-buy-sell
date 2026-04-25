"use client";

import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id:               number;
  session_id:       string;
  messages:         ChatMessage[];
  lead_captured:    boolean;
  lead_name:        string | null;
  lead_email:       string | null;
  lead_phone:       string | null;
  page_url:         string | null;
  started_at:       string;
  last_message_at:  string;
}

const FONT = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";

const inputClass =
  "w-full bg-steel border border-brand-stone/30 rounded px-4 py-2.5 text-linen text-sm " +
  "placeholder:text-brand-stone/50 focus:outline-none focus:border-brand-stone transition-colors";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function shortUrl(url: string | null) {
  if (!url) return "—";
  try {
    const u = new URL(url);
    return u.pathname || "/";
  } catch {
    return url;
  }
}

export default function AdminChatsPage() {
  const [password,      setPassword]      = useState("");
  const [authed,        setAuthed]        = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [expanded,      setExpanded]      = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/chats", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });
      if (res.status === 401) { setError("Incorrect password."); return; }
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setConversations(data.conversations ?? []);
      setAuthed(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(sessionId: string) {
    setExpanded((prev) => (prev === sessionId ? null : sessionId));
  }

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-slate flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="bg-steel rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5"
          style={{ fontFamily: FONT }}
        >
          <p className="text-linen font-medium text-[18px]">Chat Admin</p>
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
    );
  }

  const leadCount = conversations.filter((c) => c.lead_captured).length;

  /* ── Conversations table ── */
  return (
    <div
      className="min-h-screen bg-brand-slate px-6 py-12"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-linen font-medium text-[24px]">Chat Conversations</h1>
          <div className="flex gap-6 text-sm text-brand-stone">
            <span>{conversations.length} total</span>
            <span>{leadCount} leads captured</span>
          </div>
        </div>

        {conversations.length === 0 ? (
          <p className="text-brand-stone text-sm">No conversations yet.</p>
        ) : (
          <div className="rounded-xl border border-brand-stone/20 overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-steel text-brand-stone text-xs uppercase tracking-widest">
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Page</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Lead Name</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Messages</th>
                  <th className="px-4 py-3 text-center font-medium whitespace-nowrap">Lead</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((c, i) => {
                  const isExpanded = expanded === c.session_id;
                  return (
                    <>
                      <tr
                        key={c.session_id}
                        onClick={() => toggleExpand(c.session_id)}
                        className={`border-t border-brand-stone/10 cursor-pointer transition-colors
                          ${c.lead_captured
                            ? "bg-brand-stone/8 hover:bg-brand-stone/12"
                            : i % 2 === 0
                              ? "bg-brand-slate hover:bg-steel/40"
                              : "bg-steel/20 hover:bg-steel/40"
                          }`}
                      >
                        <td className="px-4 py-3 text-brand-stone whitespace-nowrap text-xs">
                          {fmtDate(c.last_message_at)}
                        </td>
                        <td className="px-4 py-3 text-linen/70 text-xs max-w-[140px] truncate">
                          {shortUrl(c.page_url)}
                        </td>
                        <td className="px-4 py-3 text-linen whitespace-nowrap">
                          {c.lead_name || <span className="text-brand-stone/50 italic">—</span>}
                        </td>
                        <td className="px-4 py-3 text-linen">
                          {c.lead_email
                            ? <a href={`mailto:${c.lead_email}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{c.lead_email}</a>
                            : <span className="text-brand-stone/50 italic">—</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-linen whitespace-nowrap">
                          {c.lead_phone
                            ? <a href={`tel:${c.lead_phone}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{c.lead_phone}</a>
                            : <span className="text-brand-stone/50 italic">—</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-center text-brand-stone">
                          {Array.isArray(c.messages) ? c.messages.length : 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {c.lead_captured
                            ? <span className="text-green-400 text-base leading-none">✓</span>
                            : <span className="text-brand-stone/40 text-base leading-none">—</span>
                          }
                        </td>
                      </tr>

                      {/* Expanded transcript */}
                      {isExpanded && (
                        <tr key={`${c.session_id}-transcript`} className="border-t border-brand-stone/10">
                          <td colSpan={7} className="px-6 py-5 bg-[#1a1e22]">
                            <p className="text-brand-stone text-xs uppercase tracking-widest mb-4">
                              Transcript — {c.session_id.slice(0, 8)}…
                            </p>
                            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-2">
                              {Array.isArray(c.messages) && c.messages.length > 0
                                ? c.messages.map((msg, j) => (
                                    <div
                                      key={j}
                                      style={{
                                        display:        "flex",
                                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                      }}
                                    >
                                      <div
                                        style={{
                                          background:   msg.role === "user" ? "#B8A898" : "#2E3338",
                                          borderRadius: msg.role === "user"
                                            ? "12px 12px 4px 12px"
                                            : "12px 12px 12px 4px",
                                          padding:      "10px 14px",
                                          maxWidth:     "75%",
                                          fontSize:     13,
                                          color:        msg.role === "user" ? "#212529" : "#F0EBE3",
                                          lineHeight:   1.55,
                                          whiteSpace:   "pre-wrap",
                                          wordBreak:    "break-word",
                                          fontFamily:   FONT,
                                        }}
                                      >
                                        {msg.content}
                                      </div>
                                    </div>
                                  ))
                                : <p className="text-brand-stone/50 text-sm italic">No messages.</p>
                              }
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
