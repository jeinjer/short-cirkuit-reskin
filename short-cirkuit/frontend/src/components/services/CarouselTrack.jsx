import React from 'react';
import { motion as Motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

const CarouselTrack = ({ 
  items, 
  x, 
  onDragStart, 
  onDragEnd, 
  onHoverStart, 
  onHoverEnd, 
  onCardClick,
  cardWidth,
  cardHeight,
  isMobileMode = false
}) => {
  const maskStyle = {
    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
  };

  if (isMobileMode) {
    return (
      <div className="relative w-full z-20 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((service, index) => (
            <ServiceCard
              key={`${service.id}-mobile-${index}`}
              service={service}
              width={cardWidth}
              cardHeight={cardHeight}
              isMobileMode
              onClick={() => onCardClick(service)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[500px] flex items-center z-20"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={maskStyle}
    >
      <Motion.div
        style={{ x, cursor: "grab" }}
        className="flex gap-8 px-8 absolute left-0"
        drag="x"
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        {items.map((service, index) => (
          <ServiceCard 
            key={`${service.id}-clone-${index}`} 
            service={service} 
            width={cardWidth}
            cardHeight={cardHeight}
            onClick={() => onCardClick(service)}
          />
        ))}
      </Motion.div>
    </div>
  );
};

export default CarouselTrack;
