import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { Button } from '@/src/components/Button';
import Markdown from 'react-markdown';

export function BlogPostDetails() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, 'blog', id));
        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Post not found</h2>
      <Link to="/blog">
        <Button>Back to Blog</Button>
      </Link>
    </div>
  );

  return (
    <div className="py-24 px-6 min-h-screen">
      <article className="max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-light-text hover:text-accent transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-6 mb-8 text-xs font-bold uppercase tracking-widest text-light-text opacity-60">
            <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Clock size={14} /> 5 min read</span>
            <span className="flex items-center gap-2 text-accent"><User size={14} /> By Alex</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-8 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-light-text leading-relaxed font-medium italic border-l-4 border-accent pl-6 mb-12">
            {post.excerpt}
          </p>
        </header>

        <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl">
          <img 
            src={post.coverImage || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop"} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-accent prose-img:rounded-3xl">
          <Markdown>{post.content}</Markdown>
        </div>

        <footer className="mt-24 pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-black/5">
                <img src="https://images.unsplash.com/photo-1519085184628-66e7371f1140?q=80&w=100&auto=format&fit=crop" alt="Author" className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <h4 className="font-bold">Alex Designer</h4>
                <p className="text-sm text-light-text">Creative Director & Visual Storyteller</p>
              </div>
           </div>
           <div className="flex gap-4">
              <Button variant="outline" size="sm" className="gap-2 rounded-full px-6">
                <Share2 size={16} /> Share Post
              </Button>
           </div>
        </footer>
      </article>
    </div>
  );
}
