import { ReactNode } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  Layers, 
  Briefcase, 
  Star, 
  FileText, 
  Mail, 
  Share2, 
  Settings, 
  LogOut,
  User,
  Search,
  Globe,
  Plus,
  Database,
  UserPlus,
  CreditCard
} from 'lucide-react';
import { useAdmin } from '@/src/lib/AdminContext';
import { Button } from '@/src/components/Button';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Image, label: 'Hero Section', path: '/admin/hero' },
  { icon: User, label: 'About Me', path: '/admin/about' },
  { icon: Briefcase, label: 'Portfolio', path: '/admin/projects' },
  { icon: Layers, label: 'Categories', path: '/admin/categories' },
  { icon: Plus, label: 'Services', path: '/admin/services' },
  { icon: CreditCard, label: 'Pricing', path: '/admin/pricing' },
  { icon: Star, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: FileText, label: 'Blog', path: '/admin/blog' },
  { icon: Mail, label: 'Hire Me (Inquiries)', path: '/admin/messages' },
  { icon: UserPlus, label: 'Hire Me Settings', path: '/admin/hire-me-settings' },
  { icon: Share2, label: 'Social Links', path: '/admin/social-links' },
  { icon: Globe, label: 'SEO Settings', path: '/admin/seo' },
  { icon: Settings, label: 'General Settings', path: '/admin/settings' },
  { icon: Database, label: 'Seed Data', path: '/admin/seed' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  if (!user || !isAdmin) return <Navigate to="/admin" />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark group">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-dark-card border-r border-black/5 dark:border-white/5 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-8 border-b border-black/5 dark:border-white/5">
          <Link to="/admin/dashboard" className="text-xl font-bold font-heading tracking-tighter block text-center">
            ADMIN<span className="text-accent">DASH</span>
          </Link>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                location.pathname === item.path
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-light-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-h-screen max-h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-dark-card border-b border-black/5 dark:border-white/5 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">
              {MENU_ITEMS.find((m) => m.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text" size={16} />
              <input 
                placeholder="Search..." 
                className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-3 border-l border-black/5 dark:border-white/5 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.displayName || 'Admin'}</p>
                <p className="text-[10px] text-light-text font-medium">{user.email}</p>
              </div>
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} 
                alt="Admin" 
                className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10"
              />
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
