import api from './api';

export const addToWishlist = async (jobId: string) => {
  const response = await api.post('/wishlist', { jobId });
  return response.data;
};

export const removeFromWishlist = async (jobId: string) => {
  const response = await api.delete(`/wishlist/${jobId}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const checkWishlistItem = async (jobId: string) => {
  const response = await api.get(`/wishlist/check/${jobId}`);
  return response.data;
};