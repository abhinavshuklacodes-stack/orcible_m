export const providers = [
  { name: 'ChatGPT', file: 'chatgpt.png', url: 'https://chatgpt.com/' },
  { name: 'Claude', file: 'claude.jpg', url: 'https://claude.ai/' },
  { name: 'Grok', file: 'grok.png', url: 'https://grok.com/' },
  { name: 'Gemini', file: 'gemini.png', url: 'https://gemini.google.com/app' },
  { name: 'DeepSeek', file: 'deepseek.png', url: 'https://chat.deepseek.com/' },
  { name: 'Meta AI', file: 'meta.png', url: 'https://www.meta.ai/' },
];
export function buildContextMarkdown(project, userName = 'Guest') {
  const tasks = project?.tasks || [];
  const selected = tasks.filter((task) => task.included);
  const completed = tasks.filter((task) => task.done);
  return [
    '# Orcible context bundle', '', `**Project:** ${project?.name || 'Untitled project'}`, `**Prepared for:** ${userName}`, `**Exported:** ${new Date().toLocaleString()}`, '',
    '## Project overview', `- Total tasks: ${tasks.length}`, `- Completed tasks: ${completed.length}`, `- Tasks included in this handoff: ${selected.length}`, '',
    '## Context and task history', ...selected.map((task, index) => `${index + 1}. **${task.title}** — ${task.provider} — ${task.done ? 'Completed' : 'In progress'}`), '',
    '## Instructions for the next AI', 'Continue from the project context above. Preserve decisions already made, avoid repeating completed work, and ask for missing information instead of inventing it.', '',
    '---', 'Generated with Orcible. This file is a portable context summary; it does not contain private conversations from external AI providers.',
  ].join('\n');
}
