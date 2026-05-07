import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Trash2, Edit2, Save, X, Quote, User, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUpload } from '@/src/components/admin/ImageUpload';

export function TestimonialsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    avatar: '',
    rating: 5,
    status: 'visible'
  });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'testimonials'));
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), formData);
      } else {
        await addDoc(collection(db, 'testimonials'), { 
          ...formData, 
          createdAt: new Date().toISOString()
        });
      }
      setEditingId(null);
      setShowAddForm(false);
      setFormData({ name: '', role: '', content: '', avatar: '', rating: 5, status: 'visible' });
      fetchItems();
    } catch (err) {
      alert('Error saving testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      await deleteDoc(doc(db, 'testimonials', id));
      fetchItems();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      role: item.role,
      content: item.content,
      avatar: item.avatar || '',
      rating: item.rating || 5,
      status: item.status || 'visible'
    });
    setShowAddForm(true);
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
          <h2 className="text-3xl font-bold font-heading mb-2">Testimonials</h2>
          <p className="text-light-text">Showcase what your clients say about you.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus size={18} /> Add Testimonial
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
                  <label className="text-sm font-bold text-light-text ml-1">Client Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Role / Company</label>
                  <input 
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g. CEO at TechFlow"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-light-text ml-1">Testimonial Content</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="The client's kind words..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload 
                  label="Client Avatar"
                  value={formData.avatar}
                  onChange={val => setFormData({...formData, avatar: val})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Rating</label>
                  <select 
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all appearance-none"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button type="submit" className="gap-2 px-8">
                  <Save size={18} /> {editingId ? 'Update Testimonial' : 'Publish Testimonial'}
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
            className="group bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-accent transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-accent/10 border border-black/5 dark:border-white/5">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-xs text-light-text">{item.role}</p>
                </div>
              </div>
              <div className="flex text-amber-500">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
            </div>

            <div className="relative">
              <Quote className="absolute -top-2 -left-2 text-accent/10" size={48} />
              <p className="text-light-text italic relative z-10 pl-6 leading-relaxed">
                "{item.content}"
              </p>
            </div>

            <div className="flex gap-2 mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </div>
    </div>
  );
}
