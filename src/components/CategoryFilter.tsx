import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Category } from '@/src/types';

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = Object.values(Category);

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300',
            activeCategory === category
              ? 'bg-accent text-white shadow-lg shadow-accent/20'
              : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-light-text'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
