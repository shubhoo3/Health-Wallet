import api from './api';

export const register = async (name, email, password) => {
  return await api.post('/auth/register', { name, email, password });
};

export const login = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

export const logout = () => {
  localStorage.removeItem('token');
};