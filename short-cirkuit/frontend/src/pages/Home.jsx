import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

import Hero from '../components/hero/HeroCarousel';
import HomeCatalogPreviewSection from '../components/home/HomeCatalogPreviewSection';
import { homeSectionRevealVariants } from '../components/home/home.motion';
import ServicesCarousel from '../components/services/ServicesCarousel';
import useHomeProducts from '../hooks/pages/useHomeProducts';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  const { products, loading } = useHomeProducts({ searchTerm, selectedCategory });

  return (
    <main className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-clip relative">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {!searchTerm && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Hero />
        </Motion.div>
      )}

      {!searchTerm && (
        <Motion.div
          id="services-section"
          className="scroll-mt-32 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={homeSectionRevealVariants}
        >
          <ServicesCarousel />
        </Motion.div>
      )}

      <HomeCatalogPreviewSection
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        products={products}
        loading={loading}
      />
    </main>
  );
}
