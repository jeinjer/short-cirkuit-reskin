import { useState, useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';

export const useInfiniteScroll = (itemCount, cardWidth, gap, speed = 0.5) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const totalSetWidth = (cardWidth + gap) * itemCount;

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (!isDragging && !isHovered && !isModalOpen) {
        let currentX = x.get();
        currentX -= speed;

        if (currentX <= -totalSetWidth) {
           currentX = 0;
        }
        x.set(currentX);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, isHovered, isModalOpen, totalSetWidth, x, speed]);

  return {
    x,
    containerRef,
    isDragging,
    isHovered,
    setIsDragging,
    setIsHovered,
    setIsModalOpen,
    totalSetWidth
  };
};
