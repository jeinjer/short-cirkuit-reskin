import React from 'react';
import logoImg from '../../assets/LogoHeader.png';

export default function HeaderLogo() {
  return (
    <div className="relative h-10 w-48 flex items-center z-50 group cursor-pointer select-none pointer-events-auto">
      
      <img 
        src={logoImg} 
        alt="ShortCirkuit Logo" 
        className="
            absolute top-1/2 -translate-y-1/2 left-0 
            h-35 w-auto max-w-none object-contain 
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