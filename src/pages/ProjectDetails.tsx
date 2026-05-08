import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { SectionHeading } from '@/src/components/SectionHeading';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { projects, categories, loading } = usePortfolioData();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold mb-4 font-heading">Project not found</h2>
        <p className="text-light-text mb-8">The project you are looking for might have been moved or deleted.</p>
        <Link to="/portfolio">
          <Button>Back to Portfolio</Button>
        </Link>
      </div>
    );
  }

  const currentIndex = projects.findIndex(p => p.id === id);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const category = categories.find(c => c.id === project.categoryId);

  return (
    <div className="pb-24">
      {/* Project Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <img 
          src={project.thumbnail || project.images[0]} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/60 backdrop-blur-[2px] flex items-center justify-center p-6">
          <div className="max-w-4xl w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block bg-accent text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-xl shadow-accent/20">
                {category?.name || 'Design'}
              </span>
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold font-heading text-white mb-8 tracking-tighter">
                {project.title}
              </h1>
              <div className="flex flex-wrap justify-center gap-12 text-white/80 font-medium">
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60">Client</p>
                  <p className="text-lg">{project.client || 'Personal Project'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60">Date</p>
                  <p className="text-lg">{project.date ? new Date(project.date).getFullYear() : '2025'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-heading mb-8 flex items-center gap-4">
              <span className="w-8 h-1 bg-accent rounded-full" />
              Project Overview
            </h2>
            <p className="text-light-text text-xl leading-relaxed mb-10 whitespace-pre-wrap">
              {project.shortDescription}
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold font-heading mb-8 flex items-center gap-4">
              <span className="w-8 h-1 bg-accent rounded-full" />
              The Design Story
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-light-text whitespace-pre-wrap">
              {project.fullDescription}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-dark-card p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl shadow-black/5">
            <h3 className="text-xl font-bold font-heading mb-8">Quick Specs</h3>
            
            <div className="space-y-8">
              {project.tools && project.tools.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">Tools & Software</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool: string) => (
                      <span key={tool} className="bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl text-xs font-bold border border-black/5 dark:border-white/5">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.colors && project.colors.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">Brand Palette</h4>
                  <div className="flex gap-4">
                    {project.colors.map((color: string) => (
                      <div key={color} className="group relative">
                        <div 
                          className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 shadow-sm transition-transform hover:scale-110" 
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.typography && project.typography.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">Typography</h4>
                  <div className="space-y-2">
                    {project.typography.map((font: string) => (
                      <div key={font} className="text-sm font-bold tracking-tight">{font}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 max-w-7xl mx-auto space-y-12">
        {project.images && project.images.map((img: string, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img src={img} alt={`${project.title} gallery ${i}`} className="w-full h-auto" />
          </motion.div>
        ))}
      </section>

      {/* Navigation */}
      <section className="mt-24 border-t border-black/5 dark:border-white/5 pt-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link 
            to={`/portfolio/${prevProject.id}`}
            className="flex items-center gap-4 group text-left max-w-[40%]"
          >
            <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
              <ChevronLeft />
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-bold uppercase text-accent tracking-widest">Previous Project</span>
              <h4 className="font-bold truncate">{prevProject.title}</h4>
            </div>
          </Link>

          <Link to="/portfolio" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
            All Projects
          </Link>

          <Link 
            to={`/portfolio/${nextProject.id}`}
            className="flex items-center gap-4 group text-right max-w-[40%]"
          >
            <div className="hidden sm:block">
              <span className="text-[10px] font-bold uppercase text-accent tracking-widest">Next Project</span>
              <h4 className="font-bold truncate">{nextProject.title}</h4>
            </div>
            <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
              <ChevronRight />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
