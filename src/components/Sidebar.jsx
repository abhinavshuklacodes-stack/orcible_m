import { CircleHelp, ChevronRight, Folder, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
export default function Sidebar({ onCreateProject }) {
  const { projects, selectedProjectId, setSelectedProjectId, user, mobileNavOpen, setMobileNavOpen } = useApp();
  const navigate = useNavigate();
  return <>
    {mobileNavOpen && <button className="mobile-scrim" aria-label="Close sidebar" onClick={() => setMobileNavOpen(false)} />}
    <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-mobile-head"><span className="eyebrow">WORKSPACE</span><button className="icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Close sidebar"><X size={18} /></button></div>
      <div className="sidebar-profile"><span className="avatar avatar-large">{(user?.name || 'G').slice(0, 1).toUpperCase()}</span><div className="sidebar-profile-copy"><span className="sidebar-profile-name">{user?.name || 'Guest workspace'}</span><span className="sidebar-profile-caption">{user ? 'Personal workspace' : 'Local demo mode'}</span></div></div>
      <div className="sidebar-section-head"><span className="eyebrow">MY PROJECTS</span><button className="small-icon-button" title="Create project" aria-label="Create project" onClick={onCreateProject}><Plus size={16} /></button></div>
      <div className="project-list">{projects.map((project) => <button key={project.id} className={`project-link ${project.id === selectedProjectId ? 'project-link-active' : ''}`} onClick={() => { setSelectedProjectId(project.id); setMobileNavOpen(false); }}><Folder size={16} /><span>{project.name}</span>{project.id === selectedProjectId && <ChevronRight size={15} className="project-chevron" />}</button>)}{projects.length === 0 && <p className="sidebar-empty">No projects yet.</p>}</div>
      <button className="create-project-link" onClick={onCreateProject}><Plus size={16} /> Create new project</button>
      <div className="sidebar-bottom"><button className="sidebar-help" onClick={() => { navigate('/guide'); setMobileNavOpen(false); }}><CircleHelp size={16} /><span>Help</span></button><div className="sidebar-footer">ORCIBLE <span>© 2026</span></div></div>
    </aside>
  </>;
}
