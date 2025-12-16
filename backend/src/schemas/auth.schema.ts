import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,16}$/;
const passwordError = "La contraseña debe tener entre 6 y 16 caracteres, una mayúscula, un número y un símbolo.";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().regex(passwordRegex, passwordError)
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
  newPassword: z.string().regex(passwordRegex, passwordError)
});