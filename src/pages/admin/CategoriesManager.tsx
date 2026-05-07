import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Trash2, Tag, Hash } from 'lucide-react';

export function CategoriesManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '' });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;
    try {
      const slug = newItem.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      await addDoc(collection(db, 'categories'), { 
        name: newItem.name, 
        slug,
        createdAt: new Date().toISOString()
      });
      setNewItem({ name: '' });
      fetchItems();
    } catch (err) {
      alert('Error adding category');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deleting this category may affect items assigned to it. Proceed?')) {
      await deleteDoc(doc(db, 'categories', id));
      fetchItems();
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-heading mb-2">Portfolio Categories</h2>
        <p className="text-light-text">Organize your projects and posts with custom categories.</p>
      </div>

      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
        <form onSubmit={handleAdd} className="flex gap-4 mb-10">
          <div className="flex-grow relative">
            <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-light-text" size={18} />
            <input 
              placeholder="e.g. Identity Design"
              value={newItem.name}
              onChange={(e) => setNewItem({ name: e.target.value })}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-accent transition-all"
            />
          </div>
          <Button type="submit" className="gap-2 px-8">
            <Plus size={18} /> Add
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
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
          ))}
          
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
