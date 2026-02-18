import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { forgotPasswordRequest } from '../api/auth';
import { toast } from 'sonner';
import AuthLayout from '../components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      await forgotPasswordRequest(data.email);
      setSuccess(true);
      toast.success('Correo de recuperación enviado');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al enviar el correo';
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout containerClassName="px-3 pt-24 md:p-4" initialY={24}>
        {!success ? (
          <>
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-300 mb-4 border border-cyan-500/35">
                <Zap size={22} />
              </div>
              <h1 className="text-3xl font-black font-cyber text-white tracking-tight uppercase">Recuperar acceso</h1>
              <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wide">Te enviaremos un enlace por correo</p>
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-5 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email registrado</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    disabled={loading}
                    className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/10 transition-all placeholder:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                {errors.email && <span className="text-red-500 text-[10px] ml-1">El email es requerido</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full h-11 bg-cyan-600/95 hover:bg-cyan-500 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black font-cyber tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group uppercase"
              >
                {loading ? 'ENVIANDO...' : 'RECUPERAR CONTRASEÑA'}
                {!loading && <Send size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Correo enviado</h2>
            <p className="text-gray-400 text-sm mb-4 px-4">Si el correo existe, recibirás las instrucciones.</p>
            <p className="text-gray-500 text-sm mb-4 px-4">Revisa tu bandeja de entrada y spam.</p>
            <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-200 font-mono mb-4">
              El enlace expirará en 10 minutos.
            </div>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wide">
            <ArrowLeft size={14} /> Volver
          </Link>
        </div>
    </AuthLayout>
  );
}


