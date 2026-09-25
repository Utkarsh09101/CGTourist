import API from './api';

export const createReview = async (reviewData) => {
  const response = await API.post('/reviews', reviewData);
  return response.data;
};

export const getGuideReviews = async (guideId) => {
  const response = await API.get(`/reviews/guide/${guideId}`);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await API.delete(`/reviews/${id}`);
  return response.data;
};
