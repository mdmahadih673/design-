import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/src/types';

interface ProjectCardProps {
  project: Project;
  key?: string | number;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[1.5rem] bg-dark-card h-fit border border-white/5"
    >
      <div className="relative">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
        />
        {/* Permanent gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
        <span className="text-accent text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 opacity-80 md:opacity-0 md:transform md:-translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {project.categoryName}
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
          {project.title}
        </h3>
        
        <div className="flex items-center gap-3 overflow-hidden">
          <Link
            to={`/portfolio/${project.id}`}
            className="flex items-center gap-2 text-white/90 md:text-white/70 hover:text-white text-xs font-semibold transition-all group/link"
          >
            <span>View Project</span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/link:bg-accent group-hover/link:text-white transition-all">
              <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
