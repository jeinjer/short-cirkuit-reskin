import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Zap, AlertCircle, ArrowRight, User, Eye, EyeOff, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import BackToHomeButton from '../components/ui/BackToHomeButton';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors: formErrors } } = useForm();
  const { signup, loginWithGoogle, isAuthenticated, errors: authErrors } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const name = watch('name', '');
  const email = watch('email', '');
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
  const isFormValid = name && email && allRequirementsMet && passwordsMatch;

  useEffect(() => {
    if (isAuthenticated) navigate('/catalogo');
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    if (!isFormValid) return; 
    setLoading(true);
    try {
      await signup(data);
      toast.success('¡Cuenta creada con éxito!');
    } catch (error) {
    } finally {
        setLoading(false);
    }
  });

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#050507] flex items-start md:items-center justify-center px-4 pt-8 pb-8 md:p-4 relative overflow-hidden">
      
      <BackToHomeButton/>

      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050507] to-[#050507] opacity-60 z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-sm"
      >
        
        <div className="text-center mb-4">
            <Link to="/" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-xs font-mono mb-2 hover:bg-cyan-900/20 transition-colors cursor-pointer">
                <Zap size={12} className="fill-cyan-400" /> <span className="tracking-widest font-bold">Short Cirkuit</span>
            </Link>
            <h1 className="text-2xl font-black text-white uppercase">Registro</h1>
        </div>

        {authErrors.map((error, i) => (
          <div key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg mb-3 text-xs flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        ))}

        <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-0.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre</label>
                <div className="relative">
                    <input 
                        type="text" 
                        {...register("name", { required: true })} 
                        autoComplete="name"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:border-cyan-500/50 outline-none peer" 
                        placeholder="Tu nombre" 
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none" size={16} />
                </div>
            </div>

            <div className="space-y-0.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
                <div className="relative">
                    <input 
                        type="email" 
                        {...register("email", { required: true })} 
                        autoComplete="email"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:border-cyan-500/50 outline-none peer" 
                        placeholder="usuario@ejemplo.com" 
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none" size={16} />
                </div>
            </div>

            <div className="space-y-0.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Contraseña</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        {...register("password", { required: true })}
                        autoComplete="new-password"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-2 pl-9 pr-9 text-white text-sm focus:border-cyan-500/50 outline-none peer"
                        placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none" size={16} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                {password.length > 0 && (
                    <div className="bg-[#0a0a0f]/50 p-2 rounded-lg border border-white/5 grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1">
                        <div className="space-y-0.5">
                            {typeValidations.map((val, index) => (
                                <div key={index} className={`flex items-center gap-1.5 text-[11px] ${val.valid ? 'text-cyan-400' : 'text-red-400'}`}>
                                    {val.valid ? <Check size={10} /> : <X size={10} />}
                                    <span className={val.valid ? 'font-bold' : ''}>{val.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-0.5 border-l border-white/5 pl-2 sm:pl-4">
                            {lengthValidations.map((val, index) => (
                                <div key={index} className={`flex items-center gap-1.5 text-[11px] ${val.valid ? 'text-cyan-400' : 'text-red-400'}`}>
                                    {val.valid ? <Check size={10} /> : <X size={10} />}
                                    <span className={val.valid ? 'font-bold' : ''}>{val.label}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>

            <div className="space-y-0.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Confirmar Contraseña</label>
                <div className="relative">
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        {...register("confirmPassword", { 
                            required: true,
                            validate: val => val === password || "Las contraseñas no coinciden"
                        })}
                        autoComplete="new-password"
                        className={`w-full bg-[#0a0a0f] border rounded-xl py-2 pl-9 pr-9 text-white text-sm focus:outline-none transition-all peer
                             ${!passwordsMatch && confirmPassword.length > 0 ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-cyan-500/50'}
                        `}
                        placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-cyan-400 transition-colors pointer-events-none" size={16} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {!passwordsMatch && confirmPassword.length > 0 && (
                    <span className="text-red-500 text-[11px] ml-1 flex items-center gap-1">
                        <X size={10} /> Las contraseñas no coinciden
                    </span>
                )}
            </div>

            <button 
                type="submit" 
                disabled={!isFormValid || loading}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group transition-all mt-4 cursor-pointer"
            >
                {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> }
            </button>
        </form>

        <div className="my-3 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-600 text-[12px] font-mono uppercase">o registrarse con</span>
            <div className="h-px bg-white/10 flex-1"></div>
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

        <p className="mt-3 text-center text-gray-500 text-xs">
            ¿Ya tenés cuenta? <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 underline">Iniciar sesión</Link>
        </p>

      </motion.div>
    </div>
  );
}