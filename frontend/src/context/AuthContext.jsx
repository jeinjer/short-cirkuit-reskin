import { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest, registerRequest, googleLoginRequest } from '../api/auth';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

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

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      setErrors(error.response?.data?.errors || [error.response?.data?.error]);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      setErrors(error.response?.data?.errors || [error.response?.data?.error]);
    }
  };

  const loginWithGoogle = async (credential) => {
      try {
          const res = await googleLoginRequest(credential);
          setUser(res.data.user);
          setIsAuthenticated(true);
          localStorage.setItem('token', res.data.token);
      } catch (error) {
          setErrors(["Error al autenticar con Google"]);
      }
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Aquí podrías agregar un useEffect para verificar el token al cargar la app

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthContext.Provider value={{ signup, signin, loginWithGoogle, logout, user, isAuthenticated, errors, loading }}>
        {children}
        </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};