import { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest, registerRequest, googleLoginRequest, verifyTokenRequest } from '../api/auth'; 
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

  const refreshUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return null;
    }

    try {
      const res = await verifyTokenRequest(token);
      if (!res.data) {
        setIsAuthenticated(false);
        setUser(null);
        return null;
      }
      setIsAuthenticated(true);
      setUser(res.data);
      return res.data;
    } catch (error) {
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
      setErrors(error.response?.data?.errors || [error.response?.data?.error]);
    }
    throw error;
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      if (error.response?.data?.errors) {
         setErrors(error.response.data.errors);
      } else if (error.response?.data?.error) {
         setErrors([error.response.data.error]);
      } else {
         setErrors(["Error en el servidor"]);
      }
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
      } catch (error) {
          setErrors(["Error al autenticar con Google"]);
      }
  }

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
