import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const heroImages = [
  "public/hero/gabinete.png",
  "public/hero/monitor.png",
  "public/hero/notebook.png",
  "public/hero/impresora.png",
];

export default function HeroCarousel() {
  return (
    <div className="hidden md:block relative h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] group bg-[#050507]">
      
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        speed={1000}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.custom-swiper-pagination',
        }}
        navigation={{
          nextEl: '.button-next-hero',
          prevEl: '.button-prev-hero',
        }}
        className="h-full w-full"
      >
        {heroImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-linear-to-t from-[#050507] via-transparent to-transparent z-10 opacity-60"></div>
                <div className="absolute inset-0 bg-blue-900/10 z-10 mix-blend-overlay"></div>
                
                <img 
                    src={img} 
                    alt={`Hero slide ${index + 1}`} 
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="button-prev-hero absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 border border-cyan-500/30 text-cyan-400 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer backdrop-blur-sm">
        <ChevronLeft size={24} />
      </button>
      <button className="button-next-hero absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 border border-cyan-500/30 text-cyan-400 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer backdrop-blur-sm">
        <ChevronRight size={24} />
      </button>

      <div className="custom-swiper-pagination absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3 pointer-events-none"></div>

      <style>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.3;
          transition: all 0.3s ease;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: #06b6d4;
          box-shadow: 0 0 15px #06b6d4;
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}