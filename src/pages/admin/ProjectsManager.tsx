import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, setDoc, addDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Plus, Search, Edit2, Trash2, Eye, X, Save, Image as ImageIcon, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { ImageUpload } from '@/src/components/admin/ImageUpload';

interface Project {
  id?: string;
  title: string;
  slug: string;
  categoryId: string;
  client: string;
  date: string;
  status: 'published' | 'draft';
  isFeatured: boolean;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  images: string[];
  colors: string[];
  typography: string[];
  tools: string[];
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  async function fetchProjects() {
    const q = query(collection(db, 'projects'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    setLoading(false);
  }

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProject({
      title: '',
      slug: '',
      categoryId: '',
      client: '',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      isFeatured: false,
      shortDescription: '',
      fullDescription: '',
      thumbnail: '',
      images: [],
      colors: [],
      typography: [],
      tools: []
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    setSaving(true);
    setError(null);

    const path = `projects/${currentProject.id || 'new'}`;
    try {
      if (currentProject.id) {
        await updateDoc(doc(db, 'projects', currentProject.id), currentProject as any);
      } else {
        await addDoc(collection(db, 'projects'), currentProject);
      }
      
      setIsEditing(false);
      fetchProjects();
    } catch (err: any) {
      console.error('Save failed:', err);
      handleFirestoreError(err, currentProject.id ? OperationType.UPDATE : OperationType.CREATE, path);
      setError(err.message || 'Failed to save project. Please check if your image is too large (max 800KB).');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (isEditing) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{currentProject?.id ? 'Edit Project' : 'Add New Project'}</h2>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="gap-2">
            <X size={16} /> Cancel
          </Button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Project Title</label>
                <input 
                  required
                  value={currentProject?.title}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">URL Slug</label>
                  <input 
                    value={currentProject?.slug}
                    onChange={(e) => setCurrentProject({ ...currentProject, slug: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Category</label>
                  <select 
                    value={currentProject?.categoryId}
                    onChange={(e) => setCurrentProject({ ...currentProject, categoryId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-black dark:text-white"
                  >
                    <option value="" className="dark:bg-dark-card">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id} className="dark:bg-dark-card">{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Short Description</label>
                <textarea 
                  rows={2}
                  value={currentProject?.shortDescription}
                  onChange={(e) => setCurrentProject({ ...currentProject, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Full Project Narrative</label>
                <textarea 
                  rows={8}
                  value={currentProject?.fullDescription}
                  onChange={(e) => setCurrentProject({ ...currentProject, fullDescription: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6">
              <h3 className="text-lg font-bold">Visual Assets</h3>
              <div className="space-y-4">
                <ImageUpload 
                  label="Main Thumbnail"
                  value={currentProject?.thumbnail || ''}
                  onChange={(val) => setCurrentProject({ ...currentProject, thumbnail: val })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Gallery Images (Comma separated URLs)</label>
                  <textarea 
                    value={currentProject?.images?.join(', ')}
                    onChange={(e) => setCurrentProject({ ...currentProject, images: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-black/5 dark:border-white/5 space-y-6 sticky top-24">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Featured Project</span>
                  <input 
                    type="checkbox" 
                    checked={currentProject?.isFeatured}
                    onChange={(e) => setCurrentProject({ ...currentProject, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded-lg text-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Status</label>
                  <select 
                    value={currentProject?.status}
                    onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-black dark:text-white"
                  >
                    <option value="draft" className="dark:bg-dark-card">Draft</option>
                    <option value="published" className="dark:bg-dark-card">Published</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Client Name</label>
                  <input 
                    value={currentProject?.client}
                    onChange={(e) => setCurrentProject({ ...currentProject, client: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Project Date</label>
                  <input 
                    type="date"
                    value={currentProject?.date}
                    onChange={(e) => setCurrentProject({ ...currentProject, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-4 py-3 outline-none"
                  />
                </div>
              </div>
              {error && (
                <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-start gap-3 mb-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full py-5 rounded-2xl gap-2" disabled={saving}>
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                {saving ? 'Saving Project...' : 'Save Project'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text" size={18} />
          <input 
            placeholder="Search projects..." 
            className="w-full bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 rounded-2xl pl-12 pr-6 py-3 outline-none focus:border-accent"
          />
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={18} /> Add Project
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/2 dark:bg-white/2 border-b border-black/5 dark:border-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Thumbnail</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Project Title</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Category</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {projects.map((project) => {
              const category = categories.find(c => c.id === project.categoryId);
              return (
                <tr key={project.id} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <img src={project.thumbnail} className="w-12 h-12 rounded-xl object-cover" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold">{project.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{category?.name || 'Uncategorized'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${project.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(project)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(project.id!)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {projects.length === 0 && <div className="p-12 text-center text-light-text">No projects found. Start by adding one!</div>}
      </div>
    </div>
  );
}
