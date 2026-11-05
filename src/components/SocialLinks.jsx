import { FaInstagram, FaFacebookF, FaXTwitter, FaRedditAlien, FaWhatsapp, FaQuora, FaLinkedinIn, FaGithub } from 'react-icons/fa6';

// NOTE: swap these placeholder URLs for Orcible's real profile links before launch.
// GitHub already points at the project's actual repository.
export const socialLinks = [
  { name: 'Instagram', url: 'https://instagram.com/orcible', Icon: FaInstagram },
  { name: 'Facebook', url: 'https://facebook.com/orcible', Icon: FaFacebookF },
  { name: 'X', url: 'https://x.com/orcible', Icon: FaXTwitter },
  { name: 'Reddit', url: 'https://reddit.com/r/orcible', Icon: FaRedditAlien },
  { name: 'WhatsApp', url: 'https://wa.me/', Icon: FaWhatsapp },
  { name: 'Quora', url: 'https://quora.com/profile/orcible', Icon: FaQuora },
  { name: 'LinkedIn', url: 'https://linkedin.com/company/orcible', Icon: FaLinkedinIn },
  { name: 'GitHub', url: 'https://github.com/abhinavshuklacodes-stack/orcible_m', Icon: FaGithub },
];

export default function SocialLinks({ className = '' }) {
  return <div className={`social-links ${className}`}>
    {socialLinks.map(({ name, url, Icon }) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={name} title={name}><Icon size={15} /></a>)}
  </div>;
}
