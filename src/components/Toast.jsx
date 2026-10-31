import { CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
export default function Toast() {
  const { toast, setToast } = useApp();
  if (!toast) return null;
  return <div className="toast" role="status"><CheckCircle2 size={17} /><span>{toast}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></div>;
}
