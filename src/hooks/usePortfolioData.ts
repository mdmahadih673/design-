import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

export function usePortfolioData() {
  const [hero, setHero] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [blog, setBlog] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [servicesSettings, setServicesSettings] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [hireMe, setHireMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const fetchHero = async () => {
          try {
            const snap = await getDoc(doc(db, 'hero', 'main'));
            if (snap.exists()) setHero(snap.data());
          } catch (e) { console.error("Hero fetch error:", e); }
        };

        const fetchAbout = async () => {
          try {
            const snap = await getDoc(doc(db, 'about', 'main'));
            if (snap.exists()) setAbout(snap.data());
          } catch (e) { console.error("About fetch error:", e); }
        };

        const fetchCategories = async () => {
          try {
            const snap = await getDocs(collection(db, 'categories'));
            return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
          } catch (e) { 
            console.error("Categories fetch error:", e);
            return [];
          }
        };

        const fetchProjects = async (cats: any[]) => {
          try {
            const snap = await getDocs(query(collection(db, 'projects'), where('status', '==', 'published')));
            const projs = snap.docs.map(d => {
              const data = d.data();
              const category = cats.find(c => c.id === data.categoryId);
              return { id: d.id, ...data, categoryName: category?.name || 'Uncategorized' };
            });
            setProjects(projs);
          } catch (e) { console.error("Projects fetch error:", e); }
        };

        const fetchServices = async () => {
          try {
            const snap = await getDocs(query(collection(db, 'services'), where('status', '==', 'active')));
            setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } catch (e) { console.error("Services fetch error:", e); }
        };

        const fetchServicesSettings = async () => {
          try {
            const snap = await getDoc(doc(db, 'services', 'settings'));
            if (snap.exists()) setServicesSettings(snap.data());
          } catch (e) { console.error("Services settings fetch error:", e); }
        };

        const fetchTestimonials = async () => {
          try {
            const snap = await getDocs(query(collection(db, 'testimonials'), where('status', '==', 'visible')));
            setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } catch (e) { console.error("Testimonials fetch error:", e); }
        };

        const fetchSocialLinks = async () => {
          try {
            const snap = await getDocs(query(collection(db, 'socialLinks'), where('status', '==', 'active')));
            setSocialLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } catch (e) { console.error("Social links fetch error:", e); }
        };

        const fetchSettings = async () => {
          try {
            const snap = await getDoc(doc(db, 'settings', 'config'));
            if (snap.exists()) setSettings(snap.data());
          } catch (e) { console.error("Settings fetch error:", e); }
        };

        const fetchBlog = async () => {
          try {
            const snap = await getDocs(query(collection(db, 'blog'), where('status', '==', 'published'), orderBy('createdAt', 'desc')));
            setBlog(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } catch (e) { console.error("Blog fetch error (might need index):", e); }
        };

        const fetchHireMe = async () => {
          try {
            const snap = await getDoc(doc(db, 'settings', 'hireme'));
            if (snap.exists()) setHireMe(snap.data());
          } catch (e) { console.error("HireMe fetch error:", e); }
        };

        const fetchPricing = async () => {
          try {
            const snap = await getDocs(query(collection(db, 'pricing'), orderBy('order', 'asc')));
            setPricing(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } catch (e) { console.error("Pricing fetch error:", e); }
        };

        const cats = await fetchCategories();
        setCategories(cats);

        await Promise.all([
          fetchHero(),
          fetchAbout(),
          fetchProjects(cats),
          fetchServices(),
          fetchServicesSettings(),
          fetchTestimonials(),
          fetchSocialLinks(),
          fetchSettings(),
          fetchBlog(),
          fetchHireMe(),
          fetchPricing()
        ]);
      } catch (err) {
        console.error("Critical fetching error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return { hero, about, projects, blog, categories, services, servicesSettings, testimonials, socialLinks, pricing, settings, hireMe, loading };
}
