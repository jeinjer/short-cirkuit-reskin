import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: VITE_API_URL,
});

export const registerRequest = (user) => api.post(`/register`, user);
export const loginRequest = (user) => api.post(`/login`, user);
export const googleLoginRequest = (token) => api.post(`/google`, { token });
export const verifyTokenRequest = () => api.get(`/me`);
export const forgotPasswordRequest = (email) => api.post(`/forgot-password`, { email });
export const resetPasswordRequest = (token, newPassword) => api.post(`/reset-password`, { token, newPassword });