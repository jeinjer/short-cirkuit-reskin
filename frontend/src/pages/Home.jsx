import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; 
import { Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchProducts } from '../api/config';


import HomeProductCard from '../components/products/cards/HomeProductCard'; 
import Hero from '../components/hero/HeroCarousel'; 
import CircuitLoader from '../components/others/CircuitLoader';
import ServicesCarousel from '../components/services/ServicesCarousel';
import CategorySelector from '../components/categories/CategorySelector'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search'); 

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        try {
            const filters = { 
                search: searchTerm,
                ...(selectedCategory && { category: selectedCategory }) 
            };
            const res = await fetchProducts(filters);
            setProducts(res.data || []);
        } catch (e) {
            console.error("Error cargando productos:", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [searchTerm, selectedCategory]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <main className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden relative">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      
      {!searchTerm && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Hero />
        </motion.div>
      )}

      {!searchTerm && (
        <motion.div 
          id="services-section" 
          className="scroll-mt-32 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
           <ServicesCarousel />
        </motion.div>
      )}

      <motion.section 
        id="catalogo-section" 
        className="py-24 relative min-h-screen scroll-mt-32 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        
        <div className="container mx-auto px-4 relative z-10">
          
            <div className="flex flex-col items-center mb-16 text-center">
                <h2 className="text-4xl md:text-6xl font-black font-cyber text-white mb-4 uppercase tracking-tight">
                    {searchTerm ? `Resultados: "${searchTerm}"` : 'Nuestro catálogo'}
                </h2>
                <div className="h-1.5 w-32 bg-linear-to-r from-cyan-600 to-blue-700 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                <p className="mt-4 text-gray-400 text-lg max-w-2xl">
                    {searchTerm 
                        ? 'Buscando productos...' 
                        : 'Selecciona una categoría para filtrar los resultados.'}
                </p>
            </div>

            {!searchTerm && (
                 <CategorySelector 
                    selectedCategory={selectedCategory} 
                    onSelectCategory={setSelectedCategory} 
                 />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                  <div className="col-span-full flex flex-col justify-center items-center h-96 gap-4">
                     <CircuitLoader />
                  </div>
                ) : (
                  <>
                      {products.length > 0 ? (
                        products.slice(0, 8).map((product) => (
                          <HomeProductCard key={product.id || product._id} product={product} />
                        ))
                      ) : (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Search size={64} className="text-gray-700 mb-6" />
                            <p className="text-2xl font-cyber font-bold text-white mb-2">Sin Resultados</p>
                            <p className="text-gray-400 mb-8 font-mono text-lg">No encontramos items en esta categoría.</p>
                            {selectedCategory && (
                                <button 
                                    onClick={() => setSelectedCategory(null)} 
                                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-cyan-900/50"
                                >
                                    Ver Todo el Catálogo
                                </button>
                            )}
                        </div>
                      )}
                  </>
                )}
            </div>

            {!loading && products.length > 0 && (
                 <div className="flex justify-center mt-24">
                    <Link 
                      to={`/catalogo${selectedCategory ? `?category=${selectedCategory}` : ''}`}
                      className="group relative inline-flex items-center justify-center px-12 py-5 bg-[#050505] text-white font-black font-cyber tracking-widest uppercase overflow-hidden transition-all duration-300"
                      style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                      <div className="absolute inset-0 bg-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                      
                      <div className="absolute inset-0 border border-white/20 group-hover:border-cyan-400 z-10 transition-colors duration-300" 
                           style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }} 
                      />

                      <span className="cursor-pointer relative z-20 flex items-center gap-4 group-hover:text-black transition-colors duration-300">
                        {selectedCategory ? `VER ${selectedCategory.toUpperCase().replace('_', ' ')}` : 'VER CATÁLOGO'}
                        <div className="bg-white group-hover:bg-black text-black group-hover:text-cyan-500 p-1 rounded-full transition-colors duration-300">
                            <ChevronRight size={16} strokeWidth={4} />
                        </div>
                      </span>
                    </Link>
                 </div>
            )}
        </div>
      </motion.section>
    </main>
  );
}