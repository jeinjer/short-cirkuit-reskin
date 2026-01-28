import React from "react";
import { motion } from "framer-motion";

export default function ElectricBoltLoader({ size = "lg" }) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-36 h-36",
    xl: "w-48 h-48",
  };

  const hexPath = "M50 4 L94 26 L94 74 L50 96 L6 74 L6 26 Z";
  
  const boltPath = `
    M 62 18
    L 48 40
    L 58 42
    L 38 72
  `;

  const hexPulse = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const boltStrike = {
    hidden: { opacity: 0, pathLength: 0 },
    animate: {
      opacity: [0, 1, 1, 0],
      pathLength: [0, 1, 1, 1],
      transition: {
        duration: 1.2,
        times: [0, 0.2, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={hexPath}
          stroke="#0f172a"
          strokeWidth="1"
          fill="rgba(6,182,212,0.04)"
        />
        <motion.path
          d={hexPath}
          stroke="url(#hexStroke)"
          strokeWidth="2"
          strokeLinecap="round"
          variants={hexPulse}
          animate="animate"
        />

        <motion.g variants={boltStrike} initial="hidden" animate="animate">
          <path
            d={boltPath}
            stroke="#22d3ee"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
            filter="url(#softGlow)"
          />
          <path
            d={boltPath}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        <motion.circle
          cx="38"
          cy="72"
          r="2.5"
          fill="#22d3ee"
          variants={boltStrike}
          initial="hidden"
          animate="animate"
          filter="url(#softGlow)"
        />
      </svg>

      <motion.div
        className="absolute w-1/2 h-1/2 rounded-full bg-cyan-400/20 blur-[32px]"
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
