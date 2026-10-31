import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import GuidePage from './pages/GuidePage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
export default function App() { return <Routes><Route path="/" element={<DashboardPage />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/guide" element={<GuidePage />} /><Route path="/planner" element={<PlannerPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
