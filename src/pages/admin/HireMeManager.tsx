import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Save, UserPlus, FileText, Phone, Mail, MapPin, AlertCircle, Loader2 } from 'lucide-react';

export function HireMeManager() {
  const [data, setData] = useState({
    title: 'Ready to start your project?',
    subtitle: 'I am currently available for freelance work. If you have a project that you want to get started, or just have a question, please get in touch.',
    buttonText: 'Start a Project',
    email: '',
    phone: '',
    location: '',
    status: 'available', // available, busy, away
    budgetOptions: ['Under ৳৫,০০০', '৳৫,০০০ - ৳১০,০০০', '৳১০,০০০ - ৳৩০,০০০', '৳৩০,০০০+']
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'hireme'));
        if (snap.exists()) setData(snap.data() as any);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await setDoc(doc(db, 'settings', 'hireme'), data);
      alert('Hire Me settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, OperationType.UPDATE, 'settings/hireme');
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-heading">Hire Me Settings</h2>
          <p className="text-light-text mt-1">Manage how clients see your availability and contact info</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${data.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          Currently: {data.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5">
          <h3 className="text-xl font-bold font-heading flex items-center gap-2">
            <FileText size={20} className="text-accent" />
            Section Content
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-light-text mb-2">Title</label>
              <input 
                type="text" 
                value={data.title}
                onChange={e => setData({...data, title: e.target.value})}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-light-text mb-2">Subtitle / Description</label>
              <textarea 
                rows={4}
                value={data.subtitle}
                onChange={e => setData({...data, subtitle: e.target.value})}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-light-text mb-2">Button Text</label>
              <input 
                type="text" 
                value={data.buttonText}
                onChange={e => setData({...data, buttonText: e.target.value})}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5">
          <h3 className="text-xl font-bold font-heading flex items-center gap-2">
            <UserPlus size={20} className="text-accent" />
            Availability & Contact
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-light-text mb-2">My Status</label>
              <select 
                value={data.status}
                onChange={e => setData({...data, status: e.target.value})}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all text-slate-900 dark:text-white"
              >
                <option value="available" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Available for Work</option>
                <option value="busy" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Busy / In Progress</option>
                <option value="away" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">On Vacation / Away</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <label className="block text-xs font-bold uppercase tracking-widest text-light-text mb-2">Budget Range Options (One per line)</label>
              <textarea 
                rows={4}
                value={(data as any).budgetOptions?.join('\n') || 'Under ৳৫,০০০\n৳৫,০০০ - ৳১০,০০০\n৳১০,০০০ - ৳৩০,০০০\n৳৩০,০০০+'}
                onChange={e => setData({...data, budgetOptions: e.target.value.split('\n').filter(l => l.trim())} as any)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all text-light-text dark:text-white"
                placeholder="Enter budget ranges, one per line"
              />
            </div>

            <div className="flex items-center gap-4 bg-black/2 dark:bg-white/2 p-4 rounded-2xl border border-black/5 dark:border-white/5">
              <Mail className="text-accent" />
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-light-text uppercase">Email Address</p>
                <input 
                  type="email" 
                  value={data.email}
                  onChange={e => setData({...data, email: e.target.value})}
                  className="bg-transparent w-full outline-none text-sm font-semibold"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/2 dark:bg-white/2 p-4 rounded-2xl border border-black/5 dark:border-white/5">
              <Phone className="text-accent" />
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-light-text uppercase">Phone Number</p>
                <input 
                  type="text" 
                  value={data.phone}
                  onChange={e => setData({...data, phone: e.target.value})}
                  className="bg-transparent w-full outline-none text-sm font-semibold"
                  placeholder="+880..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-4">
        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-start gap-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        <Button onClick={handleSave} className="w-full md:w-auto px-12 py-4 gap-2" disabled={saving}>
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
          {saving ? 'Saving...' : 'Save Hire Me Settings'}
        </Button>
      </div>
    </div>
  );
}
