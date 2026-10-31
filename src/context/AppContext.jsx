import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AppContext = createContext(null);
const KEY = 'orcible-frontend-v1';
const demoProjects = [
  { id: 'project-main', name: 'Product launch workspace', tasks: [
    { id: 'task-1', title: 'Outline the launch strategy', provider: 'ChatGPT', included: true, done: true },
    { id: 'task-2', title: 'Research the target audience', provider: 'Claude', included: true, done: false },
    { id: 'task-3', title: 'Draft the product positioning', provider: 'Grok', included: true, done: false },
    { id: 'task-4', title: 'Review the landing page copy', provider: 'Claude', included: true, done: false },
    { id: 'task-5', title: 'Create a launch checklist', provider: 'ChatGPT', included: true, done: false },
    { id: 'task-6', title: 'Summarise research insights', provider: 'Gemini', included: true, done: false },
  ]},
  { id: 'project-research', name: 'Market research', tasks: [
    { id: 'task-r1', title: 'Collect competitor insights', provider: 'Claude', included: true, done: true },
    { id: 'task-r2', title: 'Compare pricing models', provider: 'ChatGPT', included: true, done: false },
  ]},
  { id: 'project-writing', name: 'Content studio', tasks: [
    { id: 'task-w1', title: 'Build the content outline', provider: 'Claude', included: true, done: false },
    { id: 'task-w2', title: 'Write the first draft', provider: 'ChatGPT', included: true, done: false },
  ]},
];
function readState() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function AppProvider({ children }) {
  const saved = useMemo(readState, []);
  const [projects, setProjects] = useState(saved?.projects?.length ? saved.projects : demoProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(saved?.selectedProjectId || demoProjects[0].id);
  const [user, setUser] = useState(saved?.user || null);
  const [theme, setTheme] = useState(saved?.theme || 'light');
  const [toast, setToast] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ projects, selectedProjectId, user, theme })); } catch { /* storage is optional */ } }, [projects, selectedProjectId, user, theme]);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { if (!toast) return undefined; const id = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(id); }, [toast]);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || projects[0];
  const createProject = (name) => {
    const project = { id: `project-${Date.now()}`, name: name.trim(), tasks: [] };
    setProjects((current) => [project, ...current]); setSelectedProjectId(project.id); setToast('Project created. Start by adding your first task.');
  };
  const addTask = (title, provider = 'ChatGPT') => {
    if (!selectedProject || !title.trim()) return;
    const task = { id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, title: title.trim(), provider, included: true, done: false };
    setProjects((current) => current.map((project) => project.id === selectedProject.id ? { ...project, tasks: [...project.tasks, task] } : project));
    setToast('Task added to this project.');
  };
  const updateTask = (taskId, updates) => {
    if (!selectedProject) return;
    setProjects((current) => current.map((project) => project.id === selectedProject.id ? { ...project, tasks: project.tasks.map((task) => task.id === taskId ? { ...task, ...updates } : task) } : project));
  };
  const deleteTask = (taskId) => {
    if (!selectedProject) return;
    setProjects((current) => current.map((project) => project.id === selectedProject.id ? { ...project, tasks: project.tasks.filter((task) => task.id !== taskId) } : project));
  };
  const value = { projects, selectedProject, selectedProjectId, setSelectedProjectId, user, setUser, theme, setTheme, toast, setToast, mobileNavOpen, setMobileNavOpen, createProject, addTask, updateTask, deleteTask };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used within AppProvider'); return value; }
