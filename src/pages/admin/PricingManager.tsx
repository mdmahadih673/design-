import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Trash2, Plus, Save, Loader2, GripVertical, Check } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  popular: boolean;
  features: string[];
  order: number;
}

export function PricingManager() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const q = query(collection(db, 'pricing'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as PricingTier[];
      setTiers(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTier = () => {
    const newTier: PricingTier = {
      id: '',
      name: 'New Plan',
      price: '$0',
      popular: false,
      features: ['Feature 1'],
      order: tiers.length
    };
    setTiers([...tiers, newTier]);
  };

  const handleUpdateTier = (index: number, field: keyof PricingTier, value: any) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const handleAddFeature = (tierIndex: number) => {
    const updated = [...tiers];
    updated[tierIndex].features.push('New Feature');
    setTiers(updated);
  };

  const handleUpdateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const updated = [...tiers];
    updated[tierIndex].features[featureIndex] = value;
    setTiers(updated);
  };

  const handleRemoveFeature = (tierIndex: number, featureIndex: number) => {
    const updated = [...tiers];
    updated[tierIndex].features.splice(featureIndex, 1);
    setTiers(updated);
  };

  const handleRemoveTier = async (index: number) => {
    const tier = tiers[index];
    if (tier.id) {
      if (!confirm('Are you sure you want to delete this pricing tier?')) return;
      await deleteDoc(doc(db, 'pricing', tier.id));
    }
    const updated = tiers.filter((_, i) => i !== index);
    setTiers(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const tier of tiers) {
        const { id, ...data } = tier;
        if (id) {
          await setDoc(doc(db, 'pricing', id), data);
        } else {
          await addDoc(collection(db, 'pricing'), data);
        }
      }
      alert('Pricing saved successfully!');
      fetchTiers();
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Failed to save pricing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-accent" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-heading">Pricing Management</h2>
          <p className="text-light-text">Manage your pricing plans and features</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleAddTier} className="flex gap-2">
            <Plus size={18} /> Add Plan
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <div key={idx} className={`p-8 rounded-3xl bg-white dark:bg-dark-card border-2 transition-all ${tier.popular ? 'border-accent' : 'border-black/5 dark:border-white/5'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex-grow space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-light-text mb-1">Plan Name</label>
                  <input 
                    type="text"
                    value={tier.name}
                    onChange={e => handleUpdateTier(idx, 'name', e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent rounded-xl px-4 py-2 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-light-text mb-1">Price</label>
                  <input 
                    type="text"
                    value={tier.price}
                    onChange={e => handleUpdateTier(idx, 'price', e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent rounded-xl px-4 py-2 outline-none text-2xl font-bold text-accent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id={`popular-${idx}`}
                    checked={tier.popular}
                    onChange={e => handleUpdateTier(idx, 'popular', e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <label htmlFor={`popular-${idx}`} className="text-xs font-bold uppercase tracking-widest text-light-text cursor-pointer">Mark as Popular</label>
                </div>
              </div>
              <button 
                onClick={() => handleRemoveTier(idx)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-light-text">Features</label>
                <button onClick={() => handleAddFeature(idx)} className="text-accent hover:underline text-[10px] font-bold uppercase tracking-widest">Add Feature</button>
              </div>
              {tier.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex gap-2">
                  <div className="flex-grow flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-1.5 grayscale focus-within:grayscale-0 transition-all">
                    <Check size={14} className="text-accent shrink-0" />
                    <input 
                      type="text"
                      value={feature}
                      onChange={e => handleUpdateFeature(idx, fIdx, e.target.value)}
                      className="bg-transparent w-full text-xs outline-none"
                    />
                  </div>
                  <button onClick={() => handleRemoveFeature(idx, fIdx)} className="p-1.5 text-light-text hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {tiers.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2.5rem]">
            <p className="text-light-text italic">No pricing tiers added yet.</p>
            <Button variant="outline" size="sm" onClick={handleAddTier} className="mt-4">Add your first plan</Button>
          </div>
        )}
      </div>
    </div>
  );
}
