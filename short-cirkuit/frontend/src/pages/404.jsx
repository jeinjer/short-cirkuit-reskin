import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Unplug, Zap, ArrowLeft, WifiOff } from 'lucide-react';

const ZAP_PARTICLES = [
  { id: 1, pos: 'top-0 right-0', size: 48, dx: 18, dy: -10, repeatDelay: 0.1 },
  { id: 2, pos: 'bottom-4 left-4', size: 42, dx: -16, dy: 14, repeatDelay: 0.35 },
  { id: 3, pos: 'top-1/3 -left-8', size: 52, dx: -22, dy: -8, repeatDelay: 0.2 },
  { id: 4, pos: '-bottom-8 right-1/3', size: 44, dx: 14, dy: 20, repeatDelay: 0.45 }
];

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
    visible: (particle) => ({
      opacity: [0, 1, 0],
      scale: [0.8, 1.5, 0.8],
      x: [0, particle.dx],
      y: [0, particle.dy],
      transition: {
        delay: particle.id * 0.2,
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: particle.repeatDelay
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#13132b] via-[#050507] to-[#050507] z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-80 sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <Motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <div className="relative inline-block mb-12">
            <Motion.div 
                 animate={{ opacity: [0.2, 0.5, 0.2] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-2xl"
            />

            <Motion.div variants={plugVariants} animate="shake" className="relative z-20">
                <Unplug size={130} className="sm:hidden text-gray-700 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" strokeWidth={1.5} />
                <Unplug size={180} className="hidden sm:block text-gray-700 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" strokeWidth={1.5} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500/30">
                    <WifiOff size={58} className="sm:hidden" />
                    <WifiOff size={80} className="hidden sm:block" />
                </div>
            </Motion.div>

            {ZAP_PARTICLES.map((particle) => (
                <Motion.div
                    key={particle.id}
                    custom={particle}
                    variants={zapVariants}
                    initial="hidden"
                    animate="visible"
                    className={`absolute text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] z-30
                        ${particle.pos}
                    `}
                >
                    <Zap size={particle.size} fill="currentColor" />
                </Motion.div>
            ))}
        </div>

        <h1 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 via-cyan-400 to-blue-600 relative inline-block">
            <span className="absolute top-0 left-0 -ml-1 -mt-1 text-red-500/30 blur-sm opacity-70 animate-pulse">404</span>
            404
        </h1>

        <h2 className="text-2xl sm:text-3xl text-white font-black mt-6 uppercase tracking-wider drop-shadow-lg">
          ¡Cortocircuito Detectado!
        </h2>

        <p className="text-gray-400 mt-6 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
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
      </Motion.div>

    </div>
  );
}
