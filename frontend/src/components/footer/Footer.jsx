import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur-sm pt-8 pb-8">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex flex-col gap-3 text-xs">
             <p className="text-gray-600">
               ®{new Date().getFullYear()} Short Cirkuit. Todos los derechos reservados.
             </p>
             
             <p className="text-gray-500 italic">
                 Hecha por{' '}
                 <a 
                   href="https://www.linkedin.com/in/stefanotommasi15/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors font-medium"
                 >
                   Stefano Tommasi
                 </a>
             </p>
          </div>
      </div>
    </footer>
  );
}