export default function Brand({ onClick }) {
  return <button type="button" onClick={onClick} className="brand-lockup" aria-label="Go to Orcible home"><span className="brand-mark-wrap"><img src="/assets/orcible.png" alt="" className="brand-mark" /></span><span className="brand-word">orcible<span className="brand-period">.</span></span></button>;
}
