import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getMe } from '../services/api';

const AuthContext = createContext(null);

const ROLE_LABELS = {
  ADMIN: 'FinOps Administrator',
  FINANCE: 'Finance Analyst',
  DEVOPS: 'DevOps Engineer'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('ccx_user') || sessionStorage.getItem('ccx_user');
      const token = localStorage.getItem('ccx_token') || sessionStorage.getItem('ccx_token');

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        if (import.meta.env.VITE_USE_API === 'true') {
          try {
            const profile = await getMe();
            if (profile) {
              const userData = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: ROLE_LABELS[profile.role] || profile.role,
                rawRole: profile.role
              };
              setUser(userData);
            }
          } catch {
            // Keep cached user on network failure
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe) => {
    const response = await loginUser(email, password);
    const { token, user: apiUser } = response.data;

    const userData = {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.name || email.split('@')[0],
      role: ROLE_LABELS[apiUser.role] || apiUser.role || 'FinOps Operator',
      rawRole: apiUser.role,
      lastLogin: new Date().toISOString()
    };

    setUser(userData);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('ccx_user', JSON.stringify(userData));
    if (token) storage.setItem('ccx_token', token);

    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ccx_user');
    localStorage.removeItem('ccx_token');
    sessionStorage.removeItem('ccx_user');
    sessionStorage.removeItem('ccx_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
