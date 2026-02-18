import React from 'react';
import { motion } from 'framer-motion';

export default function CircuitLoader({ size = 'lg', label = 'Cargando...' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const boltPath = 'M56 6 L24 56 H45 L34 94 L76 42 H54 L56 6 Z';

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative ${sizeClasses[size] || sizeClasses.lg}`}>
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-400/20"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="boltFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="boltGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d={boltPath}
            fill="url(#boltFill)"
            stroke="#e0f2fe"
            strokeWidth="1.2"
            strokeLinejoin="round"
            filter="url(#boltGlow)"
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1.04, 0.98]
            }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '50% 50%' }}
          />

          <motion.path
            d={boltPath}
            stroke="#22d3ee"
            strokeWidth="1"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        </svg>
      </div>

      {label ? <p className="text-xs font-mono uppercase tracking-widest text-cyan-300/80">{label}</p> : null}
    </div>
  );
}
