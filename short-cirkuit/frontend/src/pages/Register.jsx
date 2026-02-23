import React from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordRulesChecklist from '../components/auth/PasswordRulesChecklist';
import usePasswordFieldVisibility from '../hooks/auth/usePasswordFieldVisibility';
import useRegisterPageForm from '../hooks/auth/useRegisterPageForm';

export default function RegisterPage() {
  const {
    register,
    authErrors,
    loginWithGoogle,
    loading,
    onSubmit,
    password,
    confirmPassword,
    passwordsMatch,
    lengthValidations,
    typeValidations,
    isFormValid
  } = useRegisterPageForm();

  const {
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility
  } = usePasswordFieldVisibility();

  return (
    <AuthLayout>
      <div className="text-center mb-5">
        <h1 className="text-3xl font-black font-cyber text-white tracking-tight uppercase">Registro</h1>
        <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-wide">Crear cuenta cliente</p>
      </div>

      {authErrors.map((error, i) => (
        <div
          key={i}
          className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg mb-3 text-xs flex items-center justify-center gap-2"
        >
          <AlertCircle size={14} /> {error}
        </div>
      ))}

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nombre</label>
          <div className="relative">
            <input
              type="text"
              {...register('name', { required: true })}
              autoComplete="name"
              className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-9 pr-4 text-white text-sm focus:border-cyan-500/50 focus:bg-cyan-900/10 outline-none peer"
              placeholder="Tu nombre"
            />
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none"
              size={16}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
          <div className="relative">
            <input
              type="email"
              {...register('email', { required: true })}
              autoComplete="email"
              className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-9 pr-4 text-white text-sm focus:border-cyan-500/50 focus:bg-cyan-900/10 outline-none peer"
              placeholder="usuario@ejemplo.com"
            />
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none"
              size={16}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: true })}
              autoComplete="new-password"
              className="w-full h-11 bg-black/35 border border-white/10 rounded-xl pl-9 pr-9 text-white text-sm focus:border-cyan-500/50 focus:bg-cyan-900/10 outline-none peer"
              placeholder="********"
            />
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none"
              size={16}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <PasswordRulesChecklist
            password={password}
            typeValidations={typeValidations}
            lengthValidations={lengthValidations}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: true,
                validate: (val) => val === password || 'Las contraseñas no coinciden'
              })}
              autoComplete="new-password"
              className={`w-full h-11 bg-black/35 border rounded-xl pl-9 pr-9 text-white text-sm focus:outline-none transition-all peer ${
                !passwordsMatch && confirmPassword.length > 0
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-cyan-500/50 focus:bg-cyan-900/10'
              }`}
              placeholder="********"
            />
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none"
              size={16}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {!passwordsMatch && confirmPassword.length > 0 && (
            <span className="text-red-500 text-[10px] sm:text-[11px] ml-1 flex items-center gap-1">
              <X size={10} /> Las contraseñas no coinciden
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full h-11 bg-cyan-600/95 hover:bg-cyan-500 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black font-cyber tracking-wider rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group transition-all mt-4 cursor-pointer uppercase"
        >
          {loading ? 'CONFIRMANDO...' : 'CONFIRMAR'}
          {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="my-4 flex items-center gap-4">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-gray-600 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
          o registrarse con
        </span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      <div className="flex justify-center">
        <div className="rounded-xl p-1 transition-colors cursor-pointer hover:scale-105 transform duration-200">
          <GoogleLogin
            onSuccess={(r) => loginWithGoogle(r.credential)}
            onError={() => console.log('Error')}
            type="icon"
            theme="filled_black"
            shape="circle"
            size="large"
          />
        </div>
      </div>

      <p className="mt-4 text-center text-gray-500 text-xs font-mono">
        Ya tenes cuenta?{' '}
        <Link
          to="/login"
          className="text-cyan-400 font-bold hover:text-cyan-300 underline uppercase tracking-wide"
        >
          INICIAR SESIÓN
        </Link>
      </p>
    </AuthLayout>
  );
}
