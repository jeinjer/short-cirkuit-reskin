import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { sendResetEmail } from '../utils/mailer';
import { registerSchema, loginSchema, googleLoginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) return res.status(400).json({ error: "El email ya está registrado" });

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'CLIENTE',
        googleId: null,
      },
    });

    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ 
        token, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } 
    });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    if (!user.password) return res.status(400).json({ error: "Usa Iniciar Sesión con Google" });

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = generateToken({ id: user.id, role: user.role });

    res.json({ 
        token, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } 
    });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: "Error en login" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = googleLoginSchema.parse(req.body);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ error: "Token de Google inválido" });

    let user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || "Usuario Google",
          avatar: payload.picture,
          googleId: payload.sub,
          role: 'CLIENTE',
          password: null
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub, avatar: payload.picture || user.avatar }
      });
    }

    const jwtToken = generateToken({ id: user.id, role: user.role });

    res.json({ 
        token: jwtToken, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en autenticación con Google" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 600000); 

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    await sendResetEmail(user.email, resetToken);

    res.json({ message: "Correo de recuperación enviado" });

  } catch (error: any) {
    if (error.errors) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: "Error al procesar solicitud" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ error: "Token inválido o expirado" });

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error: any) {
    if (error.errors) return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: "Error al restablecer contraseña" });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
    });

  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const { name, avatar } = req.body as { name?: string; avatar?: string | null };

    const data: any = {};
    if (name !== undefined) {
      const normalized = String(name).trim();
      if (normalized.length < 2) return res.status(400).json({ error: "Nombre inválido" });
      data.name = normalized;
    }
    if (avatar !== undefined) {
      if (avatar === null || String(avatar).trim() === '') {
        data.avatar = null;
      } else {
        const value = String(avatar).trim();
        if (!/^https?:\/\//i.test(value)) {
          return res.status(400).json({ error: "El avatar debe ser una URL válida" });
        }
        data.avatar = value;
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No hay cambios para actualizar" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data
    });

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

export const changeMyPassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id as string;
    const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Debes ingresar tu contraseña actual" });
      }
      const valid = await comparePassword(currentPassword, user.password);
      if (!valid) return res.status(400).json({ error: "La contraseña actual es incorrecta" });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
};


