import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const { signin, loginWithGoogle, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/catalogo');
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050507] to-[#050507] opacity-60 z-0"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-xs font-mono mb-4 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <Zap size={12} className="fill-cyan-400" /> 
                <span className="tracking-widest font-bold">ACCESO SEGURO</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
                BIENVENIDO A <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">SC</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        {authErrors.map((error, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-xs flex items-center gap-2"
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        ))}

        <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <input 
                        type="email"
                        {...register("email", { required: true })}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all placeholder:text-gray-700"
                        placeholder="usuario@ejemplo.com"
                    />
                </div>
                {formErrors.email && <span className="text-red-500 text-[10px] ml-1">El email es requerido</span>}
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contraseña</label>
                    <Link to="/forgot-password" className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors">¿Olvidaste tu contraseña?</Link>
                </div>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <input 
                        type="password"
                        {...register("password", { required: true })}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all placeholder:text-gray-700"
                        placeholder="••••••••"
                    />
                </div>
                {formErrors.password && <span className="text-red-500 text-[10px] ml-1">La contraseña es requerida</span>}
            </div>

            <button 
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group"
            >
                INICIAR SESIÓN
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </form>

        <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-600 text-xs font-mono">O CONTINÚA CON</span>
            <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="flex justify-center">
            <div className="overflow-hidden rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                 <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        loginWithGoogle(credentialResponse.credential);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                    theme="filled_black"
                    shape="rectangular"
                    width="300"
                />
            </div>
        </div>

        <p className="mt-8 text-center text-gray-500 text-xs">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                CREAR CUENTA
            </Link>
        </p>

      </motion.div>
    </div>
  );
}