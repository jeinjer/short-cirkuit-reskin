import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface UserPayload {
  id: string;
  role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};


export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d'
  });
};