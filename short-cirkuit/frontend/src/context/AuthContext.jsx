import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  googleLoginRequest,
  loginRequest,
  registerRequest,
  verifyTokenRequest
} from '../api/auth';
import { getApiErrorList } from '../utils/apiErrors';
import { AuthContext } from './authContext.base';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const refreshUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return null;
    }

    try {
      const res = await verifyTokenRequest();
      if (!res.data) {
        setIsAuthenticated(false);
        setUser(null);
        return null;
      }
      setIsAuthenticated(true);
      setUser(res.data);
      return res.data;
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      return null;
    }
  };

  useEffect(() => {
    async function checkLogin() {
      await refreshUser();
      setLoading(false);
    }
    checkLogin();
  }, []);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      setErrors(getApiErrorList(error));
      throw error;
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      setErrors(getApiErrorList(error));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setErrors([]);
    window.location.href = "/";
  };

  const loginWithGoogle = async (credential) => {
      try {
          const res = await googleLoginRequest(credential);
          setUser(res.data.user);
          setIsAuthenticated(true);
          localStorage.setItem('token', res.data.token);
      } catch {
          setErrors(['Error al autenticar con Google']);
      }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthContext.Provider value={{ 
            signup, signin, loginWithGoogle, logout,
            user, isAuthenticated, errors, loading, refreshUser
        }}>
        {children}
        </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};
