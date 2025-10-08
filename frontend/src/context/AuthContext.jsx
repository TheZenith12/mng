import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('mng_user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('mng_token') || null);

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  const login = async ({ email, password }) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { token, user } = res.data;
    setToken(token); setUser(user);
    localStorage.setItem('mng_token', token);
    localStorage.setItem('mng_user', JSON.stringify(user));
    return user;
  };

  const register = async ({ name, email, password }) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    const { token, user } = res.data;
    setToken(token); setUser(user);
    localStorage.setItem('mng_token', token);
    localStorage.setItem('mng_user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('mng_token'); localStorage.removeItem('mng_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
