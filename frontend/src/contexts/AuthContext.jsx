import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setLoading(false);
        const response = await authAPI.getCurrentUser();
        setUser(response.data.data);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userDataParam = urlParams.get('userData');
    if (token && userDataParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam));
        login(token, userData);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch {
        toast.error('Failed to process authentication data');
      }
    }
  }, [navigate]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Error logging out');
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await authAPI.loginWithGoogle();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || 'Google login failed');
    }
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, loginWithGoogle, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider;