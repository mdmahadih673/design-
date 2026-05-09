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
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-heading mb-4 md:mb-6 leading-tight md:leading-none tracking-tighter"
            >
              {hero?.heading || "Hi, I'm Alex."}
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-2xl lg:text-3xl font-medium text-light-text mb-6 md:mb-8"
            >
              {hero?.subheading || "Graphic Designer | Brand Identity | Visual Storytelling"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-base md:text-lg text-light-text max-w-lg mb-8 md:mb-10 leading-relaxed"
            >
              {hero?.description || "I create stunning visual experiences that help brands stand out. From logos to complete brand identities, I bring ideas to life through design."}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
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
      <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: '4rem' }}
                viewport={{ once: true }}
                className="h-[1px] bg-accent mb-6"
              />
              <h2 className="text-4xl md:text-7xl font-bold font-heading tracking-tighter leading-[0.9]">
                Featured <br />
                <span className="text-transparent border-t-text stroke-white" style={{ WebkitTextStroke: '1px rgba(var(--text-color), 0.2)' }}>Projects</span>
              </h2>
            </div>
            <div className="md:max-w-xs">
              <p className="text-light-text text-sm md:text-base leading-relaxed mb-6 opacity-70">
                A selection of high-impact design solutions across branding, social media, and visual identity.
              </p>
              <Link to="/portfolio" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-16 md:space-y-24">
            {/* THE SHOWCASE PROJECT */}
            {projects.filter(p => p.isFeatured).slice(0, 1).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link to={`/portfolio/${project.id}`}>
                  <div className="relative overflow-hidden rounded-[2rem] bg-dark-card border border-white/5 shadow-2xl">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <div className="max-w-2xl">
                        <span className="inline-block mb-3 px-3 py-1 bg-accent/20 backdrop-blur-md rounded-full text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
                          {project.categoryName}
                        </span>
                        <h3 className="text-2xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                          {project.title}
                        </h3>
                        <p className="hidden md:block text-white/60 text-sm mb-6 line-clamp-2 max-w-lg">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                          Read Case Study <ArrowRight size={16} className="text-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* STAGGERED GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {projects.filter(p => p.isFeatured).slice(1, 4).map((project, index) => (
                <div key={project.id} className={index % 2 === 1 ? 'md:mt-12' : ''}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-accent origin-center"
            />
            <h2 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tighter text-white">What I Do</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Professional services tailored to your brand needs. I combine creativity with strategy to deliver results.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-12 h-1.5 bg-accent rounded-full" />
            </div>
          </div>
          
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
                className={`p-6 md:p-10 rounded-[2rem] border relative ${tier.popular ? 'border-accent bg-accent/5 lg:scale-105 shadow-2xl shadow-accent/10 z-10' : 'border-black/5 dark:border-white/5 bg-white dark:bg-dark-card'} text-center flex flex-col`}
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
      <section className="py-32 px-6 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tighter"
            >
              What Clients <span className="text-accent italic font-light">Say</span>
            </motion.h2>
            <p className="text-light-text/60 text-lg">Feedback from international brands and startups.</p>
            <div className="mt-8 flex justify-center">
              <div className="w-12 h-1.5 bg-accent rounded-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-10 rounded-[2.5rem] bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 text-left group hover:border-accent/30 transition-all duration-500"
              >
                <div className="absolute top-8 right-10 text-accent/10 group-hover:text-accent/20 transition-colors">
                  <Smile size={60} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div>
                      <h4 className="font-bold text-xl">{t.name}</h4>
                      <p className="text-xs text-accent font-bold uppercase tracking-widest">{t.role} at {t.company}</p>
                    </div>
                  </div>
                  <p className="text-light-text text-lg italic leading-relaxed mb-8">"{t.content}"</p>
                  <div className="flex gap-1 text-accent">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-dark text-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-20 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2),transparent)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
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
