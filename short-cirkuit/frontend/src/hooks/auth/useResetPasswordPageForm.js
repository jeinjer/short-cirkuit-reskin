import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { resetPasswordRequest } from '../../api/auth';
import { getApiErrorMessage } from '../../utils/apiErrors';
import usePasswordRules from '../usePasswordRules';

export default function useResetPasswordPageForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const form = useForm();
  const { register, handleSubmit, watch } = form;

  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const redirectTimerRef = useRef(null);

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');
  const { allRequirementsMet, passwordsMatch, lengthValidations, typeValidations } =
    usePasswordRules(password, confirmPassword);
  const isFormValid = allRequirementsMet && passwordsMatch;

  useEffect(() => {
    if (!token) setServerError('El enlace no es válido o ha expirado.');
  }, [token]);

  useEffect(
    () => () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    },
    []
  );

  const onSubmit = handleSubmit(async (data) => {
    if (!isFormValid) return;
    setLoading(true);
    setServerError(null);
    try {
      await resetPasswordRequest(token, data.password);
      setSuccess(true);
      toast.success('Contraseña actualizada correctamente');
      redirectTimerRef.current = setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Error al restablecer la contraseña'));
    } finally {
      setLoading(false);
    }
  });

  return {
    form,
    register,
    watch,
    token,
    serverError,
    success,
    loading,
    onSubmit,
    password,
    confirmPassword,
    passwordsMatch,
    lengthValidations,
    typeValidations,
    isFormValid
  };
}
