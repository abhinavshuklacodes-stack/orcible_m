import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar.jsx';
import Toast from '../components/Toast.jsx';
import { useApp } from '../context/AppContext.jsx';

function SocialButton({ children, onClick }) {
  return <button type="button" className="social-button" onClick={onClick}><span>{children}</span></button>;
}

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const { setUser, setToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [error, setError] = useState('');

  const socialAction = (provider) => setToast(`${provider} sign-in needs OAuth credentials from your backend.`);
  const submit = (event) => {
    event.preventDefault(); setError('');
    if (!isRegister) {
      if (!identifier.trim() || !password) { setError('Enter your username and password to continue.'); return; }
      const displayName = identifier.includes('@') ? identifier.split('@')[0] : identifier.trim();
      setUser({ name: displayName, email: identifier.trim() }); navigate('/'); setToast('Welcome back. Your workspace is ready.'); return;
    }
    if (!name.trim()) { setError('Enter your name to create an account.'); return; }
    if (usePhone ? !phone.trim() : !identifier.trim()) { setError(usePhone ? 'Enter your phone number.' : 'Enter your email address.'); return; }
    if (password.length < 8) { setError('Use a password with at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Your passwords do not match.'); return; }
    setUser({ name: name.trim(), email: usePhone ? phone.trim() : identifier.trim() }); navigate('/'); setToast('Account created in this browser demo.');
  };

  return <div className="auth-page">
    <Topbar minimal />
    <main className="auth-main">
      <div className="auth-back-row"><button className="back-link" onClick={() => navigate('/')}><ArrowLeft size={15} /> Back to workspace</button></div>
      <div className="auth-layout">
        <section className="auth-aside"><span className="eyebrow">ONE WORKSPACE. EVERY ASSISTANT.</span><h1>Keep your work.<br />Change your tools.</h1><p>Orcible keeps the important context close, so your ideas don’t have to start over every time you switch AI assistants.</p><div className="auth-aside-list"><span><ShieldCheck size={16} /> Your projects stay organised</span><span><ShieldCheck size={16} /> Context travels with your work</span><span><ShieldCheck size={16} /> Switch tools when you need to</span></div><div className="auth-aside-footer">© 2026 ORCIBLE</div></section>
        <section className="auth-card">
          <div className="auth-card-heading"><span className="eyebrow">{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</span><h2>{isRegister ? 'Create your account' : 'Continue with Orcible'}</h2><p>{isRegister ? 'Set up your workspace in a few simple steps.' : 'Pick up right where you left off.'}</p></div>
          <div className="social-stack"><SocialButton onClick={() => socialAction('Google')}>Continue with Google</SocialButton><SocialButton onClick={() => socialAction('Apple')}>Continue with Apple</SocialButton><SocialButton onClick={() => socialAction('GitHub')}>Continue with GitHub</SocialButton></div>
          <div className="auth-divider"><span>OR CONTINUE WITH {isRegister ? 'EMAIL' : 'YOUR ACCOUNT'}</span></div>
          <form className="auth-form" onSubmit={submit}>
            {isRegister && <><label className="field-label" htmlFor="full-name">Full name</label><input id="full-name" className="field-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /> </>}
            <div className="field-label-row"><label className="field-label" htmlFor="auth-identifier">{isRegister ? (usePhone ? 'Phone number' : 'Email address') : 'Username or email'}</label>{isRegister && <button type="button" className="field-switch" onClick={() => setUsePhone((value) => !value)}>{usePhone ? <Mail size={13} /> : <Phone size={13} />}{usePhone ? 'Use email instead' : 'Use phone instead'}</button>}</div>
            {isRegister && usePhone ? <input id="auth-identifier" className="field-input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" autoComplete="tel" /> : <input id="auth-identifier" className="field-input" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder={isRegister ? 'you@example.com' : 'Email, phone, or username'} autoComplete={isRegister ? 'email' : 'username'} />}
            <label className="field-label" htmlFor="auth-password">Password</label><div className="password-wrap"><input id="auth-password" className="field-input" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'} autoComplete={isRegister ? 'new-password' : 'current-password'} /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            {isRegister && <><label className="field-label" htmlFor="confirm-password">Confirm password</label><div className="password-wrap"><input id="confirm-password" className="field-input" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Enter your password again" autoComplete="new-password" /><button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></>}
            {!isRegister && <div className="auth-utility"><button type="button" className="text-button" onClick={() => setToast('Password recovery needs an email service in the backend.')}>Forgot password?</button></div>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button button-dark button-full auth-submit">{isRegister ? 'Create account' : 'Log in'} <ArrowRight size={16} /></button>
          </form>
          <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Orcible?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Register now'}</Link></p>
          <p className="auth-legal">By continuing, you agree to use Orcible responsibly. This frontend demo stores your session in this browser only.</p>
        </section>
      </div>
    </main>
    <Toast />
  </div>;
}
