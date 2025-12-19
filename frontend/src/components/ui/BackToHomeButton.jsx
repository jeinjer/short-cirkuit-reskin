import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackToHomeButton() {
  return (
    <>
      <div className="md:hidden absolute top-6 left-0 right-0 flex justify-center z-50">
        <Link 
          to="/" 
          className="text-gray-500 underline hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2 py-2 px-4"
        >
          <ArrowLeft size={14} /> Volver al inicio
        </Link>
      </div>

      <Link 
        to="/" 
        className="hidden md:flex absolute top-8 left-8 z-50 items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group outline-none"
      >
         <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
         <span className="font-medium text-sm pb-0.5">Volver al inicio</span>
      </Link>
    </>
  );
}