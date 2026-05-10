import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { usePortfolioData } from '../hooks/usePortfolioData';

export function WhatsAppButton() {
  const { settings } = usePortfolioData();
  
  if (settings?.whatsappEnabled === false) return null;

  const phoneNumber = settings?.whatsappNumber || '8801608171029';

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`} 
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-[#25D366] text-white p-3.5 md:p-4 rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-shadow"
    >
      <MessageCircle size={28} className="md:w-8 md:h-8" />
      <span className="absolute right-full mr-4 bg-white dark:bg-dark-card text-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
        Chat with me
      </span>
    </motion.a>
  );
}
