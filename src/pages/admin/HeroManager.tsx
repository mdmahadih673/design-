import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Save, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/src/components/admin/ImageUpload';

export function HeroManager() {
  const [data, setData] = useState({
    heading: "Hi, I'm Alex.",
    subheading: "Graphic Designer | Brand Identity | Visual Storytelling",
    description: "I create stunning visual experiences that help brands stand out.",
    btn1Text: "View My Work",
    btn1Link: "/portfolio",
    btn2Text: "Hire Me",
    btn2Link: "/contact",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    bgColor: "#2563EB"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHero() {
      const snap = await getDoc(doc(db, 'hero', 'main'));
      if (snap.exists()) {
        setData(snap.data() as any);
      }
      setLoading(false);
    }
    fetchHero();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await setDoc(doc(db, 'hero', 'main'), data);
      alert('Hero section updated successfully!');
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, OperationType.UPDATE, 'hero/main');
      setError(err.message || 'Failed to update hero section. Check image size (max 800KB).');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Heading Text</label>
            <input 
              value={data.heading}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Subheading Text</label>
            <input 
              value={data.subheading}
              onChange={(e) => setData({ ...data, subheading: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Description Paragraph</label>
          <textarea 
            rows={4}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Button 1 Text</label>
            <input 
              value={data.btn1Text}
              onChange={(e) => setData({ ...data, btn1Text: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none focus:border-accent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Button 1 Link</label>
            <input 
              value={data.btn1Link}
              onChange={(e) => setData({ ...data, btn1Link: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none focus:border-accent transition-all"
            />
          </div>
        </div>

        <ImageUpload 
          label="Profile Photo"
          value={data.profilePhoto}
          onChange={(val) => setData({ ...data, profilePhoto: val })}
          className="mb-8"
        />

        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Accent Color (Hex)</label>
          <div className="flex gap-2">
            <input 
              type="color"
              value={data.bgColor}
              onChange={(e) => setData({ ...data, bgColor: e.target.value })}
              className="h-12 w-12 rounded-xl cursor-pointer"
            />
            <input 
              value={data.bgColor}
              onChange={(e) => setData({ ...data, bgColor: e.target.value })}
              className="flex-grow bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none focus:border-accent transition-all"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-start gap-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex gap-4">
            <Button onClick={handleSave} className="gap-2" disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
              <RotateCcw size={18} /> Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
