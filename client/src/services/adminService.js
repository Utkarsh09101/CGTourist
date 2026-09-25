import API from './api';

export const getAdminStats = async () => {
  const response = await API.get('/admin/stats');
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await API.get(`/admin/users?${query}`);
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAdminGuides = async () => {
  const response = await API.get('/admin/guides');
  return response.data;
};

export const toggleGuideVerification = async (id) => {
  const response = await API.put(`/admin/guides/${id}/verify`);
  return response.data;
};

export const getAdminReviews = async () => {
  const response = await API.get('/admin/reviews');
  return response.data;
};

export const deleteAdminReview = async (id) => {
  const response = await API.delete(`/admin/reviews/${id}`);
  return response.data;
};
