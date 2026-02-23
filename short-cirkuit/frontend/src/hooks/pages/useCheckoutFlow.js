import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';
import { getApiErrorMessage } from '../../utils/apiErrors';

export default function useCheckoutFlow({ hasItems, fetchCart }) {
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const trimmedPhone = phone.trim();
  const hasValidOptionalPhone = !trimmedPhone || trimmedPhone.length >= 6;
  const checkoutPhonePayload = trimmedPhone || 'NO_INFORMADO';

  const submitCheckout = async (event) => {
    event.preventDefault();
    if (!hasItems) return;
    if (!hasValidOptionalPhone) {
      toast.error('Si ingresás teléfono, debe tener al menos 6 caracteres');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/checkout', { phone: checkoutPhonePayload });
      setCheckoutResult(res.data);
      await fetchCart();
      toast.success('Pedido generado. Continuá por WhatsApp');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo generar el pedido'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    phone,
    setPhone,
    submitting,
    checkoutResult,
    trimmedPhone,
    hasValidOptionalPhone,
    submitCheckout
  };
}
