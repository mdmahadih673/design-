import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Save, User, MapPin, Mail, Phone, Plus, Trash2, AlertCircle, Loader2, Trophy } from 'lucide-react';
import { ImageUpload } from '@/src/components/admin/ImageUpload';

export function AboutManager() {
  const [data, setData] = useState({
    fullName: 'Alex Anderson',
    jobTitle: 'Senior Graphic Designer',
    badge: 'Designer since 2021',
    title: 'Turning complex ideas into simple visuals.',
    bio1: "I'm Alex, a passionate graphic designer with 3+ years of experience creating visual identities that tell compelling stories.",
    bio2: "Based in London, I'm currently working with global brands and local startups to elevate their visual presence through clean, intentional design.",
    experienceYears: 8,
    location: 'New York, USA',
    email: 'hello@alex.design',
    phone: '+1 (555) 000-0000',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    resumeUrl: '',
    skills: [] as { name: string, level: number }[],
    experience: [] as { year: string, role: string, company: string, description: string }[],
    facts: [] as { text: string }[],
    achievements: [
      { label: 'Projects Completed', value: '50+' },
      { label: 'Happy Clients', value: '30+' },
      { label: 'Years Experience', value: '3+' },
      { label: 'Client Satisfaction', value: '100%' },
    ] as { label: string, value: string }[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const snap = await getDoc(doc(db, 'about', 'main'));
        if (snap.exists()) {
          const cloudData = snap.data();
          setData({
            ...data,
            ...cloudData,
            skills: cloudData.skills || [],
            experience: cloudData.experience || [],
            facts: cloudData.facts || []
          } as any);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await setDoc(doc(db, 'about', 'main'), data);
      alert('About me content updated successfully!');
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, OperationType.UPDATE, 'about/main');
      setError(err.message || 'Failed to update content.');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: 'skills' | 'experience' | 'facts') => {
    if (field === 'skills') {
      setData({ ...data, skills: [...(data.skills || []), { name: 'New Skill', level: 90 }] });
    } else if (field === 'experience') {
      setData({ ...data, experience: [...(data.experience || []), { year: '2024', role: 'Designer', company: 'Company', description: 'What did you do?' }] });
    } else if (field === 'facts') {
      setData({ ...data, facts: [...(data.facts || []), { text: 'New Fun Fact' }] });
    }
  };

  const removeItem = (field: 'skills' | 'experience' | 'facts', index: number) => {
    const updated = [...(data[field] as any[])];
    updated.splice(index, 1);
    setData({ ...data, [field]: updated });
  };

  const updateItem = (field: 'skills' | 'experience' | 'facts', index: number, subField: string, value: any) => {
    const updated = [...(data[field] as any[])];
    updated[index] = { ...updated[index], [subField]: value };
    setData({ ...data, [field]: updated });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-accent" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8 pb-32">
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <h3 className="text-xl font-bold font-heading flex items-center gap-3">
          <User className="text-accent" /> Profile Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Badge (e.g. Designer since 2021)</label>
            <input 
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Main Heading</label>
            <input 
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Biography Paragraph 1</label>
            <textarea 
              rows={4}
              value={data.bio1}
              onChange={(e) => setData({ ...data, bio1: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Biography Paragraph 2</label>
            <textarea 
              rows={4}
              value={data.bio2}
              onChange={(e) => setData({ ...data, bio2: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Years of Exp.</label>
            <input 
              type="number"
              value={data.experienceYears}
              onChange={(e) => setData({ ...data, experienceYears: parseInt(e.target.value) })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold ml-1">Location</label>
            <input 
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload 
            label="Profile Photo"
            value={data.photo}
            onChange={(val) => setData({ ...data, photo: val })}
          />
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Resume Link (Google Drive/Dropbox)</label>
            <input 
              value={data.resumeUrl}
              onChange={(e) => setData({ ...data, resumeUrl: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold font-heading flex items-center gap-3">
            <Plus className="text-accent" /> Skills & Proficiency
          </h3>
          <Button variant="outline" size="sm" onClick={() => addItem('skills')}>Add Skill</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.skills.map((skill, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
              <input 
                value={skill.name}
                onChange={e => updateItem('skills', idx, 'name', e.target.value)}
                className="bg-transparent font-bold outline-none flex-grow"
              />
              <input 
                type="number"
                value={skill.level}
                onChange={e => updateItem('skills', idx, 'level', parseInt(e.target.value))}
                className="bg-transparent text-accent font-bold w-12 outline-none"
              />
              <button onClick={() => removeItem('skills', idx)} className="text-red-500 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold font-heading flex items-center gap-3">
            <MapPin className="text-accent" /> Work Experience
          </h3>
          <Button variant="outline" size="sm" onClick={() => addItem('experience')}>Add Experience</Button>
        </div>
        
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    placeholder="Year"
                    value={exp.year}
                    onChange={e => updateItem('experience', idx, 'year', e.target.value)}
                    className="bg-transparent font-bold outline-none"
                  />
                  <input 
                    placeholder="Role"
                    value={exp.role}
                    onChange={e => updateItem('experience', idx, 'role', e.target.value)}
                    className="bg-transparent font-bold text-accent outline-none"
                  />
                  <input 
                    placeholder="Company"
                    value={exp.company}
                    onChange={e => updateItem('experience', idx, 'company', e.target.value)}
                    className="bg-transparent font-bold outline-none"
                  />
                </div>
                <button onClick={() => removeItem('experience', idx)} className="text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <textarea 
                rows={2}
                placeholder="Description"
                value={exp.description}
                onChange={e => updateItem('experience', idx, 'description', e.target.value)}
                className="w-full bg-transparent outline-none resize-none text-sm text-light-text"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fun Facts */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold font-heading flex items-center gap-3">
            <Save className="text-accent" /> Fun Facts
          </h3>
          <Button variant="outline" size="sm" onClick={() => addItem('facts')}>Add Fact</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.facts.map((fact, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
              <input 
                value={fact.text}
                onChange={e => updateItem('facts', idx, 'text', e.target.value)}
                className="bg-transparent font-bold outline-none flex-grow"
              />
              <button onClick={() => removeItem('facts', idx)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <h3 className="text-xl font-bold font-heading flex items-center gap-3">
          <Trophy className="text-accent" /> Achievement Stats (Home Page)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.achievements?.map((stat, idx) => (
            <div key={idx} className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl space-y-2">
              <input 
                placeholder="Value (e.g. 50+)"
                value={stat.value}
                onChange={e => {
                  const updated = [...data.achievements];
                  updated[idx].value = e.target.value;
                  setData({ ...data, achievements: updated });
                }}
                className="bg-transparent font-bold text-xl outline-none w-full"
              />
              <input 
                placeholder="Label"
                value={stat.label}
                onChange={e => {
                  const updated = [...data.achievements];
                  updated[idx].label = e.target.value;
                  setData({ ...data, achievements: updated });
                }}
                className="bg-transparent text-xs text-light-text font-bold uppercase tracking-widest outline-none w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="gap-2 shadow-2xl h-14 px-8 rounded-full" disabled={saving}>
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl text-sm flex items-start gap-3 border border-red-500/20">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
