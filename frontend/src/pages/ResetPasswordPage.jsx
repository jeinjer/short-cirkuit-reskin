import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, ArrowRight, CheckCircle, AlertCircle, KeyRound, Eye, EyeOff, Check, X, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { resetPasswordRequest } from '../api/auth';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const validations = [
    { label: "Mínimo 6 caracteres", valid: password.length >= 6 },
    { label: "Máximo 16 caracteres", valid: password.length <= 16 && password.length > 0 },
    { label: "Al menos 1 mayúscula", valid: /[A-Z]/.test(password) },
    { label: "Al menos 1 número", valid: /[0-9]/.test(password) },
    { label: "Al menos 1 símbolo", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const lengthValidations = validations.slice(0, 2);
  const typeValidations = validations.slice(2);

  const allRequirementsMet = validations.every(v => v.valid);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid = allRequirementsMet && passwordsMatch;

  useEffect(() => {
    if (!token) setServerError("El enlace no es válido o ha expirado.");
  }, [token]);

  const onSubmit = async (data) => {
    if (!isFormValid) return; 
    setLoading(true);
    setServerError(null);
    try {
      await resetPasswordRequest(token, data.password);
      setSuccess(true);
      toast.success('¡Contraseña actualizada correctamente!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al restablecer la contraseña";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Alineación superior en móvil, centrada en desktop
    <div className="min-h-[calc(100dvh-4rem)] bg-[#050507] flex items-start md:items-center justify-center px-3 pt-8 pb-8 md:p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#13132b] via-[#050507] to-[#050507] z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-2xl p-5 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative z-10 backdrop-blur-md"
      >
        {!success ? (
          <>
            <div className="text-center mb-6">
               <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-900/20 text-cyan-400 mb-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <KeyRound size={20} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Nueva Contraseña</h1>
              <p className="text-gray-500 text-xs mt-1">Crea una clave segura para tu cuenta.</p>
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg mb-4 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {serverError}
              </div>
            )}

            {!token ? (
               <div className="text-center">
                  <p className="text-gray-400 text-sm mb-4">Enlace inválido o expirado.</p>
                  <Link to="/login" className="text-cyan-400 font-bold hover:underline text-xs">Volver al inicio</Link>
               </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                
                <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nueva Contraseña</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input 
                            type={showPassword ? "text" : "password"}
                            {...register("password", { required: true })}
                            disabled={loading}
                            autoComplete="new-password"
                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-2 pl-9 pr-9 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all placeholder:text-gray-700 disabled:opacity-50"
                            placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {password.length > 0 && (
                        <div className="bg-[#0a0a0f]/50 p-2 rounded-lg border border-white/5 grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 mt-1">
                             <div className="space-y-0.5">
                                {typeValidations.map((val, index) => (
                                    <div key={index} className={`flex items-center gap-1.5 text-[9px] ${val.valid ? 'text-cyan-400' : 'text-red-400'}`}>
                                        {val.valid ? <Check size={10} /> : <X size={10} />}
                                        <span className={val.valid ? 'font-bold' : ''}>{val.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-0.5 border-l border-white/5 pl-2 sm:pl-4">
                                {lengthValidations.map((val, index) => (
                                    <div key={index} className={`flex items-center gap-1.5 text-[9px] ${val.valid ? 'text-cyan-400' : 'text-red-400'}`}>
                                        {val.valid ? <Check size={10} /> : <X size={10} />}
                                        <span className={val.valid ? 'font-bold' : ''}>{val.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input 
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", { 
                                required: true, 
                                validate: (val) => val === watch('password') || "Las contraseñas no coinciden"
                            })}
                            disabled={loading}
                            autoComplete="new-password"
                            className={`w-full bg-[#0a0a0f] border rounded-xl py-2 pl-9 pr-9 text-white text-sm focus:outline-none transition-all placeholder:text-gray-700 disabled:opacity-50 
                                ${!passwordsMatch && confirmPassword.length > 0 ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500/50 focus:bg-cyan-900/5'}
                            `}
                            placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer">
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {!passwordsMatch && confirmPassword.length > 0 && (
                        <span className="text-red-500 text-[10px] ml-1 flex items-center gap-1">
                            <X size={10} /> Las contraseñas no coinciden
                        </span>
                    )}
                </div>

                <button 
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group mt-4 cursor-pointer"
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