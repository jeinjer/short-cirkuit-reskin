import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';

const askedProductSkus = new Set();

export default function useProductInquiry({
  sku,
  product,
  isAuthenticated,
  isCliente,
  navigate,
  inquiryRef
}) {
  const [showInquiryBox, setShowInquiryBox] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  useEffect(() => {
    setShowInquiryBox(false);
    setInquiryMessage('');
    setInquirySubmitting(false);
    setInquirySubmitted(askedProductSkus.has(sku));
  }, [sku]);

  const trimmedInquiryMessage = inquiryMessage.trim();

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
      const targetTop = inquiryRef.current?.getBoundingClientRect().top ?? 0;
      const scrollTop = window.scrollY + targetTop - 110;
      window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }, 80);
  };

  const submitInquiry = async (event) => {
    event.preventDefault();
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
    } catch {
      toast.error('Error al enviar la consulta');
    } finally {
      setInquirySubmitting(false);
    }
  };

  return {
    showInquiryBox,
    inquiryMessage,
    setInquiryMessage,
    inquirySubmitting,
    inquirySubmitted,
    trimmedInquiryMessage,
    openInquiryBox,
    submitInquiry
  };
}
