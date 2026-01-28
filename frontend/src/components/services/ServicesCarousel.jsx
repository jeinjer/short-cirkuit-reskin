import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

import { servicesData } from '../../data/services/services.data';

import BackgroundFX from '../others/BackgroundFX';
import SectionHeader from './SectionHeader';
import CarouselTrack from './CarouselTrack';
import ServiceModal from './ServiceModal';

const CONFIG = {
  CARD_WIDTH: 350,
  GAP: 32,
  SPEED: 0.5,
  DUPLICATION_FACTOR: 4
};

const MARQUEE_ITEMS = Array(CONFIG.DUPLICATION_FACTOR).fill(servicesData).flat();

const ServicesCarousel = () => {
  const [selectedService, setSelectedService] = useState(null);

  const { 
    x, 
    setIsDragging, 
    setIsHovered, 
    setIsModalOpen,
    isDragging
  } = useInfiniteScroll(
    servicesData.length, 
    CONFIG.CARD_WIDTH, 
    CONFIG.GAP, 
    CONFIG.SPEED
  );

  const handleCardClick = (service) => {
    if (!isDragging) {
      setSelectedService(service);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  return (
    <section className="py-24 bg-[#030303] relative overflow-hidden font-sans flex flex-col items-center">
      
      <BackgroundFX />
      
      <SectionHeader />

      <CarouselTrack 
        items={MARQUEE_ITEMS}
        x={x}
        cardWidth={CONFIG.CARD_WIDTH}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onCardClick={handleCardClick}
      />

      <AnimatePresence>
        {selectedService && (
          <ServiceModal 
            service={selectedService} 
            onClose={handleCloseModal} 
          />
        )}
      </AnimatePresence>
      
    </section>
  );
};

export default ServicesCarousel;