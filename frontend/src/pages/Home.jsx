import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; 
import { ArrowRight, Zap } from 'lucide-react'; 
import { fetchProducts } from '../api/config';
import ProductCard from '../components/ui/ProductCard';
import ServicesCarousel from '../components/ui/ServicesCarousel';
import HeroCarousel from '../components/ui/HeroCarousel';
import CategorySelector from '../components/ui/CategorySelector';
import CircuitLoader from '../components/ui/CircuitLoader';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search'); 
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        setIsExiting(false);

        try {
            const filters = { 
                search: searchTerm,
                ...(selectedCategory && { category: selectedCategory }) 
            };
            
            const res = await fetchProducts(filters);
            setProducts(res.data || []);
            
            setIsExiting(true);
            setTimeout(() => {
                setLoading(false);
                setIsExiting(false);
            }, 500);

        } catch (e) {
            console.error("Error cargando productos:", e);
            setLoading(false);
        }
    };
    loadData();
  }, [searchTerm, selectedCategory, isAuthenticated]);

  return (
    <main className="min-h-screen bg-[#050507]">
      <style>{`
        /* Animación de entrada desde arriba */
        @keyframes slideInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Animación de destello sin movimiento (para el badge interno) */
        @keyframes electric-glitch {
          0% { filter: brightness(1); }
          20% { filter: brightness(1.2) drop-shadow(0 0 5px #22d3ee); }
          40% { filter: brightness(1.2) drop-shadow(0 0 5px #22d3ee); }
          60% { filter: brightness(1); }
          80% { filter: brightness(0.8); }
          100% { filter: brightness(1); }
        }
      `}</style>

      {!searchTerm && (
        <>
          <section className="relative min-h-[70vh] lg:min-h-[80vh] w-full flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050507] to-[#050507] py-10 lg:py-20">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="container mx-auto px-4 relative z-20 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center h-full">
                    <div className="w-full flex flex-col justify-center items-center text-center lg:items-start lg:text-left h-full">
                        <div className="opacity-0 animate-[slideInDown_0.6s_ease-out_forwards]" style={{ animationDelay: '0ms' }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-900/10 text-cyan-400 text-sm font-mono mb-6 shadow-[0_0_10px_rgba(6,182,212,0.2)] animate-[electric-glitch_2.5s_infinite]">
                                <Zap size={16} className="fill-cyan-400 text-cyan-400" /> 
                                <span className="tracking-widest font-bold">VILLA CARLOS PAZ</span>
                            </div>
                        </div>

                        <h1 
                            className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-8 lg:mb-6 leading-none tracking-tight opacity-0 animate-[slideInDown_0.6s_ease-out_forwards]"
                            style={{ animationDelay: '300ms' }}
                        >
                          SHORT <br/> <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">CIRKUIT</span>
                        </h1>
                        <p 
                            className="text-gray-300 text-xl lg:text-2xl mb-0 lg:mb-8 leading-relaxed max-w-lg font-bold uppercase opacity-0 animate-[slideInDown_0.6s_ease-out_forwards]"
                            style={{ animationDelay: '1000ms' }}
                        >
                            Servicio técnico informático
                        </p>

                    </div>
                    <div className="hidden lg:flex w-full h-full items-center justify-center">
                       <HeroCarousel />
                    </div>

                </div>
              </div>
          </section>

          <section className="border-y border-white/5 bg-[#0a0a0f] overflow-hidden">
             <ServicesCarousel />
          </section>
        </>
      )}

      <section className="py-24 bg-[#050507]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-cyan-500 block rounded-full shadow-[0_0_10px_#06b6d4]"></span>
              {searchTerm ? `RESULTADOS: "${searchTerm.toUpperCase()}"` : 'NUESTROS PRODUCTOS'}
            </h2>
          </div>

          {!searchTerm && (
             <CategorySelector 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
             />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[300px] relative">
            {loading ? (
              <div className={`
                  col-span-full flex flex-col justify-center items-center py-12
                  transition-all duration-500 ease-in-out transform
                  ${isExiting ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
              `}>
                 <CircuitLoader />
              </div>
            ) : (
              <>
                  {products.length > 0 ? (
                    products.slice(0, 8).map((product, index) => (
                      <div 
                        key={product.id || product._id}
                        className="opacity-0 animate-[slideInDown_0.6s_ease-out_forwards]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 text-gray-500 flex flex-col items-center">
                        <p className="text-xl mb-4">No encontramos productos en esta selección.</p>
                        {selectedCategory && (
                            <button onClick={() => setSelectedCategory(null)} className="text-cyan-400 hover:underline">
                                Ver todo
                            </button>
                        )}
                    </div>
                  )}
              </>
            )}
          </div>

          {!loading && products.length > 0 && (
             <div className="flex justify-center mt-12 opacity-0 animate-[slideInDown_0.6s_ease-out_forwards]" style={{ animationDelay: '900ms' }}>
                <Link 
                  to={`/catalogo${selectedCategory ? `?category=${selectedCategory.toUpperCase()+'&page=1'}` : ''}`}
                  className="group flex items-center gap-2 px-8 py-3 bg-[#0f0f13] border border-cyan-500/30 text-cyan-400 rounded-full font-semibold hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-300 shadow-lg shadow-cyan-900/10"
                >
                  {selectedCategory 
                    ? `VER MÁS ${selectedCategory.toUpperCase()}` 
                    : 'VER TODO EL CATÁLOGO'}
                  <ArrowRight size={18} />
                </Link>
             </div>
          )}
        </div>
      </section>
    </main>
  );
}