import React from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';

export default function SidePanel({ isOpen, onClose, title }) {
  const sidebarVariants = {
    hidden: { x: '100%' }, 
    visible: { x: 0 },     
    exit: { x: '100%' }    
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-60 backdrop-blur-[1px]"
      />
      
      <motion.div 
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        className="fixed right-0 top-0 h-full w-[85%] sm:w-[400px] bg-[#0a0a0e] border-l border-white/10 z-70 shadow-2xl flex flex-col"
      >
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#0a0a0e]">
          <h2 className="text-white font-bold flex items-center gap-2">
            <ShoppingCart size={18} className="text-cyan-500"/> {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20}/>
          </button>
        </div>
        
        <div className="flex-1 p-5 text-gray-500 flex flex-col items-center justify-center gap-4">
            <ShoppingCart size={40} className="opacity-20"/>
            <p>Tu carrito está vacío</p>
            <button onClick={onClose} className="text-cyan-400 text-sm hover:underline cursor-pointer">
                Seguir comprando
            </button>
        </div>
      </motion.div>
    </>
  );
}