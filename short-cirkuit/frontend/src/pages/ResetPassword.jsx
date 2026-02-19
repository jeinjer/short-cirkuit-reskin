import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, ArrowRight, CheckCircle, AlertCircle, KeyRound, Eye, EyeOff, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { resetPasswordRequest } from '../api/auth';
import { toast } from 'sonner';
import AuthLayout from '../components/auth/AuthLayout';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, watch } = useForm();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const validations = [
    { label: 'Mínimo 6 caracteres', valid: password.length >= 6 },
    { label: 'Máximo 16 caracteres', valid: password.length <= 16 && password.length > 0 },
    { label: 'Al menos 1 mayúscula', valid: /[A-Z]/.test(password) },
    { label: 'Al menos 1 número', valid: /[0-9]/.test(password) },
    { label: 'Al menos 1 símbolo', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const lengthValidations = validations.slice(0, 2);
  const typeValidations = validations.slice(2);

  const allRequirementsMet = validations.every(v => v.valid);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid = allRequirementsMet && passwordsMatch;

  useEffect(() => {
    if (!token) setServerError('El enlace no es valido o ha expirado.');
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
      const errorMsg = error.response?.data?.error || 'Error al restablecer la contraseña';
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout containerClassName="px-3 md:p-4" initialY={20}>
        {!success ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/10 text-cyan-300 mb-3 border border-cyan-500/35">
                <KeyRound size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-cyber text-white tracking-tight uppercase">Nueva contraseña</h1>
              <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wide">Define una clave segura</p>
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg mb-4 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {serverError}
              </div>
            )}

            {!token ? (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">Enlace inválido o expirado.</p>
                <Link to="/login" className="text-cyan-400 font-bold hover:underline text-xs uppercase tracking-wide">Volver al inicio</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nueva contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: true })}
                      disabled={loading}
                      autoComplete="new-password"
                      className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-9 pr-9 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/10 transition-all placeholder:text-gray-700 disabled:opacity-50"
                      placeholder="********"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="bg-black/30 p-2.5 rounded-lg border border-white/8 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mt-1">
                      <div className="space-y-0.5">
                        {typeValidations.map((val, index) => (
                          <div key={index} className={`flex items-center gap-1.5 text-[10px] ${val.valid ? 'text-cyan-300' : 'text-red-400'}`}>
                            {val.valid ? <Check size={10} /> : <X size={10} />}
                            <span className={val.valid ? 'font-bold' : ''}>{val.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-0.5 border-l border-white/10 pl-3">
                        {lengthValidations.map((val, index) => (
                          <div key={index} className={`flex items-center gap-1.5 text-[10px] ${val.valid ? 'text-cyan-300' : 'text-red-400'}`}>
                            {val.valid ? <Check size={10} /> : <X size={10} />}
                            <span className={val.valid ? 'font-bold' : ''}>{val.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Confirmar contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: true,
                        validate: (val) => val === watch('password') || 'Las contraseñas no coinciden'
                      })}
                      disabled={loading}
                      autoComplete="new-password"
                      className={`w-full h-11 bg-black/35 border rounded-xl pl-9 pr-9 text-white text-sm focus:outline-none transition-all placeholder:text-gray-700 disabled:opacity-50 ${!passwordsMatch && confirmPassword.length > 0 ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500/50 focus:bg-cyan-900/10'}`}
                      placeholder="********"
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
                  className="w-full h-11 bg-cyan-600/95 hover:bg-cyan-500 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black font-cyber tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group mt-4 cursor-pointer uppercase"
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
            <h2 className="text-xl font-bold text-white mb-2">¡Contraseña actualizada!</h2>
            <p className="text-gray-400 text-sm mb-6">Tu cuenta esta segura nuevamente. Redirigiendo al login...</p>
            <div className="animate-pulse h-1 w-24 bg-cyan-500/50 rounded-full mx-auto"></div>
          </motion.div>
        )}
    </AuthLayout>
  );
}


