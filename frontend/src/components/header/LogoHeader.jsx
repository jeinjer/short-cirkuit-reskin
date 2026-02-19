import React from 'react';
import logoImg from '../../assets/LogoHeader.png';

export default function HeaderLogo() {
  return (
    <div className="relative h-16 sm:h-16 md:h-20 w-72 sm:w-72 md:w-80 flex items-center z-50 group cursor-pointer select-none pointer-events-auto overflow-visible">
      
      <img 
        src={logoImg} 
        alt="ShortCirkuit Logo" 
        className="
            absolute top-1/2 -translate-y-1/2 left-0
            h-24 sm:h-24 md:h-28 w-auto max-w-none object-contain
            opacity-90 
            drop-shadow-[0_0_1px_rgba(6,182,212,0.3)]
            transition-all duration-300 ease-in-out
            group-hover:opacity-100 
            group-hover:brightness-110
            group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]
        "
      />
    </div>
  );
}
