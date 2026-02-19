import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

import { servicesData } from '../../data/services/services.data';

import BackgroundFX from '../others/BackgroundFX';
import SectionHeader from './SectionHeader';
import CarouselTrack from './CarouselTrack';
import ServiceModal from './ServiceModal';

const CONFIG = {
  GAP: 32,
  SPEED: 0.5,
  DUPLICATION_FACTOR: 4
};

const ServicesCarousel = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobileMode = viewportWidth < 768;
  const cardWidth = isMobileMode
    ? Math.min(340, Math.max(260, viewportWidth - 56))
    : 350;
  const cardHeight = isMobileMode ? 320 : 400;

  const marqueeItems = useMemo(
    () => (isMobileMode ? servicesData : Array(CONFIG.DUPLICATION_FACTOR).fill(servicesData).flat()),
    [isMobileMode]
  );

  const { 
    x, 
    setIsDragging, 
    setIsHovered, 
    setIsModalOpen,
    isDragging
  } = useInfiniteScroll(
    servicesData.length, 
    cardWidth,
    CONFIG.GAP, 
    CONFIG.SPEED,
    !isMobileMode
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
    <section className="py-16 sm:py-20 md:py-24 bg-[#030303] relative overflow-hidden font-sans flex flex-col items-center">
      
      <BackgroundFX />
      
      <SectionHeader />

      <CarouselTrack 
        items={marqueeItems}
        x={x}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        isMobileMode={isMobileMode}
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
