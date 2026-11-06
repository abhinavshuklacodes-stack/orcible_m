# Orcible frontend

Responsive React + Tailwind CSS frontend based on the supplied Orcible wireframes.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Included functionality

- Responsive project dashboard with mobile sidebar and light/dark themes.
- Create and switch projects; add, complete, include/exclude, and delete tasks.
- Projects, tasks, theme, and local demo session persist in browser `localStorage`.
- Export selected tasks as a Markdown context bundle.
- Provider shortcuts for ChatGPT, Claude, Grok, Gemini, DeepSeek, and Meta AI. A click downloads the context file and opens the selected provider in a new tab.
- Login and registration forms with validation and a local demo session.
- Workflow planner preview that can add the three suggested tasks to the current project.

## Assets

Supplied logos are in `public/assets/`: `orcible.png`, `chatgpt.png`, `claude.jpg`, `grok.png`, `meta.png`, and `gemini.png`.

Add the DeepSeek logo as `public/assets/deepseek.png`. Until it is added, the UI shows a letter fallback.

## Backend

Real accounts and a real database are wired in via [Supabase](https://supabase.com) (free tier — no credit card, no per-request API costs). Until it's configured, the app automatically falls back to the original local-only demo mode, so nothing breaks in the meantime.

**See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for the exact steps and what you need to provide.**

Email/password sign-up and login are fully real once connected. The Google/Apple/GitHub buttons are still placeholders — wiring up real OAuth is a separate, optional step (GitHub's is free; Apple's requires a paid Apple Developer account).
