import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Trash2, Tag, Hash, Loader2, AlertCircle } from 'lucide-react';

export function CategoriesManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

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
      
      const payload = { 
        name: newItem.name.trim(), 
        slug,
        createdAt: new Date().toISOString()
      };
      console.log('Attempting to add category:', payload);
      
      const docRef = await addDoc(collection(db, 'categories'), payload);
      console.log('Category added successfully with ID:', docRef.id);
      setNewItem({ name: '' });
      fetchItems();
    } catch (err: any) {
      console.error('FULL Error adding category:', err);
      // Log the specific error code if available
      if (err.code) console.error('Error Code:', err.code);
      
      setError(err.message || 'Error adding category. Check your permissions.');
      try {
        handleFirestoreError(err, OperationType.CREATE, 'categories');
      } catch (e) {
        // Log to console if it throws
        console.error('Firestore error details logged.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;
    setSaving(true);
    setError(null);

    try {
      const slug = editingItem.name.toLowerCase().trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      
      const { id, ...data } = editingItem;
      await updateDoc(doc(db, 'categories', id), { 
        ...data,
        name: editingItem.name.trim(), 
        slug,
        updatedAt: new Date().toISOString()
      });
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      console.error('Update category failed:', err);
      setError(err.message || 'Error updating category.');
      handleFirestoreError(err, OperationType.UPDATE, `categories/${editingItem.id}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    setError(null);
    try {
      await deleteDoc(doc(db, 'categories', id));
      console.log('Category deleted successfully:', id);
      fetchItems();
    } catch (err: any) {
      console.error('FULL Error deleting category:', err);
      if (err.code) console.error('Error Code:', err.code);
      
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
      setError('Delete failed. You might not have permission.');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold font-heading mb-2">Portfolio Categories</h2>
        <p className="text-light-text">Organize your projects and posts with custom categories. {auth.currentUser?.email}</p>
      </div>

      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
        <form onSubmit={editingItem ? handleUpdate : handleAdd} className="flex gap-4 mb-3">
          <div className="flex-grow relative">
            <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-light-text" size={18} />
            <input 
              placeholder={editingItem ? "Rename category..." : "e.g. Identity Design"}
              disabled={saving}
              value={editingItem ? editingItem.name : newItem.name}
              onChange={(e) => editingItem 
                ? setEditingItem({ ...editingItem, name: e.target.value })
                : setNewItem({ name: e.target.value })
              }
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-accent transition-all text-black dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {editingItem && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditingItem(null)}
                disabled={saving}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="gap-2 px-8 min-w-[120px]" disabled={saving || (editingItem ? !editingItem.name : !newItem.name)}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : (editingItem ? <Tag size={18} /> : <Plus size={18} />)}
              {saving ? (editingItem ? 'Updating...' : 'Adding...') : (editingItem ? 'Update' : 'Add')}
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-[10px] text-light-text uppercase tracking-widest font-bold self-center mr-2">Suggestions:</span>
          {['Logo Design', 'Social Media', 'UI/UX Design', 'Branding', 'Illustration'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setNewItem({ name: cat })}
              className="px-3 py-1.5 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-full text-[10px] uppercase tracking-widest font-bold text-accent transition-all"
            >
              + {cat}
            </button>
          ))}
        </div>

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
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => setEditingItem(item)} 
                    className="p-3 text-light-text hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                  >
                    <Tag size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
