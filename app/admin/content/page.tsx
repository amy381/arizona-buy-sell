"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";

const FONT  = "var(--font-montserrat), 'Helvetica Neue', Helvetica, Arial, sans-serif";
const LINEN = "#F0EBE3";
const STONE = "#B8A898";
const SLATE = "#212529";
const STEEL = "#2E3338";
const DARK  = "#1a1e22";

type TabId = "blog" | "listing" | "caption" | "market" | "newsletter";

const TABS: { id: TabId; label: string }[] = [
  { id: "blog",       label: "Blog Manager"        },
  { id: "listing",    label: "Listing Description" },
  { id: "caption",    label: "Social Caption"      },
  { id: "market",     label: "Market Update"       },
  { id: "newsletter", label: "Newsletter"          },
];

interface Post {
  id:           number;
  slug:         string;
  title:        string;
  excerpt:      string;
  published:    boolean;
  published_at: string | null;
  created_at:   string;
}

const inputClass =
  "w-full bg-brand-slate border border-brand-stone/30 rounded px-4 py-2.5 text-linen text-sm " +
  "placeholder:text-brand-stone/50 focus:outline-none focus:border-brand-stone transition-colors";

const labelClass = "block text-brand-stone text-xs uppercase tracking-widest mb-1.5";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

async function apiBlog(
  action: string,
  data: Record<string, unknown> = {}
): Promise<Record<string, unknown>> {
  const res = await fetch("/api/admin/blog", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ action, ...data }),
  });
  const json = await res.json() as Record<string, unknown>;
  if (!res.ok) throw new Error((json.error as string) || `HTTP ${res.status}`);
  return json;
}

async function apiGenerate(
  type: string,
  inputs: Record<string, string>
): Promise<string> {
  const res = await fetch("/api/content/generate", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ type, inputs }),
  });
  const json = await res.json() as { text?: string; error?: string };
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json.text ?? "";
}

// ── Reusable generator tab ────────────────────────────────────────────────────

interface Field {
  key:         string;
  label:       string;
  placeholder?: string;
  multiline?:  boolean;
  type?:       "select";
  options?:    string[];
}

interface GeneratorTabProps {
  title:      string;
  description:string;
  fields:     Field[];
  inputs:     Record<string, string>;
  setInputs:  (vals: Record<string, string>) => void;
  result:     string;
  setResult:  (v: string) => void;
  loading:    boolean;
  error:      string;
  copied:     boolean;
  onGenerate: () => void;
  onCopy:     () => void;
}

