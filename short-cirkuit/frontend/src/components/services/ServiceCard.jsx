import React from 'react';
import { motion as Motion } from 'framer-motion';

const ServiceCard = ({ service, onClick, width, cardHeight = 400, isMobileMode = false }) => {
  return (
    <Motion.div
      onClick={onClick}
      style={{ width: width, minWidth: width, height: cardHeight }}
      className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/5 snap-start"
      whileHover={isMobileMode ? undefined : { y: -5, transition: { duration: 0.2 } }}
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-all duration-700 
                     grayscale brightness-[0.3] scale-100 
                     group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110" 
        />
      </div>

      <div className={`absolute inset-0 ${isMobileMode ? 'opacity-40' : 'opacity-0 group-hover:opacity-60'} bg-linear-to-t ${service.color} mix-blend-multiply transition-opacity duration-500 z-10`} />
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end z-20 bg-linear-to-t from-black via-transparent to-transparent">
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 bg-black/60 rounded border border-white/10 group-hover:border-white/40 transition-colors backdrop-blur-sm">
                {service.icon}
            </div>

            <h3 className={`text-lg sm:text-xl font-bold text-white font-cyber tracking-wider mb-2 ${isMobileMode ? '' : 'translate-y-4 group-hover:translate-y-0'} transition-transform duration-300 drop-shadow-lg`}>
                {service.title}
            </h3>
            
            <p className={`text-gray-300 text-xs sm:text-sm ${isMobileMode ? 'mb-3 opacity-100 h-auto' : 'mb-0 h-0 overflow-hidden group-hover:h-auto group-hover:mb-4 opacity-0 group-hover:opacity-100'} transition-all duration-500 delay-75`}>
                {service.desc}
            </p>

            <div className={`w-full h-px bg-white/40 ${isMobileMode ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} transition-transform origin-left duration-500`} />
      </div>
    </Motion.div>
  );
};

export default ServiceCard;
