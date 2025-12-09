import React from 'react';
import { Monitor, Laptop, Printer, Cpu } from 'lucide-react';

export default function CategorySelector({ onSelectCategory, selectedCategory }) {
  const categories = [
    { id: 'computadoras', label: 'Computadoras', icon: Cpu },
    { id: 'notebooks', label: 'Notebooks', icon: Laptop },
    { id: 'monitores', label: 'Monitores', icon: Monitor },
    { id: 'impresoras', label: 'Impresoras', icon: Printer },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isActive ? null : cat.id)}
            className={`
              group relative flex flex-col items-center justify-center p-8 rounded-2xl 
              transition-all duration-300 border cursor-pointer
              ${isActive 
                ? 'bg-[#0f0f13] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                : 'bg-[#0a0a0f] border-white/5 hover:border-cyan-500/50 hover:bg-[#0f0f13] hover:-translate-y-1'
              }
            `}
          >
            <div className={`
              mb-4 p-4 rounded-full bg-cyan-500/5 
              transition-transform duration-300 group-hover:scale-110
            `}>
              <Icon 
                size={48} 
                strokeWidth={1.5}
                className={`
                  ${isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-cyan-500'}
                `} 
              />
            </div>

            <h3 className={`
              text-lg font-bold tracking-wide uppercase
              ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
            `}>
              {cat.label}
            </h3>
          </button>
        );
      })}
    </div>
  );
}