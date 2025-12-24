import api from './api';

export const getDashboardStats = async () => {
  return await api.get('/dashboard/stats');
};