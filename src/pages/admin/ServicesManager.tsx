import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Trash2, Edit2, Save, X, Layers, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ServicesManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    processSteps: [] as { n: string, t: string, d: string }[],
    faqs: [] as { q: string, a: string }[]
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Layers',
    status: 'active',
    order: 0
  });

  useEffect(() => { 
    fetchItems();
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const snap = await getDoc(doc(db, 'services', 'settings'));
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          processSteps: data.processSteps || [],
          faqs: data.faqs || []
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchItems() {
    setLoading(true);
    try {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const path = `services/${editingId || 'new'}`;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), formData);
      } else {
        await addDoc(collection(db, 'services'), { 
          ...formData, 
          order: items.length,
          createdAt: new Date().toISOString()
        });
      }
      setEditingId(null);
      setShowAddForm(false);
      setFormData({ title: '', description: '', icon: 'Layers', status: 'active', order: 0 });
      fetchItems();
    } catch (err: any) {
      console.error('Save failed:', err);
      handleFirestoreError(err, editingId ? OperationType.UPDATE : OperationType.CREATE, path);
      setError(err.message || 'Error saving service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this service?')) {
      await deleteDoc(doc(db, 'services', id));
      fetchItems();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon || 'Layers',
      status: item.status || 'active',
      order: item.order || 0
    });
    setShowAddForm(true);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'services', 'settings'), settings);
      alert('Services settings saved!');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addItemSetting = (field: 'processSteps' | 'faqs') => {
    if (field === 'processSteps') {
      const n = (settings.processSteps.length + 1).toString().padStart(2, '0');
      setSettings({ ...settings, processSteps: [...settings.processSteps, { n, t: 'New Step', d: 'Description' }] });
    } else {
      setSettings({ ...settings, faqs: [...settings.faqs, { q: 'New Question', a: 'Answer' }] });
    }
  };

  const removeItemSetting = (field: 'processSteps' | 'faqs', index: number) => {
    const updated = [...settings[field]];
    updated.splice(index, 1);
    setSettings({ ...settings, [field]: updated });
  };

  const updateItemSetting = (field: 'processSteps' | 'faqs', index: number, subField: string, value: string) => {
    const updated = [...settings[field]] as any[];
    updated[index] = { ...updated[index], [subField]: value };
    setSettings({ ...settings, [field]: updated });
  };

  if (loading && items.length === 0) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-heading mb-2">Services</h2>
          <p className="text-light-text">Manage the expertise you offer to clients.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus size={18} /> Add Service
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Service Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Brand Identity"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Icon (Lucide Name)</label>
                  <select 
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all appearance-none"
                  >
                    <option value="Layers">Layers</option>
                    <option value="Globe">Globe</option>
                    <option value="FileText">FileText</option>
                    <option value="Star">Star</option>
                    <option value="Share2">Share</option>
                    <option value="MessageCircle">Message</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-light-text ml-1">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="What does this service include?"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-start gap-3 mb-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-4">
                <Button type="submit" className="gap-2 px-8" disabled={saving}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  {editingId ? (saving ? 'Updating...' : 'Update Service') : (saving ? 'Create Service' : 'Create Service')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setShowAddForm(false); setEditingId(null); }}
                  className="gap-2"
                >
                  <X size={18} /> Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-accent transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              item.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              {item.status}
            </div>

            <div className="mb-6 bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent">
              <Layers size={32} />
            </div>

            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <p className="text-light-text line-clamp-3 mb-8">{item.description}</p>

            <div className="flex gap-2">
              <button 
                onClick={() => handleEdit(item)}
                className="p-3 bg-black/5 dark:bg-white/5 rounded-xl hover:bg-accent hover:text-white transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && !loading && (
          <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
            <Layers className="mx-auto mb-4 text-light-text/30" size={48} />
            <p className="text-light-text font-medium text-lg">No services listed yet.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Working Process */}
        <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-heading flex items-center gap-3">
              <CheckCircle2 className="text-accent" /> How I Work
            </h3>
            <Button variant="outline" size="sm" onClick={() => addItemSetting('processSteps')}>Add Step</Button>
          </div>
          <div className="space-y-4">
            {settings.processSteps.map((step, idx) => (
              <div key={idx} className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl space-y-4">
                <div className="flex gap-4">
                  <input 
                    className="w-12 bg-transparent font-black text-accent outline-none"
                    value={step.n}
                    onChange={e => updateItemSetting('processSteps', idx, 'n', e.target.value)}
                  />
                  <input 
                    className="flex-grow bg-transparent font-bold outline-none"
                    placeholder="Step Title"
                    value={step.t}
                    onChange={e => updateItemSetting('processSteps', idx, 't', e.target.value)}
                  />
                  <button onClick={() => removeItemSetting('processSteps', idx)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea 
                  className="w-full bg-transparent text-sm outline-none resize-none opacity-70"
                  rows={2}
                  placeholder="Description"
                  value={step.d}
                  onChange={e => updateItemSetting('processSteps', idx, 'd', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-heading flex items-center gap-3">
              <CheckCircle2 className="text-accent" /> FAQs
            </h3>
            <Button variant="outline" size="sm" onClick={() => addItemSetting('faqs')}>Add FAQ</Button>
          </div>
          <div className="space-y-4">
            {settings.faqs.map((faq, idx) => (
              <div key={idx} className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl space-y-4">
                <div className="flex gap-4">
                  <input 
                    className="flex-grow bg-transparent font-bold outline-none"
                    placeholder="Question"
                    value={faq.q}
                    onChange={e => updateItemSetting('faqs', idx, 'q', e.target.value)}
                  />
                  <button onClick={() => removeItemSetting('faqs', idx)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea 
                  className="w-full bg-transparent text-sm outline-none resize-none opacity-70"
                  rows={2}
                  placeholder="Answer"
                  value={faq.a}
                  onChange={e => updateItemSetting('faqs', idx, 'a', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50 flex gap-4">
        <Button onClick={handleSaveSettings} className="gap-2 shadow-2xl h-14 px-8 rounded-full" disabled={saving}>
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
