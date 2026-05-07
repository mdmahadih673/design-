import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Trash2, Share2, Link as LinkIcon, ExternalLink } from 'lucide-react';

export function SocialLinksManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ platform: '', url: '', status: 'active' });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try {
      const snap = await getDocs(collection(db, 'socialLinks'));
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.platform || !newItem.url) return;
    try {
      await addDoc(collection(db, 'socialLinks'), { 
        ...newItem,
        createdAt: new Date().toISOString()
      });
      setNewItem({ platform: '', url: '', status: 'active' });
      fetchItems();
    } catch (err) {
      alert('Error adding social link');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this social link?')) {
      await deleteDoc(doc(db, 'socialLinks', id));
      fetchItems();
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-heading mb-2">Social Profiles</h2>
        <p className="text-light-text">Connect your design profiles and social accounts.</p>
      </div>

      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <input 
            placeholder="Platform (Behance, Dribbble...)" 
            value={newItem.platform} 
            onChange={e => setNewItem({...newItem, platform: e.target.value})} 
            className="md:col-span-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
          />
          <input 
            placeholder="URL (https://...)" 
            value={newItem.url} 
            onChange={e => setNewItem({...newItem, url: e.target.value})} 
            className="md:col-span-1 bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
          />
          <Button type="submit" className="gap-2">
            <Plus size={18} /> Add Link
          </Button>
        </form>

        <div className="space-y-4">
          {items.map(item => (
             <div 
              key={item.id} 
              className="flex justify-between items-center p-6 bg-black/2 dark:bg-white/2 rounded-2xl border border-black/5 dark:border-white/5 group hover:border-accent transition-all"
            >
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                   <Share2 size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold flex items-center gap-2">
                    {item.platform}
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-light-text hover:text-accent transition-colors">
                      <ExternalLink size={14} />
                    </a>
                   </h4>
                   <p className="text-xs text-light-text line-clamp-1">{item.url}</p>
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
            <div className="py-12 text-center text-light-text italic opacity-50">
              No social links connected yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
