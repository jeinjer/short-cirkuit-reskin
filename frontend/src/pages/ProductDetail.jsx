import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import api from '../api/axios';
import CircuitLoader from '../components/others/CircuitLoader';
import ImageGallery from '../components/products/details/ImageGallery';
import ProductInfo from '../components/products/details/ProductInfo';
import FullscreenViewer from '../components/products/details/FullscreenViewer';

const askedProductSkus = new Set();

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showInquiryBox, setShowInquiryBox] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const inquiryRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN';
  const isCliente = user?.role === 'CLIENTE';
  const trimmedInquiryMessage = inquiryMessage.trim();
  

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

  useEffect(() => {
    setShowInquiryBox(false);
    setInquiryMessage('');
    setInquirySubmitting(false);
    setInquirySubmitted(askedProductSkus.has(sku));
  }, [sku]);

  const openInquiryBox = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isCliente) {
      toast.error('Solo clientes pueden enviar consultas');
      return;
    }

    setShowInquiryBox(true);
    setTimeout(() => {
      inquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    if (!product?.id) return;
    if (!trimmedInquiryMessage) {
      toast.error('Debes escribir un mensaje para enviar la consulta');
      return;
    }

    try {
      setInquirySubmitting(true);
      await api.post('/inquiries', {
        productId: product.id,
        message: trimmedInquiryMessage
      });
      setInquiryMessage('');
      askedProductSkus.add(product.sku);
      setInquirySubmitted(true);
      toast.success('Consulta enviada. Te responderemos en tu perfil.');
    } catch (error) {
      toast.error('Error al enviar la consulta');
    } finally {
      setInquirySubmitting(false);
    }
  };

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
                    onAskProductInquiry={openInquiryBox}
                    inquirySubmitted={inquirySubmitted}
                />
            </div>
        </div>

        {showInquiryBox && (
          <section ref={inquiryRef} className="mt-12 max-w-3xl mx-auto rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <h2 className="text-xl font-black font-cyber uppercase tracking-wider text-cyan-200">Consulta por este producto</h2>
            <p className="text-sm text-gray-300 mt-2">
              Tu consulta quedará visible en la sección de "Mis consultas" en "Mi perfil".
            </p>

            {inquirySubmitted ? (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-200 font-semibold">Consulta enviada correctamente.</p>
              </div>
            ) : (
              <form onSubmit={submitInquiry} className="mt-4 space-y-3">
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Escribe tu consulta"
                  required
                  className="w-full h-32 p-3 rounded-lg bg-black/50 border border-white/15 focus:border-cyan-500/40 outline-none"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="h-11 px-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-semibold"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={inquirySubmitting || !trimmedInquiryMessage}
                    className="h-11 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 font-bold"
                  >
                    {inquirySubmitting ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
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


