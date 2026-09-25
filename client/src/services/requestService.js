import API from './api';

export const createGuideRequest = async (requestData) => {
  const response = await API.post('/requests', requestData);
  return response.data;
};

export const getTouristRequests = async () => {
  const response = await API.get('/requests/tourist');
  return response.data;
};

export const getGuideRequests = async () => {
  const response = await API.get('/requests/guide');
  return response.data;
};

export const updateRequestStatus = async (id, status) => {
  const response = await API.put(`/requests/${id}/status`, { status });
  return response.data;
};
