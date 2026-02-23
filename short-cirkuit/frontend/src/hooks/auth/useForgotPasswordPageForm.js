import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { forgotPasswordRequest } from '../../api/auth';
import { getApiErrorMessage } from '../../utils/apiErrors';

export default function useForgotPasswordPageForm() {
  const form = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      await forgotPasswordRequest(data.email);
      setSuccess(true);
      toast.success('Correo de recuperacion enviado');
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Error al enviar el correo'));
    } finally {
      setLoading(false);
    }
  });

  return {
    form,
    register,
    errors,
    serverError,
    success,
    loading,
    onSubmit
  };
}
