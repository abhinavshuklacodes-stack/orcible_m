import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import GuidePage from './pages/GuidePage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
import { useApp } from './context/AppContext.jsx';
function RequireAuth({ children }) { const { user, authLoading } = useApp(); if (authLoading) return <div className="auth-loading" aria-label="Loading"><span className="spinner" /></div>; return user ? children : <Navigate to="/login" replace />; }
export default function App() { return <Routes><Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/guide" element={<GuidePage />} /><Route path="/planner" element={<RequireAuth><PlannerPage /></RequireAuth>} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
