import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Unplug, Zap, ArrowLeft, WifiOff } from 'lucide-react';

export default function NotFoundPage() {
  const plugVariants = {
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      rotate: [0, -2, 2, -1, 1, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 2
      }
    }
  };


  const zapVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: i => ({
      opacity: [0, 1, 0],
      scale: [0.8, 1.5, 0.8],
      x: [0, (Math.random() - 0.5) * 50], 
      y: [0, (Math.random() - 0.5) * 50], 
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: Math.random() * 0.5
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#13132b] via-[#050507] to-[#050507] z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <div className="relative inline-block mb-12">
            <motion.div 
                 animate={{ opacity: [0.2, 0.5, 0.2] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl"
            />

            <motion.div variants={plugVariants} animate="shake" className="relative z-20">
                <Unplug size={180} className="text-gray-700 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" strokeWidth={1.5} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500/30">
                    <WifiOff size={80} />
                </div>
            </motion.div>

            {[1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={zapVariants}
                    initial="hidden"
                    animate="visible"
                    className={`absolute text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] z-30
                        ${i === 1 ? 'top-0 right-0' : ''}
                        ${i === 2 ? 'bottom-4 left-4' : ''}
                        ${i === 3 ? 'top-1/3 -left-8' : ''}
                        ${i === 4 ? '-bottom-8 right-1/3' : ''}
                    `}
                >
                    <Zap size={40 + Math.random() * 20} fill="currentColor" />
                </motion.div>
            ))}
        </div>

        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 via-cyan-400 to-blue-600 relative inline-block">
            <span className="absolute top-0 left-0 -ml-1 -mt-1 text-red-500/30 blur-sm opacity-70 animate-pulse">404</span>
            404
        </h1>

        <h2 className="text-3xl text-white font-black mt-6 uppercase tracking-wider drop-shadow-lg">
          ¡Cortocircuito Detectado!
        </h2>

        <p className="text-gray-400 mt-6 text-lg max-w-md mx-auto leading-relaxed">
          Ups... parece que la página que buscas no está disponible. 
        </p>

        <div className="mt-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:-translate-y-1 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
        </div>
      </motion.div>

    </div>
  );
}