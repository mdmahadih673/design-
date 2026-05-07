import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Clock, Smile } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { SectionHeading } from '@/src/components/SectionHeading';
import { ProjectCard } from '@/src/components/ProjectCard';
import { ServiceCard } from '@/src/components/ServiceCard';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';
import { CountUp } from '@/src/components/CountUp';

export function Home() {
  const { hero, projects, services, testimonials, about, pricing, loading } = usePortfolioData();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.1),transparent)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.15),transparent)]" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-6 leading-none tracking-tighter"
            >
              {hero?.heading || "Hi, I'm Alex."}
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl font-medium text-light-text mb-8"
            >
              {hero?.subheading || "Graphic Designer | Brand Identity | Visual Storytelling"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-light-text max-w-lg mb-10 leading-relaxed"
            >
              {hero?.description || "I create stunning visual experiences that help brands stand out. From logos to complete brand identities, I bring ideas to life through design."}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={hero?.btn1Link || "/portfolio"}>
                <Button>
                  {hero?.btn1Text || "View My Work"}
                </Button>
              </Link>
              <Link to={hero?.btn2Link || "/contact"}>
                <Button variant="outline">{hero?.btn2Text || "Hire Me"}</Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-accent rounded-3xl rotate-6 blur-2xl opacity-20 animate-pulse" />
              <img
                src={hero?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"}
                alt="Profile"
                className="w-full h-full object-cover rounded-3xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-24 px-6 bg-black/5 dark:bg-white/2">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="Featured Projects" 
            subtitle="A selection of my recent design work" 
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(p => p.isFeatured).slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/portfolio">
              <Button variant="secondary" size="lg" className="group">
                View All Projects <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="What I Do" 
            subtitle="Professional services tailored to your brand needs"
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-black/5 dark:bg-white/2">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="Simple Pricing" 
            subtitle="Choose the perfect plan for your project"
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {(pricing.length > 0 ? pricing : [
              { name: 'Basic', price: '$299', features: ['1 Logo Concept', '3 Revisions', 'Final Files (PNG/JPG)', 'Brand Guide'] },
              { name: 'Standard', price: '$599', popular: true, features: ['3 Logo Concepts', 'Unlimited Revisions', 'Full Identity', 'Stationary Design'] },
              { name: 'Professional', price: '$1200', features: ['Premium Branding', 'Strategy Session', 'Packaging Design', 'Priority Support'] }
            ]).map((tier: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2rem] border relative ${tier.popular ? 'border-accent bg-accent/5 lg:scale-105 shadow-2xl shadow-accent/10 z-10' : 'border-black/5 dark:border-white/5 bg-white dark:bg-dark-card'} text-center flex flex-col`}
              >
                {tier.popular && <span className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Most Popular</span>}
                <h4 className="text-xl font-bold mb-2">{tier.name}</h4>
                <div className="text-4xl font-bold mb-8 text-accent">{tier.price}</div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {tier.features.map((f: string) => <li key={f} className="text-sm text-light-text">{f}</li>)}
                </ul>
                <Link to="/contact">
                  <Button variant={tier.popular ? 'primary' : 'outline'} className="w-full">Choose Plan</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-accent text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {(about?.achievements || [
            { label: 'Projects Completed', value: '50+' },
            { label: 'Happy Clients', value: '30+' },
            { label: 'Years Experience', value: '3+' },
            { label: 'Client Satisfaction', value: '100%' },
          ]).map((stat: any, i: number) => {
            const icons = [<Trophy key="0" />, <Users key="1" />, <Clock key="2" />, <Smile key="3" />];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-4 text-white/80">
                  {icons[i] || <Trophy />}
                </div>
                <div className="text-4xl font-bold font-heading mb-2">
                  <CountUp end={parseInt(stat.value)} suffix={stat.value.replace(/\d+/g, '')} />
                </div>
                <div className="text-accent-foreground text-sm font-medium uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-24 px-6 bg-black/5 dark:bg-white/2">
        <div className="max-w-7xl mx-auto text-center">
          <SectionHeading 
            title="What Clients Say" 
            subtitle="Feedback from brands I've worked with"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 text-left"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-light-text">{t.role} at {t.company}</p>
                  </div>
                </div>
                <p className="text-light-text italic leading-relaxed">"{t.content}"</p>
                <div className="mt-6 flex text-accent">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-dark text-white rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2),transparent)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
                Have a project in mind?
              </h2>
              <p className="text-xl text-white/70 mb-10">
                Let's work together to create something amazing that moves your brand forward.
              </p>
              <Link to="/contact">
                <Button size="lg">Start a Project</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
