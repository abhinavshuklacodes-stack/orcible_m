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

## Backend integration notes

This is a frontend implementation. Replace demo authentication with your authentication API and OAuth credentials. Connect the planner to your AI/workflow API. The context handoff is a generated project/task summary; it does not automatically import private chat history from external AI providers.
