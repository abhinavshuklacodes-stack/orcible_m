import { useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, Check, ClipboardList, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar.jsx';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';
export default function PlannerPage() {
  const navigate = useNavigate();
  const { selectedProject, addTask, setToast } = useApp();
  const [goal, setGoal] = useState('');
  const [provider, setProvider] = useState('ChatGPT');
  const [generated, setGenerated] = useState(false);
  const generate = (event) => { event.preventDefault(); if (!goal.trim()) { setToast('Describe what you want to accomplish first.'); return; } setGenerated(true); };
  const addSuggestedTasks = () => {
    const cleanGoal = goal.trim().replace(/[.!?]+$/, '');
    addTask(`Define the scope: ${cleanGoal}`, provider); addTask(`Create a first draft for: ${cleanGoal}`, provider); addTask(`Review and refine the result: ${cleanGoal}`, provider); setToast('Three planning tasks added to your project.'); navigate('/');
  };
  return <div className="app-shell"><Topbar /><main className="planner-main">
    <div className="guide-breadcrumb"><button className="back-link" onClick={() => navigate('/')}><ArrowLeft size={15} /> Workspace</button><span>/</span><span>Planner</span></div>
    <section className="planner-hero"><span className="planner-hero-icon"><Sparkles size={21} /></span><span className="eyebrow">NUL.FOX AI BY ORCIBLE</span><h1>What are we working on?</h1><p>Describe the outcome you want. Turn it into a simple sequence of tasks you can carry across AI tools.</p></section>
    <div className="planner-workspace">
      <form className="planner-input-card" onSubmit={generate}><label className="field-label" htmlFor="planner-goal">Your goal</label><textarea id="planner-goal" className="field-textarea" rows="5" placeholder="e.g. Plan a launch campaign for my new product..." value={goal} onChange={(event) => { setGoal(event.target.value); setGenerated(false); }} /><div className="planner-input-footer"><label className="field-label" htmlFor="planner-provider">Start with</label><select id="planner-provider" className="field-select" value={provider} onChange={(event) => setProvider(event.target.value)}><option>ChatGPT</option><option>Claude</option><option>Grok</option><option>Gemini</option><option>DeepSeek</option><option>Meta AI</option></select><button className="button button-dark" type="submit">Build a workflow <ArrowRight size={16} /></button></div></form>
      <aside className="planner-side-note"><span className="eyebrow">YOUR CURRENT PROJECT</span><div className="planner-current-project"><ClipboardList size={17} /><strong>{selectedProject?.name || 'No project selected'}</strong></div><p>Your generated steps can be added directly to this project and managed from the workspace.</p><div className="planner-note-divider" /><span className="planner-note-tag"><Bot size={14} /> Frontend planning preview</span><small>Connect an AI API to turn this local planning flow into a live assistant.</small></aside>
    </div>
    {generated && <section className="generated-plan"><div className="generated-plan-heading"><div><span className="eyebrow">WORKFLOW PREVIEW</span><h2>A clear first sequence</h2><p>Suggested starting points for: “{goal.trim()}”</p></div><span className="generated-badge"><Check size={13} /> READY TO ADD</span></div><div className="generated-steps"><div className="generated-step"><span>01</span><div><strong>Define the scope</strong><p>Clarify the outcome, audience, constraints, and what success looks like.</p></div></div><div className="generated-step"><span>02</span><div><strong>Create a first draft</strong><p>Build the first useful version using {provider}.</p></div></div><div className="generated-step"><span>03</span><div><strong>Review and refine</strong><p>Check the result against your goal, fill gaps, and capture decisions.</p></div></div></div><div className="generated-plan-footer"><span>These steps are a starter structure. Adjust them in your workspace.</span><button className="button button-dark" onClick={addSuggestedTasks}>Add 3 tasks to project <ArrowRight size={16} /></button></div></section>}
    <footer className="main-footer"><span>© 2026 Orcible. All rights reserved.</span><span>Keep the context. Keep moving.</span></footer>
  </main><Toast /></div>;
}
