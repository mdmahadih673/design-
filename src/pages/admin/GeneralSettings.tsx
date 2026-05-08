import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Save, Globe, Phone, Mail, Clock, MapPin, Hash, Palette } from 'lucide-react';

export function GeneralSettings() {
  const [data, setData] = useState({
    siteName: 'Alex Designs',
    tagline: 'Crafting Visual Stories',
    contactEmail: 'hello@alex.design',
    contactPhone: '01608171029',
    whatsappNumber: '8801608171029',
    whatsappEnabled: true,
    location: 'New York, USA',
    workingHours: 'Mon-Fri, 9AM - 6PM',
    accentColor: '#2563EB',
    maintenanceMode: false,
    copyright: '© 2025 Alex Designs. All rights reserved.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const snap = await getDoc(doc(db, 'settings', 'config'));
      if (snap.exists()) {
        setData(snap.data() as any);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'config'), data);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      {/* Website Identity */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <h3 className="text-xl font-bold font-heading flex items-center gap-3">
          <Globe className="text-accent" /> Website Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Site Name</label>
            <input 
              value={data.siteName}
              onChange={(e) => setData({ ...data, siteName: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Tagline</label>
            <input 
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <h3 className="text-xl font-bold font-heading flex items-center gap-3">
          <Phone className="text-accent" /> Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 flex items-center gap-2"><Mail size={14}/> Email Address</label>
            <input 
              value={data.contactEmail}
              onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-3 outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 flex items-center gap-2"><Phone size={14}/> Phone Number</label>
            <input 
              value={data.contactPhone}
              onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-3 outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 flex items-center gap-2"><MapPin size={14}/> Location</label>
            <input 
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-3 outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 flex items-center gap-2"><Clock size={14}/> Working Hours</label>
            <input 
              value={data.workingHours}
              onChange={(e) => setData({ ...data, workingHours: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-3 outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Integration */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading flex items-center gap-3">
             WhatsApp Chat Button
          </h3>
          <input 
            type="checkbox"
            checked={data.whatsappEnabled}
            onChange={(e) => setData({ ...data, whatsappEnabled: e.target.checked })}
            className="w-6 h-6 rounded-lg text-accent"
          />
        </div>
        {data.whatsappEnabled && (
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">WhatsApp Number (inc country code, no +)</label>
            <input 
              placeholder="e.g. 15550000000"
              value={data.whatsappNumber}
              onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
            />
          </div>
        )}
      </div>

      {/* Theme & Design */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
        <h3 className="text-xl font-bold font-heading flex items-center gap-3">
          <Palette className="text-accent" /> Theme & Design
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Accent Brand Color</label>
            <div className="flex gap-2">
              <input 
                type="color"
                value={data.accentColor}
                onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                className="h-12 w-12 rounded-xl cursor-pointer"
              />
              <input 
                value={data.accentColor}
                onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                className="flex-grow bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl">
            <div>
              <p className="font-bold">Maintenance Mode</p>
              <p className="text-xs text-light-text">Lock visitors out of the site</p>
            </div>
            <input 
              type="checkbox"
              checked={data.maintenanceMode}
              onChange={(e) => setData({ ...data, maintenanceMode: e.target.checked })}
              className="w-6 h-6 rounded-lg text-red-500"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 lg:left-[calc(50%+128px)] z-30">
        <Button onClick={handleSave} className="px-12 py-5 rounded-full shadow-2xl gap-3 text-lg" disabled={saving}>
          <Save size={24} /> {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
