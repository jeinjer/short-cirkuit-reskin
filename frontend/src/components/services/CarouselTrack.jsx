import React from 'react';
import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

const CarouselTrack = ({ 
  items, 
  x, 
  onDragStart, 
  onDragEnd, 
  onHoverStart, 
  onHoverEnd, 
  onCardClick,
  cardWidth
}) => {
  const maskStyle = {
    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
  };

  return (
    <div 
      className="relative w-full h-[500px] flex items-center z-20"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={maskStyle}
    >
      <motion.div
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
            onClick={() => onCardClick(service)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CarouselTrack;