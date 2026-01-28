import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

const ServiceModal = ({ service, onClose }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      <motion.div
        layoutId={`modal-${service.id}`}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-4xl bg-[#080808] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row z-50 max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white border border-white/10 transition-colors">
            <X size={20} />
        </button>
        
        <div className="w-full md:w-5/12 relative h-56 md:h-auto">
          <div className={`absolute inset-0 bg-linear-to-br ${service.color} mix-blend-overlay opacity-60 z-10`} />
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-[#090909] relative">
            <div className="flex items-center gap-3 mb-4 opacity-50">
                {service.icon}
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 font-cyber uppercase leading-none">{service.title}</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">{service.fullDesc}</p>
            <button className="py-3 px-6 bg-white text-black font-bold font-cyber uppercase tracking-wider text-sm hover:bg-violet-500 hover:text-white transition-colors w-fit flex gap-2 items-center">
                Contactar <ArrowRight size={16}/>
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceModal;