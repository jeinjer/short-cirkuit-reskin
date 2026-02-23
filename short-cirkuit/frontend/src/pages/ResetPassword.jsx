import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  X
} from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordRulesChecklist from '../components/auth/PasswordRulesChecklist';
import usePasswordFieldVisibility from '../hooks/auth/usePasswordFieldVisibility';
import useResetPasswordPageForm from '../hooks/auth/useResetPasswordPageForm';

export default function ResetPasswordPage() {
  const {
    register,
    token,
    serverError,
    success,
    loading,
    onSubmit,
    password,
    confirmPassword,
    passwordsMatch,
    lengthValidations,
    typeValidations,
    isFormValid
  } = useResetPasswordPageForm();

  const {
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility
  } = usePasswordFieldVisibility();

  return (
    <AuthLayout containerClassName="px-3 md:p-4" initialY={20}>
      {!success ? (
        <>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/10 text-cyan-300 mb-3 border border-cyan-500/35">
              <KeyRound size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-cyber text-white tracking-tight uppercase">
              Nueva contraseña
            </h1>
            <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wide">
              Define una clave segura
            </p>
          </div>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg mb-4 text-xs flex items-center gap-2">
              <AlertCircle size={14} /> {serverError}
            </div>
          )}

          {!token ? (
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">Enlace inválido o expirado.</p>
              <Link
                to="/login"
                className="text-cyan-400 font-bold hover:underline text-xs uppercase tracking-wide"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Nueva contraseña
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                    size={16}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: true })}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-9 pr-9 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/10 transition-all placeholder:text-gray-700 disabled:opacity-50"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <PasswordRulesChecklist
                  password={password}
                  typeValidations={typeValidations}
                  lengthValidations={lengthValidations}
                  compact
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Confirmar contraseña
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors"
                    size={16}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: true,
                      validate: (val) => val === password || 'Las contraseñas no coinciden'
                    })}
                    disabled={loading}
                    autoComplete="new-password"
                    className={`w-full h-11 bg-black/35 border rounded-xl pl-9 pr-9 text-white text-sm focus:outline-none transition-all placeholder:text-gray-700 disabled:opacity-50 ${
                      !passwordsMatch && confirmPassword.length > 0
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-cyan-500/50 focus:bg-cyan-900/10'
                    }`}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
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
                {!loading && (
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>
          )}
        </>
      ) : (
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Contraseña actualizada</h2>
          <p className="text-gray-400 text-sm mb-6">
            Tu cuenta esta segura nuevamente. Redirigiendo al login...
          </p>
          <div className="animate-pulse h-1 w-24 bg-cyan-500/50 rounded-full mx-auto" />
        </Motion.div>
      )}
    </AuthLayout>
  );
}
