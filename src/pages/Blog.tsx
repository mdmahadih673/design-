import { motion } from 'motion/react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/Button';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';

export function Blog() {
  const { blog, categories, loading } = usePortfolioData();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  return (
    <div className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Blog & Insights" 
          subtitle="Design tips, creative process, and industry insights."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blog && blog.map((post: any, i: number) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-3xl bg-white dark:bg-dark-card border border-black/5 dark:border-white/5 overflow-hidden flex flex-col shadow-xl shadow-transparent hover:shadow-accent/5 hover:border-accent/30 transition-all duration-300"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img 
                  src={post.coverImage || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop"} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {post.isFeatured && (
                  <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                    {categories.find(c => c.id === post.categoryId)?.name || 'Design'}
                  </span>
                  <span className="text-[10px] text-light-text font-bold uppercase tracking-widest opacity-60">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-light-text mb-8 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`}>
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent text-accent font-bold group-hover:gap-4 transition-all">
                    Read Full Article <span className="ml-2 transition-all">→</span>
                  </Button>
                </Link>
              </div>
            </motion.article>
          ))}
          {(!blog || blog.length === 0) && (
            <div className="col-span-full py-20 text-center text-light-text italic opacity-50">
              No blog posts published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
