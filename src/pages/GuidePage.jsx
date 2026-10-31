import { ArrowDownToLine, ArrowLeft, ArrowRight, Check, FolderPlus, MousePointerClick, Plus, Repeat2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar.jsx';
import Toast from '../components/Toast.jsx';
import ProviderLogo from '../components/ProviderLogo.jsx';
import { providers } from '../data.js';

function MiniTask({ title, provider, checked = false }) {
  const item = providers.find((candidate) => candidate.name === provider) || providers[0];
  return <div className="mini-task"><span className={`mini-check ${checked ? 'mini-check-on' : ''}`}>{checked && <Check size={11} />}</span><span>{title}</span><small><ProviderLogo provider={item} size="sm" />{provider}</small></div>;
}
export default function GuidePage() {
  const navigate = useNavigate();
  return <div className="app-shell"><Topbar /><main className="guide-main">
    <div className="guide-breadcrumb"><button className="back-link" onClick={() => navigate('/')}><ArrowLeft size={15} /> Workspace</button><span>/</span><span>How to use</span></div>
    <section className="guide-hero"><span className="eyebrow">A QUICK WALKTHROUGH</span><h1>One place for all your<br className="desktop-break" /> AI work.</h1><p>Keep your projects organised, carry the right context, and move between AI assistants without losing your train of thought.</p></section>
    <section className="guide-feature-block">
      <div className="guide-feature-copy"><span className="step-number">01</span><div><h2>Start with a project.</h2><p>Create a project for the work you’re doing. Add tasks as you move through your process, and keep them grouped in one workspace.</p><div className="guide-tip"><FolderPlus size={17} /><span>Your projects live in the left sidebar. You can switch between them at any time.</span></div></div></div>
      <div className="guide-preview guide-preview-dashboard"><div className="preview-window-bar"><span className="preview-dot" /><span className="preview-dot" /><span className="preview-dot" /><span className="preview-window-title">orcible / workspace</span></div><div className="preview-dashboard-content"><div className="preview-sidebar"><div className="preview-brand"><span className="preview-brand-mark">O</span> orcible</div><small>MY PROJECTS</small><div className="preview-project active"><FolderPlus size={12} /> Product launch</div><div className="preview-project"><FolderPlus size={12} /> Market research</div><div className="preview-add"><Plus size={12} /> New project</div></div><div className="preview-main"><small>YOUR AI WORKSPACE</small><h3>Your AI work,<br />without losing context.</h3><p>Start once. Switch context. Keep context.</p><div className="preview-task-box"><div className="preview-task-head">PROJECT TASKS <span>3</span></div><MiniTask title="Outline the launch strategy" provider="ChatGPT" checked /><MiniTask title="Research the audience" provider="Claude" /><MiniTask title="Draft product positioning" provider="Grok" /></div></div></div></div>
    </section>
    <section className="guide-feature-block guide-feature-reverse">
      <div className="guide-feature-copy"><span className="step-number">02</span><div><h2>Choose what to carry forward.</h2><p>Mark the tasks that matter for your next conversation. Orcible creates a portable context file with your selected task history and project details.</p><div className="guide-tip"><ArrowDownToLine size={17} /><span>Export only the tasks you select. Your project stays available in Orcible.</span></div></div></div>
      <div className="guide-preview guide-preview-export"><div className="preview-export-head"><span className="eyebrow">CONTEXT HANDOFF</span><span className="preview-export-pill"><Check size={11} /> READY</span></div><h3>Carry your context.</h3><p>Choose tasks to include in your next AI conversation.</p><MiniTask title="Outline the launch strategy" provider="ChatGPT" checked /><MiniTask title="Research the audience" provider="Claude" checked /><MiniTask title="Draft product positioning" provider="Grok" /><div className="preview-export-footer"><span><ArrowDownToLine size={13} /> project-context.md</span><span className="preview-export-button">Export context</span></div></div>
    </section>
    <section className="guide-feature-block">
      <div className="guide-feature-copy"><span className="step-number">03</span><div><h2>Switch tools. Keep moving.</h2><p>Choose the assistant you want to use next. Orcible downloads the context file and opens that AI tool in a new tab. Attach the file to your new chat to continue.</p><div className="guide-tip"><Repeat2 size={17} /><span>External AI conversations are not imported automatically. Use the downloaded file to pass context into the next tool.</span></div></div></div>
      <div className="guide-preview guide-preview-providers"><span className="eyebrow">CHOOSE YOUR NEXT TOOL</span><h3>Where would you like to continue?</h3><div className="preview-provider-grid">{providers.map((provider) => <div className="preview-provider" key={provider.name}><ProviderLogo provider={provider} size="md" /><span>{provider.name}</span><ArrowRight size={12} /></div>)}</div><div className="preview-note"><MousePointerClick size={14} /> Select a tool to open it with your context ready.</div></div>
    </section>
    <section className="guide-cta"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Make your next move.</h2><p>Your workspace is ready. Pick a project or create a new one to get started.</p></div><button className="button button-dark" onClick={() => navigate('/')}>Go to workspace <ArrowRight size={16} /></button></section>
    <footer className="main-footer"><span>© 2026 Orcible. All rights reserved.</span><span>Keep the context. Keep moving.</span></footer>
  </main><Toast /></div>;
}
