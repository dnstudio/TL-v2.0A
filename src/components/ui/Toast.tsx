import React from 'react';
import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div 
        initial={{ opacity: 0, y: 20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 20, x: "-50%" }}
        className="fixed bottom-10 left-[55%] -translate-x-1/2 bg-secondary-balance text-secondary-balance-text border border-secondary-balance-text/20 px-6 py-3 rounded-lg z-[2000] shadow-lg flex items-center gap-2 text-sm font-semibold"
      >
        <Check size={18} strokeWidth={3} className="text-secondary-balance-text" />
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);
