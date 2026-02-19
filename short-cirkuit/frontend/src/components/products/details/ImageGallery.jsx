import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

export default function ImageGallery({ images, onImageClick }) {
  if (images.length === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full aspect-square bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden relative group cursor-zoom-in shadow-2xl"
        onClick={() => onImageClick(images[0])}
      >
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent opacity-50" />
        <img src={images[0]} alt="Main" className="w-full h-full object-contain p-4 sm:p-8 transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 bg-black/50 backdrop-blur rounded border border-white/10 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 size={18} />
        </div>
      </motion.div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0f] group cursor-zoom-in"
            onClick={() => onImageClick(img)}
          >
            <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-2 aspect-square md:aspect-auto md:min-h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0f] relative group cursor-zoom-in"
        onClick={() => onImageClick(images[0])}
      >
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent opacity-50" />
        <img src={images[0]} alt="Main" className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500" />
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:min-h-[460px]">
        {images.slice(1, 3).map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0f] relative group cursor-zoom-in aspect-square"
            onClick={() => onImageClick(img)}
          >
            <img src={img} alt={`Detail ${idx}`} className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
