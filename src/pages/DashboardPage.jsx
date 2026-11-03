import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Check, Circle, FileText, Plus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { buildContextMarkdown, providers } from '../data.js';
import Topbar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ProviderLogo from '../components/ProviderLogo.jsx';
import Modal from '../components/Modal.jsx';
import Toast from '../components/Toast.jsx';

function downloadContext(name, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function slugify(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project'; }

export default function DashboardPage() {
  const navigate = useNavigate();
  const { selectedProject, user, projects, createProject, addTask, updateTask, deleteTask, setToast } = useApp();
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProvider, setNewTaskProvider] = useState('ChatGPT');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [providerModal, setProviderModal] = useState(null);
  const tasks = selectedProject?.tasks || [];
  const includedCount = useMemo(() => tasks.filter((task) => task.included).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const progress = tasks.length ? Math.round(completedCount / tasks.length * 100) : 0;

  const exportContext = () => {
    if (!selectedProject || !includedCount) { setToast('Select at least one task to export its context.'); return; }
    downloadContext(`orcible-${slugify(selectedProject.name)}-context.md`, buildContextMarkdown(selectedProject, user?.name || 'Guest'));
    setToast('Your context file has been downloaded.');
  };
  const openProvider = (provider) => {
    if (!selectedProject || !includedCount) { setToast('Select at least one task before switching tools.'); return; }
    // Launch the selected destination directly from the click, then download the handoff file.
    window.open(provider.url, '_blank', 'noopener,noreferrer');
    downloadContext(`orcible-${slugify(selectedProject.name)}-context.md`, buildContextMarkdown(selectedProject, user?.name || 'Guest'));
    setProviderModal(provider);
  };
  const submitProject = (event) => {
    event.preventDefault(); if (!projectName.trim()) return;
    createProject(projectName); setProjectName(''); setNewProjectOpen(false);
  };
  const submitTask = (event) => {
    event.preventDefault(); if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle, newTaskProvider); setNewTaskTitle(''); setShowTaskForm(false);
  };
  const toggleAll = () => {
    const include = includedCount !== tasks.length;
    tasks.forEach((task) => updateTask(task.id, { included: include }));
  };

  return <div className="app-shell">
    <Topbar />
    <div className="dashboard-layout">
      <Sidebar onCreateProject={() => setNewProjectOpen(true)} />
      <main className="main-content"><div className="main-inner">
        <section className="welcome-section"><div className="welcome-copy"><div className="welcome-kicker"><span className="status-dot" /> YOUR WORKSPACE</div><h1>Switch tools<br className="mobile-break" /> without losing context.</h1><p>Start once. Switch context. Keep context.</p></div>
          <div className="welcome-actions"><div className="project-summary"><span>{projects.length}</span><small>active projects</small></div></div>
        </section>

        <div className="dashboard-grid">
          <section className="panel tasks-panel">
            <div className="panel-heading"><div><span className="eyebrow">CURRENT PROJECT · HI {user?.name || 'THERE'}</span><h2>{selectedProject?.name || 'Choose a project'}</h2><p className="panel-subtitle">Choose the tasks you want to carry into your next AI tool.</p></div><button className="button button-ghost button-sm" onClick={() => setShowTaskForm((value) => !value)}><Plus size={15} /> Add task</button></div>
            <div className="progress-strip"><div className="progress-copy"><span>{completedCount} of {tasks.length} completed</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
            {showTaskForm && <form className="new-task-form" onSubmit={submitTask}><input className="field-input" value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="What needs to get done?" autoFocus aria-label="New task name" /><select className="field-select" value={newTaskProvider} onChange={(event) => setNewTaskProvider(event.target.value)} aria-label="AI provider">{providers.map((provider) => <option key={provider.name}>{provider.name}</option>)}</select><button className="button button-dark button-sm" type="submit">Add</button><button className="icon-button" type="button" onClick={() => setShowTaskForm(false)} aria-label="Cancel adding task"><X size={17} /></button></form>}
            <div className="task-list-heading"><span>PROJECT TASKS <span className="count-pill">{tasks.length}</span></span><button className="text-button" onClick={toggleAll}>{includedCount === tasks.length ? 'Deselect all' : 'Select all'}</button></div>
            <div className="task-list">{tasks.length ? tasks.map((task) => {
              const provider = providers.find((item) => item.name === task.provider) || providers[0];
              return <div className={`task-row ${task.done ? 'task-row-done' : ''}`} key={task.id}>
                <button className={`task-done-toggle ${task.done ? 'is-done' : ''}`} onClick={() => updateTask(task.id, { done: !task.done })} aria-label={task.done ? `Mark ${task.title} as not completed` : `Mark ${task.title} as completed`}>{task.done ? <Check size={14} /> : <Circle size={17} />}</button>
                <div className="task-copy"><span className="task-title">{task.title}</span><span className="task-meta"><span className="provider-mini"><ProviderLogo provider={provider} size="sm" />{task.provider}</span><span className="task-separator">·</span><span>{task.done ? 'Completed' : 'In progress'}</span></span></div>
                <label className="include-checkbox" title="Include this task in the context file"><input type="checkbox" checked={task.included} onChange={(event) => updateTask(task.id, { included: event.target.checked })} /><span className="custom-checkbox"><Check size={12} /></span><span className="sr-only">Include in context</span></label>
                <button className="task-delete" title="Delete task" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task.id)}><Trash2 size={15} /></button>
              </div>;
            }) : <div className="empty-state"><FileText size={25} /><strong>No tasks in this project yet</strong><span>Add a task to start building your context.</span><button className="button button-outline button-sm" onClick={() => setShowTaskForm(true)}><Plus size={14} /> Add your first task</button></div>}</div>
            <div className="context-bar"><div className="context-bar-copy"><span className="context-icon"><FileText size={16} /></span><span><strong>{includedCount} tasks selected</strong><small>Your context file will include selected tasks only.</small></span></div><button className="button button-dark button-sm" onClick={exportContext} disabled={!includedCount}><ArrowDownToLine size={15} /> Export context</button></div>
          </section>

          <section className="panel chat-card">
            <div className="chat-card-top">
              <div><h2 className="chat-card-title">Plan your next move.</h2><p>Turn a rough idea into a clear workflow, then keep every step connected.</p></div>
              <button className="button button-dark" onClick={() => navigate('/planner')}>Chat with Orcible <ArrowUpRight size={16} /></button>
            </div>
            <div className="tools-section">
              <p className="tools-tagline">Direct jump on tools, in any conversation, and bring your context.</p>
              <div className="provider-list">{providers.map((provider) => <button className="provider-row" key={provider.name} onClick={() => openProvider(provider)}><ProviderLogo provider={provider} size="lg" /><span>{provider.name}</span></button>)}</div>
              <div className="tools-note"><ArrowDownToLine size={14} /><span>Orcible downloads your context file and opens the selected tool.</span></div>
            </div>
          </section>
        </div>
        <footer className="main-footer"><span>© 2026 Orcible. All rights reserved.</span><span>Keep the context. Keep moving.</span></footer>
      </div></main>
    </div>
    {newProjectOpen && <Modal title="Create a project" description="Give this workspace a name you’ll recognise." onClose={() => setNewProjectOpen(false)}><form className="modal-form" onSubmit={submitProject}><label className="field-label" htmlFor="project-name">Project name</label><input id="project-name" className="field-input" placeholder="e.g. Website redesign" value={projectName} onChange={(event) => setProjectName(event.target.value)} autoFocus maxLength={60} /><div className="modal-actions"><button type="button" className="button button-ghost" onClick={() => setNewProjectOpen(false)}>Cancel</button><button type="submit" className="button button-dark" disabled={!projectName.trim()}>Create project</button></div></form></Modal>}
    {providerModal && <Modal title={`${providerModal.name} is ready`} description="Your portable project context was downloaded." onClose={() => setProviderModal(null)}><div className="handoff-message"><span className="handoff-logo"><ProviderLogo provider={providerModal} size="lg" /></span><div><strong>Continue in {providerModal.name}</strong><p>Open the downloaded <code>.md</code> file and attach or paste it into your new conversation to continue with the same context.</p></div></div><div className="modal-actions"><button className="button button-outline" onClick={() => downloadContext(`orcible-${slugify(selectedProject?.name || 'project')}-context.md`, buildContextMarkdown(selectedProject, user?.name || 'Guest'))}>Download again</button><button className="button button-dark" onClick={() => setProviderModal(null)}>Done</button></div></Modal>}
    <Toast />
  </div>;
}
