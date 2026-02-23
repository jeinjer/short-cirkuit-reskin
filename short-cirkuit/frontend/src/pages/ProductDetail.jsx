import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import FullscreenViewer from '../components/products/details/FullscreenViewer';
import ImageGallery from '../components/products/details/ImageGallery';
import ProductInfo from '../components/products/details/ProductInfo';
import ProductDetailStateView from '../components/products/details/ProductDetailStateView';
import ProductInquirySection from '../components/products/details/ProductInquirySection';
import useProductDetailPageController from '../hooks/pages/useProductDetailPageController';
import { formatArs } from '../utils/formatters';

export default function ProductDetail() {
  const productPage = useProductDetailPageController();

  if (productPage.loading) {
    return <ProductDetailStateView type="loading" />;
  }

  if (productPage.requestError === 'not_found') {
    return (
      <ProductDetailStateView
        type="not_found"
        onPrimaryAction={() => productPage.navigate('/catalogo')}
        onSecondaryAction={() => productPage.navigate('/')}
      />
    );
  }

  if (productPage.requestError === 'generic') {
    return (
      <ProductDetailStateView
        type="generic"
        onPrimaryAction={() => window.location.reload()}
        onSecondaryAction={() => productPage.navigate('/catalogo')}
      />
    );
  }

  if (!productPage.product) return null;

  return (
    <div className="min-h-screen bg-[#050507] font-sans text-white selection:bg-cyan-500/30 pb-16 md:pb-20 overflow-x-clip">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10 pt-24 md:pt-32 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => productPage.navigate(-1)}
            className="group cursor-pointer flex items-center gap-3 px-0 text-gray-400 hover:text-cyan-400 transition-colors w-fit"
          >
            <div className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:border-cyan-500/50 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span className="text-sm font-bold font-mono uppercase tracking-widest">
              Volver al catálogo
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">
          <div className="w-full">
            <ImageGallery images={productPage.images} onImageClick={productPage.setSelectedImage} />
          </div>

          <div className="relative flex flex-col h-full justify-center">
            <ProductInfo
              product={productPage.product}
              formatPrice={formatArs}
              isAdmin={productPage.isAdmin}
              onAskProductInquiry={productPage.openInquiryBox}
              inquirySubmitted={productPage.inquirySubmitted}
            />
          </div>
        </div>

        {productPage.showInquiryBox && (
          <ProductInquirySection
            inquiryRef={productPage.inquiryRef}
            inquirySubmitted={productPage.inquirySubmitted}
            inquiryMessage={productPage.inquiryMessage}
            setInquiryMessage={productPage.setInquiryMessage}
            submitInquiry={productPage.submitInquiry}
            inquirySubmitting={productPage.inquirySubmitting}
            trimmedInquiryMessage={productPage.trimmedInquiryMessage}
            onClose={() => productPage.navigate(-1)}
          />
        )}
      </div>

      <AnimatePresence>
        {productPage.selectedImage && (
          <FullscreenViewer
            image={productPage.selectedImage}
            onClose={() => productPage.setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
