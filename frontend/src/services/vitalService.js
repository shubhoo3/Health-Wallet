import api from './api';

export const addVital = async (data) => {
  return await api.post('/vitals', data);
};

export const getVitals = async (params = {}) => {
  return await api.get('/vitals', { params });
};

export const getVital = async (id) => {
  return await api.get(`/vitals/${id}`);
};

export const updateVital = async (id, data) => {
  return await api.put(`/vitals/${id}`, data);
};

export const deleteVital = async (id) => {
  return await api.delete(`/vitals/${id}`);
};

export const getVitalStats = async () => {
  return await api.get('/vitals/stats');
};

export const getLatestVital = async () => {
  return await api.get('/vitals/latest');
};