import React from 'react';

const SectionHeader = () => (
  <div className="container mx-auto px-4 mb-10 sm:mb-16 relative z-10 text-center">
    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-widest font-cyber mb-4">
      Nuestros <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-950">Servicios</span>
    </h2>
    <div className="h-1 w-24 bg-violet-600 mx-auto rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
  </div>
);

export default SectionHeader;
