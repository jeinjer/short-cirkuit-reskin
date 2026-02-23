import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

import CategorySelector from '../categories/CategorySelector';
import CircuitLoader from '../others/CircuitLoader';
import HomeProductCard from '../products/cards/HomeProductCard';
import { homeSectionRevealVariants } from './home.motion';

export default function HomeCatalogPreviewSection({
  searchTerm,
  selectedCategory,
  onSelectCategory,
  products,
  loading,
}) {
  return (
    <Motion.section
      id="catalogo-section"
      className="py-16 sm:py-20 md:py-24 relative min-h-screen scroll-mt-24 md:scroll-mt-32 z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={homeSectionRevealVariants}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-10 sm:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-cyber text-white mb-4 uppercase tracking-tight">
            {searchTerm ? `Resultados: "${searchTerm}"` : 'Nuestro catálogo'}
          </h2>
          <div className="h-1.5 w-32 bg-linear-to-r from-cyan-600 to-blue-700 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <p className="mt-4 text-gray-400 text-base md:text-lg max-w-2xl">
            {searchTerm
              ? 'Buscando productos...'
              : 'Selecciona una categoría para filtrar los resultados.'}
          </p>
        </div>

        {!searchTerm && (
          <CategorySelector selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col justify-center items-center h-96 gap-4">
              <CircuitLoader />
            </div>
          ) : products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <HomeProductCard key={product.id || product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Search size={64} className="text-gray-700 mb-6" />
              <p className="text-2xl font-cyber font-bold text-white mb-2">Sin Resultados</p>
              <p className="text-gray-400 mb-8 font-mono text-lg">
                No encontramos ítems en esta categoría.
              </p>
              {selectedCategory && (
                <button
                  onClick={() => onSelectCategory(null)}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-cyan-900/50"
                >
                  Ver Todo el Catálogo
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && products.length > 0 && (
          <div className="flex justify-center mt-14 sm:mt-20 md:mt-24">
            <Link
              to={`/catalogo${selectedCategory ? `?category=${selectedCategory}` : ''}`}
              className="group relative inline-flex items-center justify-center px-7 sm:px-10 md:px-12 py-4 md:py-5 bg-[#050505] text-white font-black font-cyber tracking-widest uppercase overflow-hidden transition-all duration-300"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
            >
              <div className="absolute inset-0 bg-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
              <div
                className="absolute inset-0 border border-white/20 group-hover:border-cyan-400 z-10 transition-colors duration-300"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
              />
              <span className="cursor-pointer relative z-20 flex items-center gap-4 group-hover:text-black transition-colors duration-300">
                {selectedCategory
                  ? `VER ${selectedCategory.toUpperCase().replace('_', ' ')}`
                  : 'VER CATÁLOGO'}
                <div className="bg-white group-hover:bg-black text-black group-hover:text-cyan-500 p-1 rounded-full transition-colors duration-300">
                  <ChevronRight size={16} strokeWidth={4} />
                </div>
              </span>
            </Link>
          </div>
        )}
      </div>
    </Motion.section>
  );
}
