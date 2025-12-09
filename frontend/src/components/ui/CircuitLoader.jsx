import React from 'react';

const CircuitLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center w-32 h-12">
        <div className="absolute left-0 w-[45%] h-1 bg-gray-700 rounded-l-full overflow-hidden">
          <div className="w-full h-full bg-cyan-500/50 animate-[pulse_1s_ease-in-out_infinite]"></div>
        </div>
        
        <div className="absolute right-0 w-[45%] h-1 bg-gray-700 rounded-r-full overflow-hidden">
             <div className="w-full h-full bg-cyan-500/50 animate-[pulse_1s_ease-in-out_infinite_0.5s]"></div>
        </div>

            <div className="relative z-10 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-ping absolute opacity-75"></div>
            <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] animate-pulse"></div>
            <span className="absolute w-8 h-0.5 bg-cyan-300 rotate-45 animate-[spin_0.2s_linear_infinite] opacity-0 group-hover:opacity-100"></span>
            <span className="absolute w-8 h-0.5 bg-cyan-300 -rotate-45 animate-[spin_0.3s_linear_infinite_reverse]"></span>
        </div>
      </div>

      <p className="text-cyan-500 font-mono text-xl tracking-widest animate-pulse">
        OBTENIENDO PRODUCTOS...
      </p>
    </div>
  );
};

export default CircuitLoader;