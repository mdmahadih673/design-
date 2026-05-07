import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { SectionHeading } from '@/src/components/SectionHeading';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export function Seeder() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seedData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create Categories
      const categoriesRef = collection(db, 'categories');
      
      const checkCategory = async (name: string, slug: string) => {
        const q = query(categoriesRef, where('slug', '==', slug));
        const snap = await getDocs(q);
        if (snap.empty) {
          const doc = await addDoc(categoriesRef, { 
            name, 
            slug, 
            createdAt: serverTimestamp() 
          });
          return doc.id;
        }
        return snap.docs[0].id;
      };

      const thumbnailCatId = await checkCategory('YouTube Thumbnails', 'youtube-thumbnails');
      const marketingCatId = await checkCategory('Marketing Design', 'marketing-design');

      // Seed Services Settings
      const servicesSettingsRef = doc(db, 'services', 'settings');
      const sSettingsSnap = await getDoc(servicesSettingsRef);
      if (!sSettingsSnap.exists()) {
        await setDoc(servicesSettingsRef, {
          faqs: [
            { q: "How long does a project take?", a: "Timeline varies by project size." },
            { q: "How many revisions do I get?", a: "Standard packages include 3-5 rounds." }
          ],
          processSteps: [
            { n: '01', t: 'Discovery', d: 'Discussing goals and brand values' },
            { n: '02', t: 'Research', d: 'Market analysis and moodboarding' },
            { n: '03', t: 'Design', d: 'Drafting initial concepts' },
            { n: '04', t: 'Refine', d: 'Revising based on your feedback' },
            { n: '05', t: 'Deliver', d: 'Final files in all formats' }
          ]
        });
      }

      // 2. Create Pricing
      const pricingRef = collection(db, 'pricing');
      const pricingSnap = await getDocs(pricingRef);
      if (pricingSnap.empty) {
        const tiers = [
          { name: 'Basic', price: '$299', popular: false, order: 0, features: ['1 Logo Concept', '3 Revisions', 'Final Files (PNG/JPG)', 'Brand Guide'] },
          { name: 'Standard', price: '$599', popular: true, order: 1, features: ['3 Logo Concepts', 'Unlimited Revisions', 'Full Identity', 'Stationary Design'] },
          { name: 'Professional', price: '$1200', popular: false, order: 2, features: ['Premium Branding', 'Strategy Session', 'Packaging Design', 'Priority Support'] }
        ];
        for (const t of tiers) {
          await addDoc(pricingRef, t);
        }
      }

      // 3. Create Projects
      const projectsRef = collection(db, 'projects');
      const socialRef = collection(db, 'socialLinks');
      
      const seedSocials = async () => {
        const socials = [
          { platform: 'Facebook', url: 'https://www.facebook.com/md.mahadi.hasan.278404', status: 'active' },
          { platform: 'Instagram', url: '#', status: 'active' },
          { platform: 'LinkedIn', url: '#', status: 'active' }
        ];

        for (const s of socials) {
          const q = query(socialRef, where('platform', '==', s.platform));
          const snap = await getDocs(q);
          if (snap.empty) {
            await addDoc(socialRef, {
              ...s,
              createdAt: serverTimestamp()
            });
          }
        }
      };

      await seedSocials();

      // Seed Hire Me Settings
      const hiremeRef = doc(db, 'settings', 'hireme');
      const hiremeSnap = await getDoc(hiremeRef);
      if (!hiremeSnap.exists()) {
        await setDoc(hiremeRef, {
          title: 'Ready to start your project?',
          subtitle: 'I am currently available for freelance work. If you have a project that you want to get started, or just have a question, please get in touch.',
          buttonText: 'Start a Project',
          email: 'your@email.com',
          phone: '+880...',
          location: 'Dhaka, Bangladesh',
          status: 'available',
          budgetOptions: [
            'Under ৳৫,০০০',
            '৳৫,০০০ - ৳১০,০০০',
            '৳১০,০০০ - ৳৩০,০০০',
            '৳৩০,০০০+'
          ]
        });
      }

      const projects = [
        {
          title: 'HSC Accounting - Sami Sir',
          slug: 'hsc-accounting-sami-sir',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: true,
          shortDescription: 'High-impact educational thumbnail for accounting lessons.',
          thumbnail: 'input_file_0.png',
          date: '2024-05'
        },
        {
          title: 'SSC BGS Final Suggestion',
          slug: 'ssc-bgs-final-suggestion',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: false,
          shortDescription: 'Exam preparation thumbnail for social science students.',
          thumbnail: 'input_file_1.png',
          date: '2024-04'
        },
        {
          title: 'SSC General Math Final Suggestion',
          slug: 'ssc-math-final-suggestion',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: true,
          shortDescription: 'Clear and engaging mathematics exam preparation design.',
          thumbnail: 'input_file_2.png',
          date: '2024-04'
        },
        {
          title: 'SSC ICT Final Suggestion',
          slug: 'ssc-ict-final-suggestion',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: false,
          shortDescription: 'Modern ICT suggestion thumbnail with tech visual cues.',
          thumbnail: 'input_file_3.png',
          date: '2024-04'
        },
        {
          title: 'Gaming Beast Full Review',
          slug: 'gaming-beast-full-review',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: true,
          shortDescription: 'Dynamic tech review thumbnail for high-end laptops.',
          thumbnail: 'input_file_4.png',
          date: '2024-03'
        },
        {
          title: 'Redmi K90 Max First Impression',
          slug: 'redmi-k90-max-review',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: false,
          shortDescription: 'Sleek smartphone review thumbnail with glowing effects.',
          thumbnail: 'input_file_5.png',
          date: '2024-03'
        },
        {
          title: 'Digital Growth Agency Ad',
          slug: 'digital-growth-agency-ad',
          categoryId: marketingCatId,
          status: 'published',
          isFeatured: true,
          shortDescription: 'Premium glassmorphism social media ad for digital marketing.',
          thumbnail: 'input_file_6.png',
          date: '2024-05'
        },
        {
          title: 'Pro vs Noob Minecraft Challenge',
          slug: 'pro-vs-noob-minecraft',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: false,
          shortDescription: 'High-contrast gaming thumbnail for Minecraft content.',
          thumbnail: 'input_file_7.png',
          date: '2024-02'
        },
        {
          title: 'Earn $500 Daily Finance Guide',
          slug: 'earn-500-daily-finance',
          categoryId: thumbnailCatId,
          status: 'published',
          isFeatured: true,
          shortDescription: 'Compelling finance niche thumbnail with trust indicators.',
          thumbnail: 'input_file_8.png',
          date: '2024-01'
        }
      ];

      for (const p of projects) {
        const q = query(projectsRef, where('slug', '==', p.slug));
        const snap = await getDocs(q);
        if (snap.empty) {
          await addDoc(projectsRef, {
            ...p,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-6 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-dark-card p-12 rounded-[2.5rem] border border-black/5 dark:border-white/5 text-center shadow-2xl">
        <SectionHeading 
          title="Seed Portfolio" 
          subtitle="Add the new design work to your database"
          align="center"
        />
        
        {done ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle2 size={40} />
            </div>
            <p className="text-light-text font-medium">Successfully added 9 projects and categories to your portfolio!</p>
            <Button onClick={() => window.location.href = '/portfolio'} className="w-full">
              View Portfolio
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10 text-sm text-light-text text-left">
              <p className="font-bold mb-2 text-accent uppercase tracking-widest text-[10px]">What will be added:</p>
              <ul className="space-y-1 opacity-80">
                <li>• 4 Educational YouTube Thumbnails</li>
                <li>• 2 Tech Review Thumbnails</li>
                <li>• 1 Marketing Ad Design</li>
                <li>• 1 Gaming Thumbnail</li>
                <li>• 1 Finance Thumbnail</li>
              </ul>
            </div>
            
            {error && (
              <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-start gap-3 text-left">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              onClick={seedData} 
              disabled={loading}
              className="w-full py-6 text-lg gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Seeding Content...
                </>
              ) : (
                'Populate Portfolio'
              )}
            </Button>
            <p className="text-[10px] text-light-text uppercase font-bold tracking-widest opacity-50">
              Admin Access Required
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
