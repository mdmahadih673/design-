import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';
import { ServiceCard } from '@/src/components/ServiceCard';
import { Button } from '@/src/components/Button';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Services() {
  const { services, pricing, servicesSettings, loading } = usePortfolioData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const defaultFaqs = [
    { q: "How long does a project take?", a: "Timeline varies by project size." },
    { q: "How many revisions do I get?", a: "Standard packages include 3-5 rounds." }
  ];

  const defaultProcess = [
    { n: '01', t: 'Discovery', d: 'Discussing goals and brand values' },
    { n: '02', t: 'Research', d: 'Market analysis and moodboarding' },
    { n: '03', t: 'Design', d: 'Drafting initial concepts' },
    { n: '04', t: 'Refine', d: 'Revising based on your feedback' },
    { n: '05', t: 'Deliver', d: 'Final files in all formats' }
  ];

  const faqs = servicesSettings?.faqs || defaultFaqs;
  const processSteps = servicesSettings?.processSteps || defaultProcess;

  const defaultPricing = [
    { name: 'Basic', price: '$299', features: ['1 Logo Concept', '3 Revisions', 'Final Files (PNG/JPG)', 'Brand Guide'] },
    { name: 'Standard', price: '$599', popular: true, features: ['3 Logo Concepts', 'Unlimited Revisions', 'Full Identity', 'Stationary Design'] },
    { name: 'Professional', price: '$1200', features: ['Premium Branding', 'Strategy Session', 'Packaging Design', 'Priority Support'] }
  ];

  const displayPricing = pricing.length > 0 ? pricing : defaultPricing;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="My Design Services" 
          subtitle="Professional solutions tailored to help your brand grow and stand out."
        />

        {/* Detailed Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 hover:border-accent shadow-xl shadow-transparent hover:shadow-accent/5 transition-all flex flex-col"
            >
              <h3 className="text-2xl font-bold font-heading mb-4 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-light-text mb-8 min-h-[3rem]">
                {service.description}
              </p>
              
              <div className="pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-light-text block mb-1">Starting from</span>
                  <span className="text-2xl font-bold text-accent">{service.startingPrice || 'Enquire'}</span>
                </div>
                <Link to="/contact">
                  <Button variant="outline" size="sm">Get Quote</Button>
                </Link>
              </div>
            </motion.div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full py-20 text-center text-light-text italic opacity-50">
              No services listed at the moment.
            </div>
          )}
        </div>

        {/* My Process */}
        <section className="mb-32">
          <SectionHeading title="How I Work" subtitle="A transparent process from concept to delivery" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {processSteps.map((step: any, i: number) => (
              <div key={i} className="relative p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-accent/10 transition-all text-center">
                <span className="text-5xl font-black text-accent/10 absolute top-4 left-4">{step.n || `0${i+1}`}</span>
                <h4 className="text-xl font-bold mb-3 relative z-10">{step.t}</h4>
                <p className="text-sm text-light-text leading-tight">{step.d}</p>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[2px] bg-accent/20 z-10" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Tables */}
        <section className="mb-32">
           <SectionHeading title="Simple Pricing" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              {displayPricing.map((tier, i) => (
                <div key={i} className={`p-6 md:p-10 rounded-[2rem] border relative ${tier.popular ? 'border-accent bg-accent/5 lg:scale-105 shadow-2xl shadow-accent/10 z-10' : 'border-black/5 dark:border-white/5 bg-white dark:bg-dark-card'} text-center flex flex-col`}>
                  {tier.popular && <span className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Most Popular</span>}
                  <h4 className="text-xl font-bold mb-2">{tier.name}</h4>
                  <div className="text-4xl font-bold mb-8 text-accent">{tier.price}</div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {tier.features.map(f => <li key={f} className="text-sm text-light-text">{f}</li>)}
                  </ul>
                  <Link to="/contact">
                    <Button variant={tier.popular ? 'primary' : 'outline'} className="w-full">Choose Plan</Button>
                  </Link>
                </div>
              ))}
           </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
           <SectionHeading title="Common Questions" />
           <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between bg-white dark:bg-dark-card hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
                  >
                    <span className="font-bold">{faq.q}</span>
                    <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-black/2 dark:bg-white/2"
                      >
                        <div className="p-6 text-light-text text-sm border-t border-black/5 dark:border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
