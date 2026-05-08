import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Trash2, Tag, Hash, Loader2, AlertCircle } from 'lucide-react';

export function CategoriesManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Fetch categories failed:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    setSaving(true);
    setError(null);

    try {
      const slug = newItem.name.toLowerCase().trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      
      const docRef = await addDoc(collection(db, 'categories'), { 
        name: newItem.name.trim(), 
        slug,
        createdAt: new Date().toISOString()
      });
      console.log('Category added with ID:', docRef.id);
      setNewItem({ name: '' });
      fetchItems();
    } catch (err: any) {
      console.error('Add category failed:', err);
      handleFirestoreError(err, OperationType.CREATE, 'categories');
      setError(err.message || 'Error adding category. Check your permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    setError(null);
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchItems();
    } catch (err: any) {
      console.error('Delete category failed:', err);
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
      setError('Delete failed. You might not have permission.');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold font-heading mb-2">Portfolio Categories</h2>
        <p className="text-light-text">Organize your projects and posts with custom categories.</p>
      </div>

      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
        <form onSubmit={handleAdd} className="flex gap-4 mb-6">
          <div className="flex-grow relative text-black dark:text-white">
            <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-light-text" size={18} />
            <input 
              placeholder="e.g. Identity Design"
              disabled={saving}
              value={newItem.name}
              onChange={(e) => setNewItem({ name: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-accent transition-all"
            />
          </div>
          <Button type="submit" className="gap-2 px-8 min-w-[120px]" disabled={saving || !newItem.name}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {saving ? 'Adding...' : 'Add'}
          </Button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-start gap-3 animate-in shake duration-300">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="md:col-span-2 py-12 flex justify-center">
              <Loader2 className="animate-spin text-accent" />
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-5 bg-black/2 dark:bg-white/2 rounded-2xl border border-black/5 dark:border-white/5 group hover:border-accent transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Hash size={18} />
                  </div>
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-light-text opacity-60">/{item.slug}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
          
          {items.length === 0 && !loading && (
            <div className="md:col-span-2 py-12 text-center text-light-text italic opacity-50">
              No categories created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
