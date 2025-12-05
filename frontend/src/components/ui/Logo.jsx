import React from 'react';
import logoImg from '../../assets/LogoHeader.png';

export default function TechLogo() {
  return (
    <div className="relative h-10 w-auto flex items-center z-50 group cursor-pointer select-none pointer-events-auto px-2">
      
      <img 
        src={logoImg} 
        alt="ShortCirkuit Logo" 
        className="absolute top-1/2 -translate-y-1/2 left-0 h-20 w-auto max-w-none object-contain transition-all duration-200 ease-out opacity-90 drop-shadow-[0_0_1px_rgba(6,182,212,0.3)] group-hover:opacity-100 group-hover:drop-shadow-[0_0_2px_#ffffff_0_0_6px_#06b6d4] group-hover:brightness-150 group-hover:contrast-125"
      />
    </div>
  );
}