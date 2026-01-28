import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function FullscreenViewer({ image, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      <motion.img 
        src={image}
        layoutId={`product-image-${image}`} 
        className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
        onClick={(e) => e.stopPropagation()} 
      />
    </motion.div>
  );
}