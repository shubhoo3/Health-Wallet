import api from './api';

export const uploadReport = async (formData) => {
  return await api.post('/reports', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data' 
    }
  });
};

export const getReports = async (params = {}) => {
  return await api.get('/reports', { params });
};

export const getReport = async (id) => {
  return await api.get(`/reports/${id}`);
};

export const updateReport = async (id, data) => {
  return await api.put(`/reports/${id}`, data);
};

export const deleteReport = async (id) => {
  return await api.delete(`/reports/${id}`);
};

export const downloadReport = async (id, fileName) => {
  try {
    const response = await api.get(`/reports/${id}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const searchReports = async (query) => {
  return await api.get('/reports/search', { params: { q: query } });
};