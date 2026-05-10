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
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center px-6 pt-24 lg:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.1),transparent)]" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[2.5rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold font-heading mb-4 md:mb-6 leading-[1.1] tracking-tighter"
            >
              {hero?.heading || "MD Mahadi Hasan"}
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium text-accent mb-6 md:mb-8 tracking-widest uppercase font-mono"
            >
              {hero?.subheading || "Creative Designer | Brand Identity Specialist"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-light-text max-w-lg mx-auto lg:mx-0 mb-8 md:mb-12 leading-relaxed opacity-75 font-medium px-4 sm:px-0"
            >
              {hero?.description || "I Build Brands That Speak Without Words."}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <Link to={hero?.btn1Link || "/portfolio"} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8 py-6 sm:py-4 text-base shadow-xl shadow-accent/20">
                  {hero?.btn1Text || "View My Work"}
                </Button>
              </Link>
              <Link to={hero?.btn2Link || "/contact"} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-6 sm:py-4 text-base border-accent/20 hover:border-accent">
                  {hero?.btn2Text || "Hire Me"}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none aspect-[4/3] lg:aspect-auto">
              <div className="absolute inset-0 bg-accent rounded-3xl blur-[80px] opacity-10 animate-pulse lg:blur-3xl" />
              <img
                src={hero?.profilePhoto || "input_file_1.png"}
                alt="MD Mahadi Hasan"
                className="w-full h-full object-cover rounded-[2rem] relative z-10 transition-all duration-700 shadow-2xl border border-white/5"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-16 md:py-28 px-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16 text-center md:text-left">
            <div>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 block"
              >
                Selected Work
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-bold font-heading tracking-tighter leading-tight">
                Featured <br className="hidden md:block" /> Projects
              </h2>
            </div>
            <p className="text-light-text text-sm sm:text-base md:text-xl max-w-md mx-auto md:mx-0 leading-relaxed opacity-80">
              Explore my most impactful visual identities, marketing designs, and creative case studies.
            </p>
          </div>
          
          <div className="space-y-10 md:space-y-16">
            {/* LARGE FEATURED PROJECT */}
            {projects.filter(p => (p as any).isFeatured).slice(0, 1).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-dark-card aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/8]"
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-14">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block px-3 py-1 bg-accent/20 backdrop-blur-md rounded-full text-accent text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-3 md:mb-4">
                      Case Study — {project.categoryName}
                    </span>
                    <h3 className="text-2xl md:text-5xl font-bold text-white mb-5 md:mb-6 max-w-2xl leading-[1.2] md:leading-[1.1] tracking-tight md:tracking-tighter">
                      {project.title}
                    </h3>
                    <Link to={`/portfolio/${project.id}`}>
                      <Button className="w-full sm:w-auto px-10 py-5 group/btn shadow-2xl shadow-accent/20">
                        View Project 
                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            
            {/* SECONDARY PROJECTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.filter(p => (p as any).isFeatured).slice(1, 10).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
          
          <div className="mt-12 md:mt-20 text-center">
            <Link to="/portfolio" className="inline-block w-full sm:w-auto px-4">
              <Button variant="outline" size="lg" className="w-full group px-10 py-6 rounded-xl border-white/10 hover:border-accent">
                Explore Full Portfolio <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
            align="left"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
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
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 lg:gap-12 text-center">
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
                <div className="flex justify-center mb-4 text-white/50">
                  {icons[i] || <Trophy size={20} />}
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-2">
                  <CountUp end={parseInt(stat.value)} suffix={stat.value.replace(/\d+/g, '')} />
                </div>
                <div className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2">
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
