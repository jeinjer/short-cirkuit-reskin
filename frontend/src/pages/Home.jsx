import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import { Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { fetchProducts } from '../api/config';
import ProductCard from '../components/ui/ProductCard';
import SkeletonProduct from '../components/ui/SkeletonProduct'; 
import ServicesCarousel from '../components/ui/ServicesCarousel';
import HeroCarousel from '../components/ui/HeroCarousel';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search'); 

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchProducts({ search: searchTerm });
            setProducts(res.data || []);
        } catch (e) {
            console.error("Error cargando productos:", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-[#050507]">
      {!searchTerm && (
        <>
          <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050507] to-[#050507] py-20">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="container mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                <div className="max-w-2xl">
                    <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-6">
                        🚀 DISPONIBLE AHORA
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">
                      NEXT GEN <br/> <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">HARDWARE</span>
                    </h1>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
                        Potencia sin límites para creadores y gamers. Encuentra los componentes más avanzados del mercado en un solo lugar.
                    </p>
                    <Link 
                      to="/catalogo" 
                      className="px-8 py-4 bg-cyan-600 text-white font-bold rounded-lg transition-all hover:bg-cyan-500 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/20 w-fit"
                    >
                      EXPLORAR CATÁLOGO <ChevronRight size={20} />
                    </Link>
                </div>
                <div className="w-full h-full flex items-center justify-center">
                   <HeroCarousel />
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
              {searchTerm ? `RESULTADOS: "${searchTerm.toUpperCase()}"` : 'ÚLTIMOS ARRIBOS'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(8)].map((_, i) => <SkeletonProduct key={i} />)
            ) : (
              products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500 flex flex-col items-center">
                    <p className="text-xl mb-4">No encontramos productos.</p>
                    <button onClick={() => window.location.href='/'} className="text-cyan-400 hover:underline">Volver al inicio</button>
                </div>
              )
            )}
          </div>
        </div>
      </section>
      
      <section className="py-16 border-t border-white/5 bg-[#050507]">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                      { icon: Truck, title: "Envíos Federales", desc: "Logística propia a todo el país" },
                      { icon: ShieldCheck, title: "Garantía Real", desc: "RMA directo con nosotros" },
                      { icon: CreditCard, title: "Pagos Crypto", desc: "Aceptamos USDT y Transferencias" }
                  ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-[#0f0f13] border border-white/5">
                          <div className="p-3 rounded-lg bg-cyan-900/10 text-cyan-400">
                              <item.icon size={24}/>
                          </div>
                          <div>
                              <h4 className="text-gray-200 font-bold mb-0.5">{item.title}</h4>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

    </main>
  );
}