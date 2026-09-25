import API from './api';

export const getGuides = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.location && filters.location !== 'All') params.append('location', filters.location);
  if (filters.language && filters.language !== 'All') params.append('language', filters.language);
  if (filters.specialization && filters.specialization !== 'All') params.append('specialization', filters.specialization);
  if (filters.minRating) params.append('minRating', filters.minRating);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.sort) params.append('sort', filters.sort);

  const response = await API.get(`/guides?${params.toString()}`);
  return response.data;
};

export const getGuideDetails = async (id) => {
  const response = await API.get(`/guides/${id}`);
  return response.data;
};

export const getMyGuideProfile = async () => {
  const response = await API.get('/guides/me/profile');
  return response.data;
};

export const updateGuideProfile = async (profileData) => {
  const response = await API.put('/guides/profile', profileData);
  return response.data;
};
