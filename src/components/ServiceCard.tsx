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
      className="p-10 rounded-[2.5rem] bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 hover:bg-accent/5 hover:border-accent/30 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all" />
      
      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-dark-card shadow-xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-500">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold font-heading mb-4 tracking-tight">{service.title}</h3>
      <p className="text-light-text text-base leading-relaxed mb-8 opacity-70">
        {service.description}
      </p>
      
      <div className="space-y-3">
        {service.deliverables.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs text-light-text font-medium opacity-60">
            <div className="w-5 h-[1px] bg-accent/30" />
            {item}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
