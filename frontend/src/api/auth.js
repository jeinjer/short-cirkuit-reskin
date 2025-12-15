import axios from 'axios';

const API_URL_PRD = import.meta.env.VITE_API_URL; 
const API_URL_DEV = 'http://localhost:3000/api'; 

const baseURL = import.meta.env.DEV ? API_URL_DEV : API_URL_PRD;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true 
});

export const registerRequest = (user) => api.post(`/auth/register`, user);
export const loginRequest = (user) => api.post(`/auth/login`, user);
export const googleLoginRequest = (token) => api.post(`/auth/google`, { token });
export const forgotPasswordRequest = (email) => api.post(`/auth/forgot-password`, { email });
export const resetPasswordRequest = (token, newPassword) => api.post(`/auth/reset-password`, { token, newPassword });

export const verifyTokenRequest = async (token) => {
    return await api.post('/auth/verify-token', {}, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    });
};