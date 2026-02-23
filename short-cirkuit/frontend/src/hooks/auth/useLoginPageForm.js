import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '../../context/useAuth';

export default function useLoginPageForm() {
  const form = useForm();
  const { register, handleSubmit } = form;
  const { signin, loginWithGoogle, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await signin(data);
      toast.success('Bienvenido');
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  });

  useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      loginWithGoogle(tokenResponse.access_token);
    },
    onError: (error) => console.log(error)
  });

  return {
    form,
    register,
    authErrors,
    loading,
    onSubmit,
    loginWithGoogle
  };
}
