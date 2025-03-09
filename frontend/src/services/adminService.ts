import api from './api';

export const getStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getUsers = async (params: { 
  page?: number, 
  limit?: number,
  role?: string,
  search?: string
}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (userId: string, status: 'active' | 'inactive') => {
  const response = await api.patch(`/admin/users/${userId}/status`, { status });
  return response.data;
};

export const getJobs = async (params: {
  page?: number,
  limit?: number,
  status?: string,
  search?: string
}) => {
  const response = await api.get('/admin/jobs', { params });
  return response.data;
};

export const approveJob = async (jobId: string) => {
  const response = await api.patch(`/admin/jobs/${jobId}/approve`);
  return response.data;
};

export const rejectJob = async (jobId: string) => {
  const response = await api.patch(`/admin/jobs/${jobId}/reject`);
  return response.data;
};