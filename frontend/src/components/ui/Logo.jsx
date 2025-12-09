import React from 'react';
import logoImg from '../../assets/LogoHeader.png';

export default function TechLogo() {
  return (
    <div className="relative h-10 w-48 flex items-center z-50 group cursor-pointer select-none pointer-events-auto">
      
      <img 
        src={logoImg} 
        alt="ShortCirkuit Logo" 
        className="
            absolute top-1/2 -translate-y-1/2 left-0 
            h-28 w-auto max-w-none object-contain 
            opacity-90 
            
            /* ESTADO BASE: Sombra muy sutil */
            drop-shadow-[0_0_1px_rgba(6,182,212,0.3)]
            
            /* TRANSICIÓN: Suave (300ms) para que no sea brusco */
            transition-all duration-300 ease-in-out
            
            /* HOVER - EFECTO ELÉCTRICO DISCRETO */
            /* 1. Opacidad al 100% */
            group-hover:opacity-100 
            
            /* 2. Aumentamos un poco el brillo (Luz) */
            group-hover:brightness-110
            
            /* 3. El Glow: Una sombra cian difusa y suave sin movimiento */
            group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]
        "
      />
    </div>
  );
}