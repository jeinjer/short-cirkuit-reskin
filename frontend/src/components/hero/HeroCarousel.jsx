import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, ShieldCheck , Award, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroImages } from '../../data/hero/hero.data';


export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const scrollToServices = () => {
    const element = document.getElementById('services-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const element = document.getElementById('catalogo-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-white/5 bg-[#050507]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
         <h1 className="text-[15vw] leading-none font-black text-white/5 whitespace-nowrap tracking-tighter font-cyber">
           SHORT CIRKUIT
         </h1>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-20">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-[#0f0f13] border-l-4 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
               <Terminal size={16} className="text-cyan-400 animate-pulse" />
               <span className="text-gray-400 font-mono text-sm tracking-widest uppercase">
                 Villa Carlos Paz
               </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] font-cyber"
            >
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-blue-900 animate-pulse">
                SHORT CIRKUIT
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-400 text-lg max-w-lg border-l-2 border-white/10 pl-6 py-2 font-tech tracking-wide"
            >
              Servicio técnico especializado en hardware y software. <br />
              Armado de PC a medida, mantenimiento y optimización. <br />
              <span className="text-cyan-400 font-bold">¡Descubrí nuestros productos y servicios!</span>
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <button 
                onClick={scrollToCatalog}
                className="group relative px-8 py-4 bg-transparent overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 w-full h-full bg-cyan-600 transform skew-x-12 group-hover:skew-x-0 transition-transform duration-300 origin-right" />
                <div className="absolute inset-0 w-full h-full bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="absolute inset-0 border-2 border-cyan-500/50 skew-x-12 group-hover:skew-x-0 transition-all duration-300" />
                <span className="relative z-10 flex items-center gap-2 text-black font-black font-cyber uppercase tracking-wider">
                  Ver catálogo 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                  onClick={scrollToServices}
                  className="cursor-pointer group relative px-10 py-4 bg-transparent text-white font-bold font-cyber uppercase tracking-wider transition-all duration-300"
              >
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/30 group-hover:border-cyan-500 group-hover:w-full group-hover:h-full transition-all duration-500 ease-in-out" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/30 group-hover:border-purple-500 group-hover:w-full group-hover:h-full transition-all duration-500 ease-in-out" />
                <span className="absolute inset-0 bg-white/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
                   Nuestros Servicios
                   <ChevronDown size={16} className="opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                </span>
              </button>
            </motion.div>
          </div>

          <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center group pointer-events-none md:pointer-events-auto">
             
             <div className="absolute w-[400px] h-[400px] lg:w-[650px] lg:h-[650px] border border-cyan-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
             <div className="absolute w-[350px] h-[350px] lg:w-[550px] lg:h-[550px] border border-dashed border-cyan-500/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
             
             <div className="relative z-20 w-full h-full flex items-center justify-center p-4 animate-[float_6s_ease-in-out_infinite]">
                <AnimatePresence mode='wait'>
                    <motion.img
                        key={currentIndex}
                        src={heroImages[currentIndex].src}
                        alt={heroImages[currentIndex].alt}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-full max-h-[400px] lg:max-h-[600px] object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.4)] brightness-110"
                    />
                </AnimatePresence>
                
                <div className="absolute bottom-10 flex gap-2">
                    {heroImages.map((_, idx) => (
                        <div 
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>
             </div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1, duration: 0.8 }}
               className="absolute top-[15%] right-0 lg:-right-8 z-30 bg-[#0a0a0f]/90 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-[float_4s_ease-in-out_infinite]"
             >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-cyan-900/20 rounded-lg text-cyan-400">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Garantía</p>
                      <p className="font-bold font-cyber text-lg tracking-wide text-cyan-100 uppercase">De 1 año</p>
                   </div>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1.2, duration: 0.8 }}
               className="absolute bottom-[20%] left-0 lg:-left-8 z-30 bg-[#0a0a0f]/90 backdrop-blur-md border border-purple-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-[float_5s_ease-in-out_infinite]" 
               style={{ animationDelay: '1s' }}
             >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400">
                      <Award size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">Calidad</p>
                      <p className="text-white font-bold font-cyber text-lg tracking-wide uppercase">Asegurada</p>
                   </div>
                </div>
             </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}