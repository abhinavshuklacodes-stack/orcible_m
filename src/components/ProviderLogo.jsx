import { useState } from 'react';
export default function ProviderLogo({ provider, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const sizeClass = size === 'lg' ? 'provider-logo-lg' : size === 'sm' ? 'provider-logo-sm' : 'provider-logo-md';
  return <span className={`provider-logo ${sizeClass} ${provider.name === 'Claude' ? 'provider-logo-claude' : ''}`}>{!failed ? <img src={`/assets/${provider.file}`} alt={`${provider.name} logo`} onError={() => setFailed(true)} /> : <span className="provider-fallback">{provider.name.slice(0, 1)}</span>}</span>;
}
