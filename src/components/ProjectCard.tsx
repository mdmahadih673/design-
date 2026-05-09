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
      className="group relative overflow-hidden rounded-[1.2rem] bg-dark-card border border-white/5 h-fit shadow-lg hover:shadow-accent/5 transition-all duration-500"
    >
      <div className="relative overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Subtle overlay that intensifies on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <span className="text-accent text-[9px] font-bold uppercase tracking-[0.3em] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.categoryName}
        </span>
        <h3 className="text-sm md:text-base font-bold text-white mb-3 line-clamp-2 leading-tight drop-shadow-md">
          {project.title}
        </h3>
        
        <Link
          to={`/portfolio/${project.id}`}
          className="flex items-center gap-2 text-white/40 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-all group/link"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Full Case Study</span>
          <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all">
            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
