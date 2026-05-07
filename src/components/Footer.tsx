import { Link } from 'react-router-dom';
import { Instagram, Linkedin, ArrowUp, Share2, Facebook, Github, Twitter, MessageCircle } from 'lucide-react';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';

const ICON_MAP: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  twitter: Twitter,
  whatsapp: MessageCircle
};

export function Footer() {
  const { socialLinks } = usePortfolioData();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-dark-card border-t border-black/5 dark:border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold font-heading tracking-tighter mb-4 block">
              DESIGN<span className="text-accent">ELITE</span>
            </Link>
            <p className="text-light-text max-w-sm mb-6">
              Creating stunning visual experiences that help brands stand out. From logos to complete brand identities, I bring ideas to life through design.
            </p>
            <div className="flex space-x-4">
              {socialLinks && socialLinks.map((link: any) => {
                const Icon = ICON_MAP[link.platform.toLowerCase()] || Share2;
                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-accent hover:text-white transition-all group relative"
                    title={link.platform}
                  >
                    <Icon size={18} />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      {link.platform}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-light-text">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/portfolio" className="hover:text-accent">Portfolio</Link></li>
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-6">Subscribe</h4>
            <p className="text-sm text-light-text mb-4">Get design tips and project updates in your inbox.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button className="bg-accent text-white px-4 py-2 rounded-r-lg hover:opacity-90">
                Go
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-light-text">
          <p>© 2025 DesignElite. All rights reserved.</p>
          <button 
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center gap-2 hover:text-accent transition-colors"
          >
            Back to top <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
