import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

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

function toDisplayUser(sessionUser) {
  if (!sessionUser) return null;
  const name = sessionUser.user_metadata?.name || (sessionUser.email ? sessionUser.email.split('@')[0] : 'there');
  return { id: sessionUser.id, name, email: sessionUser.email };
}

export function AppProvider({ children }) {
  const saved = useMemo(readState, []);
  const [projects, setProjects] = useState(isSupabaseConfigured ? [] : (saved?.projects?.length ? saved.projects : demoProjects));
  const [selectedProjectId, setSelectedProjectId] = useState(isSupabaseConfigured ? null : (saved?.selectedProjectId || demoProjects[0].id));
  const [user, setUser] = useState(isSupabaseConfigured ? null : (saved?.user || null));
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [dataLoading, setDataLoading] = useState(false);
  const [theme, setTheme] = useState(saved?.theme || 'light');
  const [toast, setToast] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Persist local-mode state only; in Supabase mode, Postgres is the source of truth.
  useEffect(() => {
    if (isSupabaseConfigured) return;
    try { localStorage.setItem(KEY, JSON.stringify({ projects, selectedProjectId, user, theme })); } catch { /* storage is optional */ }
  }, [projects, selectedProjectId, user, theme]);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { if (!toast) return undefined; const id = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(id); }, [toast]);

  const loadData = async (userId) => {
    setDataLoading(true);
    const [{ data: projectRows, error: projectError }, { data: taskRows, error: taskError }] = await Promise.all([
      supabase.from('projects').select('id,name,position').eq('owner_id', userId).order('position', { ascending: true }).order('created_at', { ascending: true }),
      supabase.from('tasks').select('id,project_id,title,provider,included,done,position').eq('owner_id', userId).order('position', { ascending: true }).order('created_at', { ascending: true }),
    ]);
    if (projectError || taskError) { setToast('Could not load your workspace. Check your Supabase setup.'); setDataLoading(false); return; }
    const merged = (projectRows || []).map((project) => ({ ...project, tasks: (taskRows || []).filter((task) => task.project_id === project.id) }));
    setProjects(merged);
    setSelectedProjectId((current) => (current && merged.some((project) => project.id === current)) ? current : merged[0]?.id || null);
    setDataLoading(false);
  };

  // Supabase auth session wiring. No-op entirely when Supabase isn't configured.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setUser(toDisplayUser(session?.user));
      setAuthLoading(false);
      if (session?.user) loadData(session.user.id);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toDisplayUser(session?.user));
      setAuthLoading(false);
      if (session?.user) loadData(session.user.id);
      else { setProjects([]); setSelectedProjectId(null); }
    });
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, []);

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };
  const signUp = async (email, password, name) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet.' };
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    return { error: error?.message, session: data?.session };
  };
  const signOut = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null); setProjects(isSupabaseConfigured ? [] : demoProjects); setSelectedProjectId(isSupabaseConfigured ? null : demoProjects[0].id);
  };

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || projects[0];

  const createProject = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!isSupabaseConfigured) {
      const project = { id: `project-${Date.now()}`, name: trimmed, tasks: [] };
      setProjects((current) => [project, ...current]); setSelectedProjectId(project.id); setToast('Project created. Start by adding your first task.');
      return;
    }
    if (!user) return;
    const { data: workspace } = await supabase.from('workspaces').select('id').eq('owner_id', user.id).limit(1).single();
    if (!workspace) { setToast('No workspace found for your account yet.'); return; }
    const { data, error } = await supabase.from('projects').insert({ workspace_id: workspace.id, owner_id: user.id, name: trimmed }).select('id,name,position').single();
    if (error) { setToast('Could not create the project.'); return; }
    setProjects((current) => [{ ...data, tasks: [] }, ...current]); setSelectedProjectId(data.id); setToast('Project created. Start by adding your first task.');
  };

  const addTask = async (title, provider = 'ChatGPT') => {
    const trimmed = title.trim();
    if (!selectedProject || !trimmed) return;
    if (!isSupabaseConfigured) {
      const task = { id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, title: trimmed, provider, included: true, done: false };
      setProjects((current) => current.map((project) => project.id === selectedProject.id ? { ...project, tasks: [...project.tasks, task] } : project));
      setToast('Task added to this project.');
      return;
    }
    const { data, error } = await supabase.from('tasks').insert({ project_id: selectedProject.id, owner_id: user.id, title: trimmed, provider }).select('id,project_id,title,provider,included,done,position').single();
    if (error) { setToast('Could not add the task.'); return; }
    setProjects((current) => current.map((project) => project.id === selectedProject.id ? { ...project, tasks: [...project.tasks, data] } : project));
    setToast('Task added to this project.');
  };

  const updateTask = async (taskId, updates) => {
    if (!selectedProject) return;
    setProjects((current) => current.map((project) => project.id === selectedProject.id ? { ...project, tasks: project.tasks.map((task) => task.id === taskId ? { ...task, ...updates } : task) } : project));
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('tasks').update(updates).eq('id', taskId);
    if (error) setToast('Could not save that change.');
  };

  const deleteTask = async (taskId) => {
    if (!selectedProject) return;
    setProjects((current) => current.map((project) => project.id === selectedProject.id ? { ...project, tasks: project.tasks.filter((task) => task.id !== taskId) } : project));
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) setToast('Could not delete the task.');
  };

  const value = {
    projects, selectedProject, selectedProjectId, setSelectedProjectId,
    user, setUser, authLoading, dataLoading, isSupabaseConfigured, signIn, signUp, signOut,
    theme, setTheme, toast, setToast, mobileNavOpen, setMobileNavOpen,
    createProject, addTask, updateTask, deleteTask,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used within AppProvider'); return value; }
