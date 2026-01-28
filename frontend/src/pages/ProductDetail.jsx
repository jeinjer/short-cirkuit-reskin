import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CircuitLoader from '../components/others/CircuitLoader';
import ImageGallery from '../components/products/details/ImageGallery';
import ProductInfo from '../components/products/details/ProductInfo';
import FullscreenViewer from '../components/products/details/FullscreenViewer';

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const isAdmin = user?.role === 'ADMIN';
  

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    if (!sku) return;
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${sku}`);
        const prod = res.data;
        setProduct(prod);
        
        let imgs = [];
        if (prod.images && prod.images.length > 0) {
            imgs = prod.images.slice(0, 3);
        } else if (prod.imageUrl) {
            imgs = [prod.imageUrl];
        } else {
            imgs = ["https://via.placeholder.com/800x800?text=NO+IMAGE"]; 
        }
        imgs = [...new Set(imgs)];
        setImages(imgs);

      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [sku]);

  if (loading) return (
    <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center">
      <CircuitLoader size="lg" />
    </div>
  );

  if (!product) return null;
  

  return (
    <div className="min-h-screen bg-[#050507] font-sans text-white selection:bg-cyan-500/30 pb-20">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      
      <div className="relative z-10 pt-32 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="mb-8">
            <button 
                onClick={() => navigate(-1)}
                className="group cursor-pointer flex items-center gap-3 px-0 text-gray-400 hover:text-cyan-400 transition-colors w-fit"
            >
                <div className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:border-cyan-500/50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-bold font-mono uppercase tracking-widest">Volver al catálogo</span>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="w-full">
                <ImageGallery images={images} onImageClick={setSelectedImage} />
            </div>

            <div className="relative flex flex-col h-full justify-center">
                <ProductInfo 
                    product={product} 
                    formatPrice={formatPrice} 
                    isAdmin={isAdmin} 
                />
            </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
            <FullscreenViewer 
                image={selectedImage} 
                onClose={() => setSelectedImage(null)} 
            />
        )}
      </AnimatePresence>

    </div>
  );
}