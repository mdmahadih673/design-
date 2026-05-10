import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, LayoutDashboard } from 'lucide-react';
import { useTheme } from '@/src/lib/ThemeContext';
import { useAdmin } from '@/src/lib/AdminContext';
import { cn } from '@/src/lib/utils';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled || isOpen
          ? 'bg-white dark:bg-dark-card shadow-lg py-3'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-bold font-heading tracking-tighter">
          DESIGN<span className="text-accent underline decoration-accent/30 underline-offset-4">ELITE</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                location.pathname === link.path ? 'text-accent' : 'text-foreground/70'
              )}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link
            to="/contact"
            className="bg-accent text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2.5 rounded-xl bg-accent text-white shadow-lg shadow-accent/20"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-dark-card border-t border-black/5 dark:border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      'block py-3 px-4 rounded-xl text-lg font-medium transition-all active:scale-95',
                      location.pathname === link.path 
                        ? 'bg-accent/10 text-accent' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                className="pt-4"
              >
                <Link
                  to="/contact"
                  className="block bg-accent text-white text-center py-4 rounded-xl font-bold shadow-xl shadow-accent/20 active:scale-95 transition-transform"
                >
                  Hire Me
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
