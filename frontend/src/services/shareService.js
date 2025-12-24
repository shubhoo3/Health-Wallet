import api from './api';

export const shareReport = async (reportId, email, accessType = 'read') => {
  return await api.post(`/share/reports/${reportId}`, { 
    email, 
    accessType 
  });
};

export const getReportShares = async (reportId) => {
  return await api.get(`/share/reports/${reportId}`);
};

export const getSharedWithMe = async () => {
  return await api.get('/share/with-me');
};

export const getSharedByMe = async () => {
  return await api.get('/share/by-me');
};

export const revokeShare = async (shareId) => {
  return await api.delete(`/share/${shareId}`);
};