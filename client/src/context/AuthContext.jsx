import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fgh_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) { localStorage.removeItem('fgh_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    localStorage.setItem('fgh_user', JSON.stringify(data.user));
    localStorage.setItem('fgh_token', data.token);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    localStorage.setItem('fgh_user', JSON.stringify(data.user));
    localStorage.setItem('fgh_token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fgh_user');
    localStorage.removeItem('fgh_token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
