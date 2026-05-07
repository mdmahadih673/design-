import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Trash2, Edit2, Save, X, FileText, Calendar, Eye, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUpload } from '@/src/components/admin/ImageUpload';

export function BlogManager() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    categoryId: '',
    status: 'published',
    isFeatured: false
  });

  useEffect(() => { 
    fetchItems();
    fetchCategories();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const path = `blog/${editingId || 'new'}`;
    try {
      const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const data = { ...formData, slug };
      
      if (editingId) {
        await updateDoc(doc(db, 'blog', editingId), data);
      } else {
        await addDoc(collection(db, 'blog'), { 
          ...data, 
          createdAt: new Date().toISOString()
        });
      }
      setEditingId(null);
      setShowAddForm(false);
      setFormData({ title: '', slug: '', excerpt: '', content: '', coverImage: '', categoryId: '', status: 'published', isFeatured: false });
      fetchItems();
    } catch (err: any) {
      console.error('Save failed:', err);
      handleFirestoreError(err, editingId ? OperationType.UPDATE : OperationType.CREATE, path);
      setError(err.message || 'Error saving post. Check image size (max 800KB).');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) {
      await deleteDoc(doc(db, 'blog', id));
      fetchItems();
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content || '',
      coverImage: item.coverImage || '',
      categoryId: item.categoryId || '',
      status: item.status || 'published',
      isFeatured: !!item.isFeatured
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
          <h2 className="text-3xl font-bold font-heading mb-2">Blog Posts</h2>
          <p className="text-light-text">Share your thoughts and design insights.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus size={18} /> New Post
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Post Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter an engaging title"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Category</label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-light-text ml-1">Excerpt (Short Summary)</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-light-text ml-1">Content (Markdown supported)</label>
                <textarea 
                  required
                  rows={10}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your article here..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-mono text-sm"
                />
              </div>

              <ImageUpload 
                label="Cover Image"
                value={formData.coverImage}
                onChange={val => setFormData({...formData, coverImage: val})}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 pt-8">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                      className="hidden"
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      formData.isFeatured ? 'bg-accent border-accent text-white' : 'border-black/10 dark:border-white/10'
                    }`}>
                      {formData.isFeatured && <Eye size={14} />}
                    </div>
                    <span className="text-sm font-bold">Featured Post</span>
                  </label>
                </div>
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
                  {editingId ? (saving ? 'Updating...' : 'Update Post') : (saving ? 'Publishing...' : 'Publish Article')}
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

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white dark:bg-dark-card p-6 rounded-3xl border border-black/5 dark:border-white/5 hover:border-accent transition-all flex flex-col md:flex-row gap-6 items-center"
          >
            <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0">
              {item.coverImage ? (
                <img src={item.coverImage} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-light-text/30">
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  {categories.find(c => c.id === item.categoryId)?.name || 'General'}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-light-text uppercase tracking-widest">
                  <Calendar size={12} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Draft'}
                </span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{item.title}</h3>
              <p className="text-sm text-light-text line-clamp-1">{item.excerpt}</p>
            </div>

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
      </div>
    </div>
  );
}
