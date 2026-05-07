import { motion } from 'motion/react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Button } from '@/src/components/Button';
import { Mail, Phone, MapPin, Instagram, Linkedin, Send, MessageCircle, Github, Facebook, Twitter, Facebook as FacebookIcon, Paperclip, X, Loader2 } from 'lucide-react';
import { useState, useEffect, FormEvent, useRef } from 'react';

const ICON_MAP: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  twitter: Twitter,
  whatsapp: MessageCircle
};
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';

export function Contact() {
  const { settings, socialLinks, hireMe } = usePortfolioData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const budgetOptions = hireMe?.budgetOptions || [
    'Under ৳৫,০০০',
    '৳৫,০০০ - ৳১০,০০০',
    '৳১০,০০০ - ৳৩০,০০০',
    '৳৩০,০০০+'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Logo Design',
    budget: budgetOptions[0],
    message: ''
  });

  useEffect(() => {
    if (hireMe?.budgetOptions && hireMe.budgetOptions.length > 0) {
      setFormData(prev => ({ ...prev, budget: hireMe.budgetOptions[0] }));
    }
  }, [hireMe]);

  const [referenceFile, setReferenceFile] = useState<{name: string, data: string, type: string} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 500KB for Base64 storage in Firestore (1MB doc limit)
    if (file.size > 500 * 1024) {
      alert('File is too large. Please select a file under 500KB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setReferenceFile({
        name: file.name,
        data: event.target?.result as string,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        referenceFile: referenceFile,
        timestamp: serverTimestamp(),
        status: 'unread'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Get in Touch" 
          subtitle="Have a project in mind? Let's talk about how I can help you bring your vision to life."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-bold font-heading mb-8">Contact Information</h3>
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email Me</h4>
                  <p className="text-light-text">{settings?.contactEmail || "design@elite.com"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Call Me</h4>
                  <p className="text-light-text">{settings?.contactPhone || "+44 20 1234 5678"}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Location</h4>
                  <p className="text-light-text">{settings?.location || "London, United Kingdom"}</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold font-heading mb-8">Follow Me</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(link => {
                const Icon = ICON_MAP[link.platform.toLowerCase()] || MessageCircle;
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 hover:border-accent hover:text-accent transition-all flex items-center gap-3 font-semibold capitalize">
                    <Icon size={20} />
                    {link.platform}
                  </a>
                );
              })}
              {socialLinks.length === 0 && (
                <>
                  <a href="#" className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 hover:border-accent hover:text-accent transition-all flex items-center gap-3 font-semibold">
                    <Instagram size={20} /> Instagram
                  </a>
                  <a href="#" className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 hover:border-accent hover:text-accent transition-all flex items-center gap-3 font-semibold">
                    <Linkedin size={20} /> LinkedIn
                  </a>
                  <a href="https://www.facebook.com/md.mahadi.hasan.278404" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 hover:border-accent hover:text-accent transition-all flex items-center gap-3 font-semibold">
                    <Facebook size={20} /> Facebook
                  </a>
                </>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[2.5rem] bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 shadow-2xl shadow-black/5 transition-all"
          >
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Send size={32} />
                  </motion.div>
                </div>
                <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                <p className="text-light-text mb-8">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                <Button onClick={() => setSubmitted(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-light-text ml-1">Full Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-light-text ml-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Project Type</label>
                    <select 
                      value={formData.projectType}
                      onChange={e => setFormData({...formData, projectType: e.target.value})}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer text-slate-900 dark:text-white"
                    >
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Logo Design</option>
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Brand Identity</option>
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Social Media</option>
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Packaging</option>
                      <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-light-text ml-1">Budget Range</label>
                    <select 
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer text-slate-900 dark:text-white"
                    >
                      {budgetOptions.map((opt: string) => (
                        <option key={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Reference File (Optional)</label>
                  <div className="relative">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,application/pdf"
                    />
                    {!referenceFile ? (
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 rounded-2xl px-6 py-4 flex items-center justify-center gap-3 text-light-text hover:border-accent hover:text-accent transition-all group"
                      >
                        <Paperclip size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Upload Reference File (Max 500KB)</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-2xl px-6 py-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Paperclip size={18} className="text-accent shrink-0" />
                          <span className="text-sm font-semibold truncate">{referenceFile.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setReferenceFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1 hover:bg-accent/10 rounded-lg text-accent transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-light-text ml-1">Your Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-5 rounded-2xl flex gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
