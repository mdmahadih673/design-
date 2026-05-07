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
      className="group relative overflow-hidden rounded-2xl bg-dark-card"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6">
        <span className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
          {project.categoryName}
        </span>
        <h3 className="text-xl font-bold text-white mb-4">{project.title}</h3>
        <Link
          to={`/portfolio/${project.id}`}
          className="inline-flex items-center gap-2 text-white text-sm font-semibold hover:text-accent transition-colors"
        >
          View Project <ArrowRight size={16} />
        </Link>
      </div>

      <div className="p-4 md:hidden">
        <span className="text-accent text-[10px] font-bold uppercase tracking-widest">
          {project.categoryName}
        </span>
        <h3 className="text-base font-bold truncate">{project.title}</h3>
      </div>
    </motion.div>
  );
}
