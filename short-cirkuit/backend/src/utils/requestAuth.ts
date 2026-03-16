import { Request } from 'express';
import jwt from 'jsonwebtoken';

export function isAdminRequest(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}
