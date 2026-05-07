import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105',
    secondary: 'bg-dark-card text-white hover:bg-dark-card/80 border border-white/10',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
    ghost: 'hover:bg-black/5 dark:hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-base',
  };

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
