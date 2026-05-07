import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ title, subtitle, align = 'center', className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'max-w-2xl mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-light-text text-lg md:text-xl font-medium">
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-1.5 w-20 bg-accent rounded-full mt-6",
        align === 'center' ? "mx-auto" : ""
      )} />
    </motion.div>
  );
}
