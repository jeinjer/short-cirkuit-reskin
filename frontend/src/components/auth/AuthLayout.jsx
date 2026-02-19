import React from 'react';
import { motion } from 'framer-motion';
import BackToHomeButton from '../others/BackToHomeButton';

export default function AuthLayout({ children, cardClassName = '', containerClassName = '', initialY = 24 }) {
  return (
    <div className={`min-h-screen bg-[#050507] flex items-center justify-center px-4 py-4 md:p-4 relative overflow-hidden ${containerClassName}`}>

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] opacity-35 pointer-events-none z-0" />
      <div className="absolute top-[-18%] left-[-8%] w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-24%] right-[-12%] w-[560px] h-[560px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: initialY }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full bg-[#0b0c12]/95 border border-cyan-500/20 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.55)] backdrop-blur-xl ${cardClassName}`}
        >
          {children}
        </motion.div>
        <BackToHomeButton />
      </div>
    </div>
  );
}
