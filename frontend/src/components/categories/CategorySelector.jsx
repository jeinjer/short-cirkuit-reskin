import React from 'react';
import { categories } from '../../data/categories/categories.data';

const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
  const activeId = selectedCategory || 'all';

  return (
    <div className="w-full mb-12 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 pb-6">
          {categories.map((cat) => {
            const isActive = activeId === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'all' ? null : cat.id)}
                className={`
                  group cursor-pointer relative flex items-center gap-3 px-6 py-4 transition-all duration-300 border
                  rounded-t-lg md:rounded-lg
                  ${isActive 
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)] translate-y-0' 
                    : 'bg-[#0f0f12] border-white/5 hover:border-cyan-500/50 hover:bg-[#1a1a20] text-gray-400 hover:text-white hover:-translate-y-1'
                  }
                `}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'}`} 
                />
                
                <span className={`text-sm md:text-base font-bold tracking-wider font-cyber ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {cat.label}
                </span>

                {isActive && (
                   <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;