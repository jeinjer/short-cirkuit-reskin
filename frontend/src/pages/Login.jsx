import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'; 
import { Mail, Lock, Zap, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import AuthLayout from '../components/auth/AuthLayout';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { signin, loginWithGoogle, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await signin(data);
      toast.success('¡Bienvenido!');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  });

  useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      loginWithGoogle(tokenResponse.access_token);
    },
    onError: error => console.log(error)
  });
  
  return (
    <AuthLayout>
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/35 bg-cyan-500/10 text-cyan-300 text-[11px] font-mono mb-3 hover:bg-cyan-500/20 transition-colors uppercase tracking-wider cursor-pointer">
            <Zap size={12} className="fill-cyan-400" /> <span className="tracking-widest font-bold">Short Cirkuit</span>
          </Link>
          <h1 className="text-3xl font-black font-cyber text-white tracking-tight uppercase">Inicio de sesión</h1>
          <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wide">Acceso de usuario</p>
        </div>

        {authErrors.map((error, i) => (
          <div key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg mb-4 text-xs flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        ))}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <input
                type="email"
                {...register('email', { required: true })}
                autoComplete="email"
                className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-9 pr-4 text-white text-sm focus:border-cyan-500/50 focus:bg-cyan-900/10 transition-all outline-none peer"
                placeholder="usuario@ejemplo.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contraseña</label>
              <Link to="/forgot-password" className="text-[11px] uppercase tracking-wide text-cyan-400 hover:text-cyan-300">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: true })}
                autoComplete="current-password"
                className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-9 pr-9 text-white text-sm focus:border-cyan-500/50 focus:bg-cyan-900/10 transition-all outline-none peer"
                placeholder="********"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none" size={16} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full h-11 bg-cyan-600/95 hover:bg-cyan-500 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black font-cyber tracking-wider rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group transition-all uppercase"
          >
            {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="my-5 flex items-center gap-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-gray-600 text-[11px] font-mono uppercase tracking-wider">O CONTINUÁ CON</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="flex justify-center">
          <div className="hover:scale-105 transition-transform">
            <div className="rounded-xl p-1 transition-colors cursor-pointer">
              <GoogleLogin
                onSuccess={(r) => loginWithGoogle(r.credential)}
                onError={() => console.log('Login Failed')}
                type="icon"
                theme="filled_black"
                shape="circle"
                size="large"
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs font-mono">
          No tenés cuenta? <Link to="/registro" className="text-cyan-400 text-[12px] font-bold hover:text-cyan-300 underline uppercase tracking-wide">Crear cuenta</Link>
        </p>
    </AuthLayout>
  );
}


