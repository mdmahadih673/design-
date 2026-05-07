import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { ProjectCard } from '@/src/components/ProjectCard';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';

export function Portfolio() {
  const { projects, categories, loading } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => p.categoryId === activeCategory);
  }, [activeCategory, projects]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="My Portfolio" 
          subtitle="A collection of my best graphic design work across various disciplines"
        />

        <div className="flex flex-wrap gap-4 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all border-2 ${
              activeCategory === 'all' 
                ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' 
                : 'border-black/5 dark:border-white/5 hover:border-accent/50'
            }`}
          >
            All Works
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all border-2 ${
                activeCategory === category.id 
                  ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' 
                  : 'border-black/5 dark:border-white/5 hover:border-accent/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-light-text">
            No projects found in this category. Stay tuned for updates!
          </div>
        )}
      </div>
    </div>
  );
}
