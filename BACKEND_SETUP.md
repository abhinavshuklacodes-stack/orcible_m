# Backend setup — Supabase (free, no API costs)

The catalogue's own recommended stack is Postgres + pgvector + Auth + Storage on Supabase. This
app now uses exactly that for real accounts and real project/task storage, replacing the old
browser-only demo. Supabase's free tier covers this comfortably with no credit card and no
cost — there's no separate server to host, and no paid LLM/embedding API required.

Until you finish the steps below, the live site keeps working exactly as it does today (local
demo mode). Nothing breaks in the meantime.

## What you need to provide

Just two values, both free to get:

1. A Supabase account and project (2 minutes, no card required)
2. Two keys from that project, pasted into Vercel's environment variables

That's the whole backend. No OpenAI/Anthropic key, no separate server, no extension.

## Step-by-step

### 1. Create the Supabase project
1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign in with GitHub.
2. **New project** → pick any name (e.g. `orcible`) and a database password (save it somewhere —
   you won't need it day-to-day, but keep it) → choose the region closest to your users → **Create**.
3. Wait ~1–2 minutes for it to finish provisioning.

### 2. Create the tables
1. In the left sidebar, open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy the whole file, paste it into the editor.
3. Click **Run**. You should see "Success. No rows returned."

This creates `workspaces`, `projects`, and `tasks` tables, locks them down with Row Level
Security so every user can only ever see their own data, and sets up a trigger that gives each
new signup a starter workspace and project automatically.

### 3. Get your API keys
1. Left sidebar → **Project Settings** → **API**.
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`).
3. Copy the **anon public** key (a long string). This one is safe to expose in frontend code —
   Row Level Security is what actually protects your data, not keeping this key secret.

### 4. Add them to Vercel
1. Vercel dashboard → your `orcible-m` project → **Settings** → **Environment Variables**.
2. Add:
   - `VITE_SUPABASE_URL` = the Project URL from step 3
   - `VITE_SUPABASE_ANON_KEY` = the anon public key from step 3
3. Save, then **redeploy** (Vercel → Deployments → ⋯ on the latest one → Redeploy).

### 5. (Optional) Local development
Copy `.env.example` to `.env` in the project root and fill in the same two values, so
`npm run dev` also talks to your real backend instead of demo mode.

### 6. Decide on email confirmation
By default, Supabase requires a new user to click a confirmation link in their email before
they can log in. For a client demo this is usually what you want (it's real and free — Supabase
sends the email itself, no setup needed). If you'd rather let people log straight in after
registering (e.g. while testing), turn it off: **Authentication → Providers → Email → "Confirm
email"** toggle.

## What's real now vs. what's still a placeholder

**Real, once the steps above are done:**
- Sign up / log in / log out with actual accounts (Supabase Auth)
- Projects and tasks are stored in Postgres, not just the browser — they'll be there next time
  you log in from any device
- Each account only ever sees its own data (enforced by the database itself, not just the UI)

**Still placeholders (separate, optional work):**
- The Google / Apple / GitHub buttons on the login page — real OAuth needs provider-specific
  setup; GitHub's is free and straightforward, Apple's requires a paid Apple Developer account
- The catalogue's "Memory Pipeline" (auto-extracting decisions/facts from pasted AI
  conversations) — doing this well typically needs an LLM call. I didn't wire up a third-party
  AI API without checking with you first, since that's the one piece that could carry a real
  cost (though there are free tiers, e.g. Google's Gemini API). Tell me if you want this next and
  which option you're OK with.
- Semantic ("find similar") search over memories (pgvector) — this needs embeddings, which again
  usually means an API call. For now there's no memories UI yet to search over; Postgres's
  built-in full-text search is a free alternative when that feature gets built.
- No browser extension, as requested — everything runs through the web app.
