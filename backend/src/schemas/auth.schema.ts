import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});

export const googleLoginSchema = z.object({
  token: z.string().min(1, "El token de Google es requerido")
});

export const forgotPasswordSchema = z.object({
  email: z.email("Email inválido")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requerido"),
  newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});