import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'; 
import { Mail, Lock, Zap, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const { signin, loginWithGoogle, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signin(data);
      toast.success('¡Bienvenido!');
    } catch (error) {}
  });

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
        loginWithGoogle(tokenResponse.access_token);
    },
    onError: error => console.log(error)
  });
  
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#050507] flex items-start md:items-center justify-center px-3 pt-8 pb-8 md:p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050507] to-[#050507] opacity-60 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-2xl p-5 md:p-8 shadow-2xl relative z-10 backdrop-blur-sm"
      >
        
        <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-xs font-mono mb-3">
                <Zap size={12} className="fill-cyan-400" /> <span className="tracking-widest font-bold">Short Cirkuit</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Inicio de sesión</h1>
        </div>

        {authErrors.map((error, i) => (
          <div key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg mb-4 text-xs flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        ))}

        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input 
                        type="email" 
                        {...register("email", { required: true })}
                        autoComplete="email"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white text-sm focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all outline-none"
                        placeholder="usuario@ejemplo.com" 
                    />
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Contraseña</label>
                    <Link to="/forgot-password" className="text-[10px] text-cyan-400 hover:text-cyan-300">¿Olvidaste tu contraseña?</Link>
                </div>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        {...register("password", { required: true })}
                        autoComplete="current-password"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-2.5 pl-9 pr-9 text-white text-sm focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all outline-none"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <button type="submit" className="cursor-pointer w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group transition-all">
                INICIAR SESIÓN <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </form>

        <div className="my-4 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-600 text-[12px] font-mono">O CONTINUÁ CON</span>
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

        <p className="mt-6 text-center text-gray-500 text-xs">
            ¿No tenés cuenta? <Link to="/registro" className="text-cyan-400 font-bold hover:text-cyan-300 underline">Crear cuenta</Link>
        </p>

      </motion.div>
    </div>
  );
}