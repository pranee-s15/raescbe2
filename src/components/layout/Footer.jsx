import { Facebook, Instagram, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { quickLinks } from '../../data/site';
import LogoMark from '../shared/LogoMark';

const Footer = () => (
  <footer className="mt-24 bg-boutique-maroon px-4 py-12 text-boutique-white md:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr,0.8fr,0.6fr]">
      <div>
        <div className="flex items-center gap-3">
          <LogoMark
            className="h-14 w-14"
            withText
            titleClassName="text-boutique-gold"
            subtitleClassName="text-white"
          />
        </div>
        <p className="mt-3 text-sm text-white/70">Luxury silhouettes. Timeless celebration.</p>
      </div>

      <div>
        <p className="mb-4 text-xs uppercase tracking-[0.36em] text-boutique-gold">Quick Links</p>
        <div className="space-y-3 text-sm text-white/80">
          {quickLinks.map((item) => (
            <Link key={item.href} to={item.href} className="block transition hover:text-boutique-gold">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-xs uppercase tracking-[0.36em] text-boutique-gold">Social</p>
        <div className="flex gap-3">
          {[Instagram, Facebook, Send].map((Icon, index) => (
            <button
              key={index}
              type="button"
              className="rounded-full bg-white/10 p-3 text-boutique-gold transition hover:bg-boutique-gold hover:text-boutique-maroon"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
    <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/60">
      &copy; 2026 Raes Boutique. All Rights Reserved.
    </div>
  </footer>
);

export default Footer;
