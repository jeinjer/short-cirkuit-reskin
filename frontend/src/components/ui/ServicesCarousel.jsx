import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { HardDrive, Wind, Download, Headphones, Wrench, Zap, ShieldAlert, Cpu } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/free-mode'; 

const services = [
  { title: "Formateos", icon: HardDrive, desc: "Windows / Linux" },
  { title: "Limpiezas", icon: Wind, desc: "Hardware & Soft" },
  { title: "Instalación", icon: Download, desc: "Programas & Drivers" },
  { title: "Soporte Remoto", icon: Headphones, desc: "AnyDesk / TeamViewer" },
  { title: "Ensambles", icon: Wrench, desc: "Armado de PC Gamer" },
  { title: "Optimización", icon: Zap, desc: "FPS & Rendimiento" },
  { title: "Antivirus", icon: ShieldAlert, desc: "Limpieza Malware" },
  { title: "Upgrade", icon: Cpu, desc: "Mejora de componentes" },
];

export default function ServicesCarousel() {
  return (
    <div className="w-full py-10 bg-[#0a0a0f]">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-xl font-bold text-white font-mono tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
          NUESTROS SERVICIOS
        </h2>
      </div>

      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={20}
          slidesPerView="auto"
          loop={true}
          speed={6000}
          freeMode={{
             enabled: true,
             momentum: true,
             momentumRatio: 0.5
          }}
          grabCursor={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 15 },
            640: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 4.5, spaceBetween: 25 },
            1280: { slidesPerView: 4.8, spaceBetween: 30 },
          }}
          className="services-swiper"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index} style={{ width: '260px' }}>
              <div className="h-40 bg-[#13131a] border border-cyan-500/20 rounded-xl p-6 flex flex-col justify-center items-start gap-3 relative overflow-hidden group select-none shadow-lg hover:border-cyan-500/40 transition-colors">
                
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50 shadow-[0_0_10px_#06b6d4]"></div>

                <div className="relative z-10 p-2 bg-cyan-900/10 rounded-lg text-cyan-400 mb-1">
                  <service.icon size={28} />
                </div>
                
                <div className="relative z-10 subpixel-antialiased transform-gpu">
                  <h3 className="text-white font-bold font-mono text-xl uppercase tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-medium font-mono mt-1">
                    {service.desc}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .swiper-wrapper {
          transition-timing-function: linear;
        }
      `}</style>
    </div>
  );
}