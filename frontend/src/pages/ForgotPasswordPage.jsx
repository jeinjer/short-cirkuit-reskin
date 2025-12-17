import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { forgotPasswordRequest } from '../api/auth';
import { toast } from 'sonner';

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
      const errorMsg = error.response?.data?.error || "Error al enviar el correo";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#050507] flex items-start md:items-center justify-center px-3 pt-8 pb-8 md:p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#0a0a0f] via-[#050507] to-[#050507] z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-2xl p-5 md:p-8 shadow-2xl relative z-10 backdrop-blur-sm"
      >
        {!success ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-900/20 text-cyan-400 mb-4 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Zap size={24} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Recuperar Acceso</h1>
              <p className="text-gray-500 text-xs mt-2">Te enviaremos un enlace a tu correo para restablecer tu clave.</p>
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Registrado</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type="email"
                    {...register("email", { required: true })}
                    disabled={loading}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all placeholder:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                {errors.email && <span className="text-red-500 text-[10px] ml-1">El email es requerido</span>}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group"
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
            <h2 className="text-xl font-bold text-white mb-2">¡Correo Enviado!</h2>
            <p className="text-gray-400 text-sm mb-4 px-4">
              Si el correo existe, recibirás las instrucciones.
            </p>
            <p className="text-gray-500 text-sm mb-4 px-4">
              Revisa tu bandeja de entrada y la carpeta de spam.
            </p>
            <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-200 font-mono mb-4">
                El enlace expirará en 10 minutos.
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Volver
          </Link>
        </div>
      </motion.div>
    </div>
  );
}