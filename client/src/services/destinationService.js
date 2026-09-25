import API from './api';

export const getDestinations = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.district && filters.district !== 'All') params.append('district', filters.district);

  const response = await API.get(`/destinations?${params.toString()}`);
  return response.data;
};

export const getDestinationDetails = async (slugOrId) => {
  const response = await API.get(`/destinations/${slugOrId}`);
  return response.data;
};

export const createDestination = async (destinationData) => {
  const response = await API.post('/destinations', destinationData);
  return response.data;
};

export const updateDestination = async (id, destinationData) => {
  const response = await API.put(`/destinations/${id}`, destinationData);
  return response.data;
};

export const deleteDestination = async (id) => {
  const response = await API.delete(`/destinations/${id}`);
  return response.data;
};
