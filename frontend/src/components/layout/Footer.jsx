import React from 'react';
import { ChevronRight } from 'lucide-react';
import TechLogo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] pt-20 pb-10 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <TechLogo />
              <p className="text-gray-500 text-sm leading-relaxed">
                Llevamos la tecnología al límite. Expertos en hardware de alto rendimiento para gaming y uso profesional.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 font-mono tracking-wider text-sm">PRODUCTOS</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {['Computadoras', 'Notebooks', 'Componentes', 'Periféricos'].map(item => (
                    <li key={item} className="hover:text-cyan-400 cursor-pointer transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item}
                    </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 font-mono tracking-wider text-sm">SOPORTE</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {['Estado del pedido', 'Garantía', 'Contacto', 'Ayuda'].map(item => (
                    <li key={item} className="hover:text-cyan-400 cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 font-mono tracking-wider text-sm">NEWSLETTER</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Tu email..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:border-cyan-500 outline-none text-white transition-colors focus:bg-white/10"/>
                <button className="bg-cyan-500 hover:bg-cyan-400 text-black p-2 rounded-lg transition-colors shadow-lg hover:shadow-cyan-500/50">
                  <ChevronRight size={20}/>
                </button>
              </div>
            </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 ShortCirkuit. Todos los derechos reservados.</p>
          <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
              <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}