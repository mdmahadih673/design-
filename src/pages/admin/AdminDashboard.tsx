import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { 
  Users, 
  Briefcase, 
  Layers, 
  MessageSquare,
  ArrowUpRight,
  Plus,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/Button';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    categories: 0,
    testimonials: 0,
    messages: 0,
    pricing: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsSnap, categoriesSnap, testimonialsSnap, messagesSnap, pricingSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'testimonials')),
          getDocs(collection(db, 'messages')),
          getDocs(collection(db, 'pricing')),
        ]);

        setStats({
          projects: projectsSnap.size,
          categories: categoriesSnap.size,
          testimonials: testimonialsSnap.size,
          messages: messagesSnap.size,
          pricing: pricingSnap.size,
        });

        // Recent messages (last 5)
        const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(5));
        const recentMessagesSnap = await getDocs(messagesQuery);
        setRecentMessages(recentMessagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Recent projects (last 5)
        const projectsQuery = query(collection(db, 'projects'), orderBy('date', 'desc'), limit(5));
        const recentProjectsSnap = await getDocs(projectsQuery);
        setRecentProjects(recentProjectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    { icon: Briefcase, label: 'Total Projects', value: stats.projects, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Layers, label: 'Categories', value: stats.categories, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Users, label: 'Testimonials', value: stats.testimonials, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: CreditCard, label: 'Pricing Plans', value: stats.pricing, color: 'text-pink-500', bg: 'bg-pink-500/10', link: '/admin/pricing' },
    { icon: MessageSquare, label: 'Hire Me', value: stats.messages, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <Link key={i} to={card.link || "#"} className={`p-5 rounded-3xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 flex items-center gap-4 transition-all hover:scale-[1.02] ${card.link ? 'cursor-pointer' : 'cursor-default'}`}>
            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-light-text uppercase tracking-widest mb-0.5">{card.label}</p>
              <h3 className="text-xl font-bold">{card.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold font-heading">Recent Projects</h3>
            <Link to="/admin/projects">
              <Button variant="ghost" size="sm" className="gap-2">
                View All <ArrowUpRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-black/2 dark:hover:bg-white/2 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5">
                <img src={project.thumbnail} alt={project.title} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-grow">
                  <h4 className="font-bold text-sm">{project.title}</h4>
                  <p className="text-xs text-light-text">{project.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${project.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {project.status}
                </span>
              </div>
            ))}
            {recentProjects.length === 0 && <p className="text-center py-8 text-light-text">No projects yet.</p>}
          </div>
        </div>

        {/* Recent Hire Me Inquiries */}
        <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold font-heading">Recent Inquiries</h3>
            <Link to="/admin/messages">
              <Button variant="ghost" size="sm" className="gap-2">
                View All <ArrowUpRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-black/2 dark:hover:bg-white/2 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${msg.status === 'unread' ? 'bg-accent' : 'bg-light-text'}`}>
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm">{msg.name}</h4>
                  <p className="text-xs text-light-text truncate max-w-[200px]">{msg.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-light-text font-bold uppercase">{new Date(msg.timestamp).toLocaleDateString()}</p>
                  {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-accent ml-auto mt-1" />}
                </div>
              </div>
            ))}
            {recentMessages.length === 0 && <p className="text-center py-8 text-light-text">No inquiries yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
