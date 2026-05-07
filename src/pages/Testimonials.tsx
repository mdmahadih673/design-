import { motion } from 'motion/react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';
import { Star, Quote, User } from 'lucide-react';

export function Testimonials() {
  const { testimonials, loading } = usePortfolioData();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Client Testimonials" 
          subtitle="Don't just take my word for it — hear what my clients have to say about our collaboration."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {testimonials && testimonials.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 3) * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 relative group hover:border-accent/30 transition-all duration-300 shadow-xl shadow-transparent hover:shadow-accent/5 flex flex-col h-full"
            >
              <Quote size={40} className="text-accent/10 absolute top-8 right-8" />
              <div className="flex text-accent mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill={j < (t.rating || 5) ? "currentColor" : "none"} className="mr-1" />
                ))}
              </div>
              <p className="text-lg text-light-text mb-10 italic leading-relaxed flex-grow">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-accent/10 border border-black/5 dark:border-white/5 flex-shrink-0">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{t.name}</h4>
                  <p className="text-sm text-light-text">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {(!testimonials || testimonials.length === 0) && (
            <div className="col-span-full py-20 text-center text-light-text italic opacity-50">
              No testimonials shared yet.
            </div>
          )}
        </div>

        {/* Partners/Logos */}
        <section className="pt-24 border-t border-black/5 dark:border-white/5">
           <h3 className="text-center text-sm font-bold uppercase tracking-widest text-light-text mb-12">Trusted By</h3>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-3xl font-black italic">LOGOIPSUM</span>
              <span className="text-2xl font-bold flex items-center gap-1"><div className="w-4 h-4 bg-current" /> SPHERE</span>
              <span className="text-3xl font-serif">AESTHETICA</span>
              <span className="text-2xl font-mono tracking-tighter">TECHFLOW_</span>
              <span className="text-xl font-bold border-2 border-current px-2">CUBIC</span>
           </div>
        </section>
      </div>
    </div>
  );
}
