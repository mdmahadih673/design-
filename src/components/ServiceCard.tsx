import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '@/src/types';

interface ServiceCardProps {
  service: Service;
  index: number;
  key?: string | number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  // @ts-ignore
  const Icon = Icons[service.icon] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 hover:border-accent/30 transition-all group"
    >
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold font-heading mb-3">{service.title}</h3>
      <p className="text-light-text text-sm leading-relaxed mb-6">
        {service.description}
      </p>
      
      <ul className="space-y-2">
        {service.deliverables.slice(0, 3).map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-light-text">
            <div className="w-1 h-1 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