function GeneratorTab({
  title, description, fields, inputs, setInputs,
  result, setResult, loading, error, copied, onGenerate, onCopy,
}: GeneratorTabProps) {
  const canGenerate = fields.some((f) => (inputs[f.key] ?? "").trim());

  return (
    <div className="max-w-[820px]">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: FONT, color: LINEN, fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>
          {title}
        </h2>
        <p style={{ fontFamily: FONT, color: STONE, fontSize: 14, margin: 0 }}>{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {fields.map((field) => (
          <div key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
            <label className={labelClass}>{field.label}</label>
            {field.type === "select" ? (
              <select
                className={inputClass}
                value={inputs[field.key] ?? ""}
                onChange={(e) => setInputs({ [field.key]: e.target.value })}
                style={{ cursor: "pointer" }}
              >
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt} style={{ background: STEEL }}>{opt}</option>
                ))}
              </select>
            ) : field.multiline ? (
              <textarea
                className={inputClass}
                rows={3}
                placeholder={field.placeholder}
                value={inputs[field.key] ?? ""}
                onChange={(e) => setInputs({ [field.key]: e.target.value })}
                style={{ resize: "vertical" }}
              />
            ) : (
              <input
                className={inputClass}
                placeholder={field.placeholder}
                value={inputs[field.key] ?? ""}
                onChange={(e) => setInputs({ [field.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !canGenerate}
        style={{
          background:  STONE,
          color:       SLATE,
          fontFamily:  FONT,
          fontSize:    13,
          fontWeight:  600,
          padding:     "12px 28px",
          borderRadius:8,
          border:      "none",
          cursor:      loading || !canGenerate ? "not-allowed" : "pointer",
          opacity:     loading || !canGenerate ? 0.5 : 1,
          marginBottom:24,
          transition:  "background 200ms",
        }}
      >
        {loading ? "Generating…" : "Generate"}
      </button>

      {error && (
        <p style={{ fontFamily: FONT, color: STONE, fontSize: 13, marginBottom: 16 }}>{error}</p>
      )}

      {result && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>Result</label>
            <button
              onClick={onCopy}
              style={{
                background:   "none",
                border:       `1px solid ${STONE}`,
                color:        copied ? "#86efac" : STONE,
                fontFamily:   FONT,
                fontSize:     11,
                padding:      "4px 14px",
                borderRadius: 20,
                cursor:       "pointer",
                transition:   "color 200ms",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            className={inputClass}
            rows={16}
            value={result}
            onChange={(e) => setResult(e.target.value)}
            style={{ resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
          />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminContentPage() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [password,       setPassword]       = useState("");
  const [authed,         setAuthed]         = useState(false);
  const [authError,      setAuthError]      = useState("");
  const [authLoading,    setAuthLoading]    = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Try cookie session on mount
  useEffect(() => {
    apiBlog("list")
      .then((data) => {
        setPosts((data.posts as Post[]) ?? []);
        setAuthed(true);
      })
      .catch(() => {
        // 401 or error — show login form
      })
      .finally(() => setSessionChecked(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabId>("blog");

  // ── Blog Manager ─────────────────────────────────────────────────────────
  const [posts,        setPosts]        = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError,   setPostsError]   = useState("");
  const [blogView,     setBlogView]     = useState<"list" | "edit">("list");
  const [editPost,     setEditPost]     = useState<Post | null>(null);
  const [fTitle,       setFTitle]       = useState("");
  const [fExcerpt,     setFExcerpt]     = useState("");
  const [fBody,        setFBody]        = useState("");
  const [fTopic,       setFTopic]       = useState("");
  const [fKeywords,    setFKeywords]    = useState("");
  const [bodyLoading,  setBodyLoading]  = useState(false);
  const [generating,   setGenerating]   = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [blogMsg,      setBlogMsg]      = useState("");

  // ── Generator tabs ───────────────────────────────────────────────────────
  const [listingInputs,    setListingInputs]    = useState({ address: "", beds: "", baths: "", sqft: "", features: "" });
  const [listingResult,    setListingResult]    = useState("");
  const [captionInputs,    setCaptionInputs]    = useState({ topic: "", platform: "Instagram", tone: "" });
  const [captionResult,    setCaptionResult]    = useState("");
  const [marketInputs,     setMarketInputs]     = useState({ area: "", timeframe: "", highlights: "" });
  const [marketResult,     setMarketResult]     = useState("");
  const [newsletterInputs, setNewsletterInputs] = useState({ topic: "", audience: "", highlights: "" });
  const [newsletterResult, setNewsletterResult] = useState("");
  const [genLoading,       setGenLoading]       = useState(false);
  const [genError,         setGenError]         = useState("");
  const [copied,           setCopied]           = useState(false);

  // ── Login ─────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const sessionRes = await fetch("/api/admin/session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });
      if (sessionRes.status === 401) { setAuthError("Incorrect password."); return; }
      if (!sessionRes.ok) { setAuthError("Something went wrong. Try again."); return; }
      const data = await apiBlog("list");
      setPosts((data.posts as Post[]) ?? []);
      setAuthed(true);
    } catch {
      setAuthError("Something went wrong. Try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  // ── Blog: load posts ──────────────────────────────────────────────────────
  async function loadPosts() {
    setPostsLoading(true);
    setPostsError("");
    try {
      const data = await apiBlog("list");
      setPosts((data.posts as Post[]) ?? []);
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : "Failed to load posts.");
    } finally {
      setPostsLoading(false);
    }
  }

  // ── Blog: tab switch ──────────────────────────────────────────────────────
  function handleTabChange(tabId: TabId) {
    setActiveTab(tabId);
    setGenError("");
    setCopied(false);
    if (tabId === "blog") loadPosts();
  }

  // ── Blog: open editor ─────────────────────────────────────────────────────
  function openCreate() {
    setEditPost(null);
    setFTitle(""); setFExcerpt(""); setFBody(""); setFTopic(""); setFKeywords("");
    setBlogMsg("");
    setBlogView("edit");
  }

  function openEdit(post: Post) {
    setEditPost(post);
    setFTitle(post.title);
    setFExcerpt(post.excerpt || "");
    setFBody("");
    setFTopic(""); setFKeywords("");
    setBlogMsg("");
    setBlogView("edit");
    fetchPostBody(post.id);
  }

  async function fetchPostBody(id: number) {
    setBodyLoading(true);
    try {
      const data = await apiBlog("get", { id });
      const post = data.post as (Post & { content: string });
      if (post?.content !== undefined) setFBody(post.content);
    } catch {
      // fail silently — user can type body manually
    } finally {
      setBodyLoading(false);
    }
  }

  // ── Blog: generate draft ──────────────────────────────────────────────────
  async function handleGenerate() {
    if (!fTitle && !fTopic) return;
    setGenerating(true);
    setBlogMsg("");
    try {
      const text = await apiGenerate("blog_post", {
        topic:    fTopic || fTitle,
        keywords: fKeywords,
        tone:     "warm, professional, informative",
      });
      setFBody(text);
    } catch (err) {
      setBlogMsg(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Blog: save ───────────────────────────────────────────────────────────
  async function handleSave(publish: boolean) {
    if (!fTitle || !fBody) { setBlogMsg("Title and body are required."); return; }
    setSaving(true);
    setBlogMsg("");
    try {
      if (editPost) {
        await apiBlog("update", {
          id:        editPost.id,
          title:     fTitle,
          excerpt:   fExcerpt,
          body:      fBody,
          published: publish,
        });
      } else {
        await apiBlog("create", {
          title:     fTitle,
          excerpt:   fExcerpt,
          body:      fBody,
          published: publish,
        });
      }
      setBlogMsg(publish ? "Published!" : "Saved as draft.");
      await loadPosts();
      setBlogView("list");
    } catch (err) {
      setBlogMsg(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  // ── Blog: toggle publish ──────────────────────────────────────────────────
  async function togglePublish(post: Post) {
    try {
      await apiBlog("update", { id: post.id, published: !post.published });
      await loadPosts();
    } catch (err) {
      console.error("[Content Admin] togglePublish error:", err);
    }
  }

  // ── Blog: delete ─────────────────────────────────────────────────────────
  async function deletePost(post: Post) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await apiBlog("delete", { id: post.id });
      await loadPosts();
    } catch (err) {
      console.error("[Content Admin] delete error:", err);
    }
  }

  // ── Generator: generic ───────────────────────────────────────────────────
  async function generate(
    type: string,
    inputs: Record<string, string>,
    setResult: (v: string) => void
  ) {
    setGenLoading(true);
    setGenError("");
    setCopied(false);
    try {
      const text = await apiGenerate(type, inputs);
      setResult(text);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenLoading(false);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Render: Loading (session check in progress) ───────────────────────────
  if (!sessionChecked) {
    return (
      <>
        <AdminNav tabs={TABS} activeTab={activeTab} onTabChange={(id) => handleTabChange(id as TabId)} />
        <div className="min-h-screen bg-brand-slate flex items-center justify-center">
          <p className="text-brand-stone text-sm" style={{ fontFamily: FONT }}>Loading…</p>
        </div>
      </>
    );
  }

  // ── Render: Login ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <AdminNav tabs={TABS} activeTab={activeTab} onTabChange={(id) => handleTabChange(id as TabId)} />
        <div className="min-h-screen bg-brand-slate flex items-center justify-center px-6">
          <form
            onSubmit={handleLogin}
            className="bg-steel rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5"
            style={{ fontFamily: FONT }}
          >
            <p className="text-linen font-medium text-[18px]">Content Admin</p>
            <div>
              <label className={labelClass}>Password</label>
              <input
                className={inputClass}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {authError && <p className="text-brand-stone text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="bg-brand-stone text-brand-slate text-sm uppercase tracking-widest font-medium
                         py-3 rounded hover:bg-linen transition-colors disabled:opacity-60"
            >
              {authLoading ? "Checking…" : "Sign In"}
            </button>
          </form>
        </div>
      </>
    );
  }

  // ── Render: Dashboard ─────────────────────────────────────────────────────
  return (
    <>
      <AdminNav tabs={TABS} activeTab={activeTab} onTabChange={(id) => handleTabChange(id as TabId)} />
      <div className="min-h-screen bg-brand-slate" style={{ fontFamily: FONT }}>

        {/* ── Tab content ── */}
        <div style={{ padding: "32px" }} className="max-w-[1240px] mx-auto">

          {/* ── BLOG MANAGER ── */}
          {activeTab === "blog" && (
            <>
              {blogView === "list" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-brand-stone text-sm">
                      {postsLoading ? "Loading…" : `${posts.length} post${posts.length !== 1 ? "s" : ""}`}
                    </p>
                    <button
                      onClick={openCreate}
                      style={{
                        background:   STONE,
                        color:        SLATE,
                        fontFamily:   FONT,
                        fontSize:     13,
                        fontWeight:   600,
                        padding:      "10px 22px",
                        borderRadius: 8,
                        border:       "none",
                        cursor:       "pointer",
                        transition:   "background 200ms",
                      }}
                      className="hover:bg-linen"
                    >
                      + New Post
                    </button>
                  </div>

                  {postsError && (
                    <p className="text-brand-stone text-sm mb-4">{postsError}</p>
                  )}

                  {!postsLoading && posts.length === 0 && (
                    <p className="text-brand-stone text-sm">No posts yet. Create one above.</p>
                  )}

                  {posts.length > 0 && (
                    <div className="rounded-xl border border-brand-stone/20 overflow-hidden">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr style={{ background: DARK }} className="text-brand-stone text-xs uppercase tracking-widest">
                            <th className="px-4 py-3 text-left font-medium">Title</th>
                            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Created</th>
                            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Published</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post, i) => (
                            <tr
                              key={post.id}
                              style={{
                                borderTop: "1px solid rgba(184,168,152,.1)",
                                background: i % 2 === 0 ? SLATE : `${STEEL}80`,
                              }}
                            >
                              <td className="px-4 py-3 text-linen font-medium max-w-[280px]">
                                <span className="truncate block">{post.title}</span>
                                <span className="text-brand-stone/60 text-xs font-normal">
                                  /blog/{post.slug}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-brand-stone text-xs whitespace-nowrap">
                                {fmtDate(post.created_at)}
                              </td>
                              <td className="px-4 py-3 text-brand-stone text-xs whitespace-nowrap">
                                {fmtDate(post.published_at)}
                              </td>
                              <td className="px-4 py-3">
                                <span style={{
                                  display:    "inline-block",
                                  padding:    "3px 10px",
                                  borderRadius:20,
                                  fontSize:   11,
                                  fontWeight: 600,
                                  background: post.published
                                    ? "rgba(34,197,94,.15)"
                                    : "rgba(184,168,152,.15)",
                                  color: post.published ? "#86efac" : STONE,
                                }}>
                                  {post.published ? "Published" : "Draft"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => openEdit(post)}
                                    style={{ background: "none", border: "none", color: STONE, fontFamily: FONT, fontSize: 12, cursor: "pointer", padding: 0 }}
                                    className="hover:text-linen transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => togglePublish(post)}
                                    style={{ background: "none", border: "none", color: STONE, fontFamily: FONT, fontSize: 12, cursor: "pointer", padding: 0 }}
                                    className="hover:text-linen transition-colors"
                                  >
                                    {post.published ? "Unpublish" : "Publish"}
                                  </button>
                                  <button
                                    onClick={() => deletePost(post)}
                                    style={{ background: "none", border: "none", color: "rgba(248,113,113,.7)", fontFamily: FONT, fontSize: 12, cursor: "pointer", padding: 0 }}
                                    className="hover:text-red-400 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Edit / Create form ── */
                <div className="max-w-[860px]">
                  <div className="flex items-center justify-between mb-8">
                    <h2 style={{ color: LINEN, fontFamily: FONT, fontSize: 20, fontWeight: 600, margin: 0 }}>
                      {editPost ? "Edit Post" : "New Post"}
                    </h2>
                    <button
                      onClick={() => setBlogView("list")}
                      style={{ background: "none", border: "none", color: STONE, fontFamily: FONT, fontSize: 13, cursor: "pointer" }}
                      className="hover:text-linen transition-colors"
                    >
                      ← Back to list
                    </button>
                  </div>

                  <div className="mb-5">
                    <label className={labelClass}>Title *</label>
                    <input
                      className={inputClass}
                      value={fTitle}
                      onChange={(e) => setFTitle(e.target.value)}
                      placeholder="Post title"
                    />
                  </div>

                  <div className="mb-5">
                    <label className={labelClass}>Excerpt</label>
                    <input
                      className={inputClass}
                      value={fExcerpt}
                      onChange={(e) => setFExcerpt(e.target.value)}
                      placeholder="Brief description shown on the blog index"
                    />
                  </div>

                  {/* AI generation panel */}
                  <div style={{ background: STEEL, borderRadius: 10, padding: "20px 22px", marginBottom: 20 }}>
                    <p style={{
                      color:         STONE,
                      fontFamily:    FONT,
                      fontSize:      12,
                      textTransform: "uppercase",
                      letterSpacing: ".2em",
                      margin:        "0 0 14px",
                    }}>
                      AI Draft Generator
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={labelClass}>Topic</label>
                        <input
                          className={inputClass}
                          value={fTopic}
                          onChange={(e) => setFTopic(e.target.value)}
                          placeholder="e.g. buying vs renting in Kingman"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Keywords (optional)</label>
                        <input
                          className={inputClass}
                          value={fKeywords}
                          onChange={(e) => setFKeywords(e.target.value)}
                          placeholder="e.g. mortgage, down payment"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={generating || (!fTitle && !fTopic)}
                      style={{
                        background:   STONE,
                        color:        SLATE,
                        fontFamily:   FONT,
                        fontSize:     13,
                        fontWeight:   600,
                        padding:      "10px 22px",
                        borderRadius: 8,
                        border:       "none",
                        cursor:       generating || (!fTitle && !fTopic) ? "not-allowed" : "pointer",
                        opacity:      generating || (!fTitle && !fTopic) ? 0.5 : 1,
                        transition:   "background 200ms",
                      }}
                      className="hover:bg-linen"
                    >
                      {generating ? "Generating…" : "Generate Draft"}
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className={labelClass}>Body (Markdown) *</label>
                    <textarea
                      className={inputClass}
                      rows={22}
                      value={fBody}
                      onChange={(e) => setFBody(e.target.value)}
                      disabled={bodyLoading}
                      placeholder={bodyLoading ? "Loading post content…" : "Write in Markdown, or generate a draft above and edit here…"}
                      style={{ resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
                    />
                  </div>

                  {blogMsg && (
                    <p style={{
                      color:        blogMsg.includes("!") ? "#86efac" : STONE,
                      fontFamily:   FONT,
                      fontSize:     13,
                      marginBottom: 16,
                    }}>
                      {blogMsg}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      style={{
                        border:       `1.5px solid ${STONE}`,
                        background:   "none",
                        color:        LINEN,
                        fontFamily:   FONT,
                        fontSize:     13,
                        padding:      "10px 22px",
                        borderRadius: 8,
                        cursor:       saving ? "not-allowed" : "pointer",
                        opacity:      saving ? 0.6 : 1,
                      }}
                    >
                      {saving ? "Saving…" : "Save as Draft"}
                    </button>
                    <button
                      onClick={() => handleSave(true)}
                      disabled={saving}
                      style={{
                        background:   STONE,
                        color:        SLATE,
                        fontFamily:   FONT,
                        fontSize:     13,
                        fontWeight:   600,
                        padding:      "10px 22px",
                        borderRadius: 8,
                        border:       "none",
                        cursor:       saving ? "not-allowed" : "pointer",
                        opacity:      saving ? 0.6 : 1,
                        transition:   "background 200ms",
                      }}
                      className="hover:bg-linen"
                    >
                      {saving ? "Publishing…" : "Publish"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── LISTING DESCRIPTION ── */}
          {activeTab === "listing" && (
            <GeneratorTab
              title="Listing Description"
              description="Generate a compelling MLS listing description from property details."
              fields={[
                { key: "address",  label: "Address",      placeholder: "123 Main St, Kingman AZ" },
                { key: "beds",     label: "Bedrooms",     placeholder: "3" },
                { key: "baths",    label: "Bathrooms",    placeholder: "2" },
                { key: "sqft",     label: "Sq Ft",        placeholder: "1,450" },
                { key: "features", label: "Key Features", placeholder: "Mountain views, RV parking, updated kitchen…", multiline: true },
              ]}
              inputs={listingInputs}
              setInputs={(vals) => setListingInputs((prev) => ({ ...prev, ...vals }))}
              result={listingResult}
              setResult={setListingResult}
              loading={genLoading}
              error={genError}
              copied={copied}
              onGenerate={() => generate("listing_description", listingInputs, setListingResult)}
              onCopy={() => copyToClipboard(listingResult)}
            />
          )}

          {/* ── SOCIAL CAPTION ── */}
          {activeTab === "caption" && (
            <GeneratorTab
              title="Social Caption"
              description="Generate an engaging caption for Instagram, Facebook, or TikTok."
              fields={[
                { key: "topic",    label: "Topic",    placeholder: "New listing in Fort Mohave with Colorado River views" },
                { key: "platform", label: "Platform", type: "select", options: ["Instagram", "Facebook", "TikTok"] },
                { key: "tone",     label: "Tone (optional)", placeholder: "Excited, professional, conversational…" },
              ]}
              inputs={captionInputs}
              setInputs={(vals) => setCaptionInputs((prev) => ({ ...prev, ...vals }))}
              result={captionResult}
              setResult={setCaptionResult}
              loading={genLoading}
              error={genError}
              copied={copied}
              onGenerate={() => generate("social_caption", captionInputs, setCaptionResult)}
              onCopy={() => copyToClipboard(captionResult)}
            />
          )}

          {/* ── MARKET UPDATE ── */}
          {activeTab === "market" && (
            <GeneratorTab
              title="Market Update"
              description="Generate a real estate market update for your blog or newsletter."
              fields={[
                { key: "area",       label: "Area",            placeholder: "Kingman, AZ" },
                { key: "timeframe",  label: "Timeframe",       placeholder: "Q2 2026 or Spring 2026" },
                { key: "highlights", label: "Data / Highlights", placeholder: "Median price $295k, inventory down 12%…", multiline: true },
              ]}
              inputs={marketInputs}
              setInputs={(vals) => setMarketInputs((prev) => ({ ...prev, ...vals }))}
              result={marketResult}
              setResult={setMarketResult}
              loading={genLoading}
              error={genError}
              copied={copied}
              onGenerate={() => generate("market_update", marketInputs, setMarketResult)}
              onCopy={() => copyToClipboard(marketResult)}
            />
          )}

          {/* ── NEWSLETTER ── */}
          {activeTab === "newsletter" && (
            <GeneratorTab
              title="Newsletter"
              description="Generate a client newsletter with market insights and tips."
              fields={[
                { key: "topic",      label: "Main Topic",          placeholder: "Spring buying season in Mohave County" },
                { key: "audience",   label: "Audience",            placeholder: "Past clients and prospective buyers" },
                { key: "highlights", label: "Sections to Include", placeholder: "Market update, first-time buyer tip, featured neighborhood…", multiline: true },
              ]}
              inputs={newsletterInputs}
              setInputs={(vals) => setNewsletterInputs((prev) => ({ ...prev, ...vals }))}
              result={newsletterResult}
              setResult={setNewsletterResult}
              loading={genLoading}
              error={genError}
              copied={copied}
              onGenerate={() => generate("newsletter", newsletterInputs, setNewsletterResult)}
              onCopy={() => copyToClipboard(newsletterResult)}
            />
          )}

        </div>
      </div>
    </>
  );
}
