import api from './axios';

export const registerRequest = (user) => api.post(`/auth/register`, user);
export const loginRequest = (user) => api.post(`/auth/login`, user);
export const googleLoginRequest = (token) => api.post(`/auth/google`, { token });
export const forgotPasswordRequest = (email) => api.post(`/auth/forgot-password`, { email });
export const resetPasswordRequest = (token, newPassword) => api.post(`/auth/reset-password`, { token, newPassword });

export const verifyTokenRequest = () => api.post('/auth/verify-token');
