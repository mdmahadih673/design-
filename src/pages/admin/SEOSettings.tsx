import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Save, Globe, Search, Type } from 'lucide-react';

export function SEOSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteTitle: 'Elite Designer | Portfolio',
    siteDescription: 'Professional graphic designer specializing in brand identity and visual storytelling.',
    keywords: 'graphic design, branding, logo design, UI/UX, portfolio',
    ogImage: '',
    googleAnalyticsId: ''
  });

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    try {
      const snap = await getDoc(doc(db, 'settings', 'seo'));
      if (snap.exists()) {
        setSettings({ ...settings, ...snap.data() });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'seo'), settings);
      alert('SEO Settings saved!');
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-heading mb-2">SEO & Search Settings</h2>
        <p className="text-light-text">Optimize how your website appears on Google and social media.</p>
      </div>

      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest">
              <Type size={16} /> Meta Information
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-light-text ml-1">Default Title Tag</label>
              <input 
                required
                value={settings.siteTitle}
                onChange={e => setSettings({...settings, siteTitle: e.target.value})}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-light-text ml-1">Meta Description</label>
              <textarea 
                required
                rows={3}
                value={settings.siteDescription}
                onChange={e => setSettings({...settings, siteDescription: e.target.value})}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-light-text ml-1">Keywords (Comma separated)</label>
              <input 
                value={settings.keywords}
                onChange={e => setSettings({...settings, keywords: e.target.value})}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest">
              <Globe size={16} /> Advanced
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-light-text ml-1">OG Image URL (Social Share)</label>
                <input 
                  value={settings.ogImage}
                  onChange={e => setSettings({...settings, ogImage: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-light-text ml-1">GA4 Measurement ID</label>
                <input 
                  value={settings.googleAnalyticsId}
                  onChange={e => setSettings({...settings, googleAnalyticsId: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                  placeholder="G-XXXXXX"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full md:w-auto px-12 gap-2 py-5 text-lg">
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                <Save size={20} /> Save SEO Settings
              </>
            )}
          </Button>
        </form>
      </div>

      {/* SEO Preview Card */}
      <div className="bg-[#f0f3f5] p-8 rounded-3xl border border-black/5">
        <h3 className="text-xs font-bold text-light-text uppercase tracking-widest mb-6 flex items-center gap-2">
          <Search size={14} /> Search Preview
        </h3>
        <div className="max-w-xl bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-[#1a0dab] text-xl font-medium mb-1 cursor-pointer hover:underline">
            {settings.siteTitle}
          </div>
          <div className="text-[#006621] text-sm mb-2">{window.location.origin}</div>
          <div className="text-[#4d5156] text-sm line-clamp-2">
            {settings.siteDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
