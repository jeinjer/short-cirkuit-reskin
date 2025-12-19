import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const navLinks = [
    { label: "PC ARMADAS", value: "COMPUTADORAS" },
    { label: "NOTEBOOKS", value: "NOTEBOOKS" },
    { label: "MONITORES", value: "MONITORES" },
    { label: "IMPRESORAS", value: "IMPRESORAS" } 
];

export default function DesktopNav() {
  return (
    <div className="hidden lg:block border-t border-white/5 bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-8 py-2">
                {navLinks.map((item, i) => (
                    <Link 
                      key={i} 
                      to={`/catalogo?category=${item.value}`} 
                      className="text-[11px] font-bold text-gray-400 hover:text-cyan-400 transition-colors tracking-widest cursor-pointer flex items-center gap-1 group"
                    >
                        {item.label}
                        <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-180 duration-300"/>
                    </Link>
                ))}
            </nav>
        </div>
    </div>
  );
}