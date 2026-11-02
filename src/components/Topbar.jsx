import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import Brand from './Brand.jsx';
import { useApp } from '../context/AppContext.jsx';
export default function Topbar({ minimal = false }) {
  const navigate = useNavigate();
  const { user, setUser, theme, setTheme, setMobileNavOpen, setToast } = useApp();
  const logout = () => { setUser(null); setToast('You have been signed out.'); navigate('/login'); };
  return <header className="topbar">
    <div className="topbar-left">{!minimal && <button className="icon-button mobile-menu-button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><Menu size={20} /></button>}<Brand onClick={() => navigate('/')} /></div>
    <div className="topbar-actions"><button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
      {minimal ? <button className="button button-dark button-sm" onClick={() => navigate('/login')}>Sign in</button> : user ? <div className="user-menu"><span className="avatar">{(user.name || 'U').slice(0, 1).toUpperCase()}</span><span className="user-menu-name">{user.name}</span><button className="icon-button logout-button" onClick={logout} title="Sign out" aria-label="Sign out"><LogOut size={17} /></button></div> : <div className="auth-actions"><button className="button button-ghost button-sm" onClick={() => navigate('/login')}>Log in</button><button className="button button-dark button-sm" onClick={() => navigate('/register')}>Create account</button></div>}
    </div>
  </header>;
}
