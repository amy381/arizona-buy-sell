# Environment Variables

All variables below must be set in **Vercel → Project → Settings → Environment Variables**.
Never commit actual values to the repository.

---

## Required — Core Infrastructure

| Variable | Purpose | Where to get it |
|---|---|---|
| `SUPABASE_URL` | Supabase project REST endpoint | Supabase dashboard → Project → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Full Supabase access (server-only, never expose to client) | Supabase dashboard → Project → Settings → API → service_role key |

## Required — AI Chat Widget & Content Generation

| Variable | Purpose | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Powers the AI chat widget and Content Studio generation | console.anthropic.com → API Keys |

## Required — Admin Dashboard

| Variable | Purpose | Where to get it |
|---|---|---|
| `ADMIN_PASSWORD` | Password for /admin/* pages (Nestimate, Chats, Content Studio) | Set to any strong password you choose |

## Required — Nestimate (Home Value Tool)

| Variable | Purpose | Where to get it |
|---|---|---|
| `NESTIMATE_API_KEY` | Property valuation API for the Home Value / Nestimate form | Your Nestimate API provider account |

## Required — Lead Forwarding

| Variable | Purpose | Where to get it |
|---|---|---|
| `FOLLOW_UP_BOSS_API_KEY` | Forwards chat leads and Nestimate submissions to Follow Up Boss CRM | Follow Up Boss → Admin → API → API Keys |

## Required — Email Notifications

| Variable | Purpose | Where to get it |
|---|---|---|
| `RESEND_API_KEY` | Sends email notifications for new leads and Nestimate submissions | resend.com → API Keys |

## Required — YouTube

| Variable | Purpose | Where to get it |
|---|---|---|
| `YOUTUBE_API_KEY` | Fetches latest videos for the Watch & Learn section and Follow Along page | Google Cloud Console → APIs & Services → Credentials → API Key (enable YouTube Data API v3) |

## Optional — Analytics

| Variable | Purpose | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`) | GA4 → Admin → Data Streams → Web stream → Measurement ID |

---

## Notes

- Variables prefixed `NEXT_PUBLIC_` are exposed to the browser. All others are server-only.
- `SUPABASE_SERVICE_ROLE_KEY` has full database access — treat it like a password.
- After adding or changing any variable in Vercel, trigger a new deployment for the change to take effect.
