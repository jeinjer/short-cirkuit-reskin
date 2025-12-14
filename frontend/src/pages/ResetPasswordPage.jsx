import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, ArrowRight, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { resetPasswordRequest } from '../api/auth';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) setServerError("Token no válido o no encontrado.");
  }, [token]);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      await resetPasswordRequest(token, data.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setServerError(error.response?.data?.error || "El token ha expirado o es inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#13132b] via-[#050507] to-[#050507] z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative z-10 backdrop-blur-md"
      >
        {!success ? (
          <>
            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-900/20 text-cyan-400 mb-4 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <KeyRound size={24} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Nueva Contraseña</h1>
              <p className="text-gray-500 text-xs mt-2">Ingresa tu nueva clave para recuperar el acceso.</p>
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {serverError}
              </div>
            )}

            {!token ? (
               <div className="text-center">
                  <p className="text-gray-400 text-sm mb-4">Enlace inválido.</p>
                  <Link to="/login" className="text-cyan-400 font-bold hover:underline">Volver al inicio</Link>
               </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nueva Contraseña</label>
                    <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <input 
                        type="password"
                        {...register("password", { required: true, minLength: 6 })}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all placeholder:text-gray-700"
                        placeholder="••••••••"
                    />
                    </div>
                    {errors.password && <span className="text-red-500 text-[10px] ml-1">Mínimo 6 caracteres</span>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                    <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <input 
                        type="password"
                        {...register("confirmPassword", { 
                            required: true, 
                            validate: (val) => val === watch('password') || "Las contraseñas no coinciden"
                        })}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all placeholder:text-gray-700"
                        placeholder="••••••••"
                    />
                    </div>
                    {errors.confirmPassword && <span className="text-red-500 text-[10px] ml-1">{errors.confirmPassword.message}</span>}
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group"
                >
                    {loading ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
                    {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                </form>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
               <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">¡Contraseña Actualizada!</h2>
            <p className="text-gray-400 text-sm mb-6">
               Tu cuenta está segura nuevamente. Redirigiendo al login...
            </p>
            <div className="animate-pulse h-1 w-24 bg-cyan-500/50 rounded-full mx-auto"></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}