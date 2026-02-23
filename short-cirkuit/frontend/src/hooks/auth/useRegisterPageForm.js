import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/useAuth';
import usePasswordRules from '../usePasswordRules';

export default function useRegisterPageForm() {
  const form = useForm();
  const { register, handleSubmit, watch } = form;
  const { signup, loginWithGoogle, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const name = watch('name', '');
  const email = watch('email', '');
  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const { allRequirementsMet, passwordsMatch, lengthValidations, typeValidations } =
    usePasswordRules(password, confirmPassword);

  const isFormValid = useMemo(
    () => Boolean(name && email && allRequirementsMet && passwordsMatch),
    [name, email, allRequirementsMet, passwordsMatch]
  );

  useEffect(() => {
    if (isAuthenticated) navigate('/catalogo');
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      await signup(data);
      toast.success('Cuenta creada con exito');
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  });

  return {
    form,
    register,
    authErrors,
    loginWithGoogle,
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
