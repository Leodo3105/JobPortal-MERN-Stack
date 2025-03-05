import api from './api';

interface JobFilters {
  keyword?: string;
  location?: string;
  jobType?: string[];
  experience?: string;
  education?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

export const searchJobs = async (filters: JobFilters) => {
  // Tạo query string từ filters
  const queryParams = new URLSearchParams();
  
  if (filters.keyword) queryParams.append('keyword', filters.keyword);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.experience) queryParams.append('experience', filters.experience);
  if (filters.education) queryParams.append('education', filters.education);
  if (filters.salaryMin) queryParams.append('salaryMin', filters.salaryMin.toString());
  if (filters.salaryMax) queryParams.append('salaryMax', filters.salaryMax.toString());
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  
  // Xử lý jobType array
  if (filters.jobType && filters.jobType.length > 0) {
    filters.jobType.forEach(type => {
      queryParams.append('jobType', type);
    });
  }
  
  const response = await api.get(`/jobs?${queryParams.toString()}`);
  return response.data;
};

export const getLatestJobs = async () => {
  const response = await api.get('/jobs/latest');
  return response.data;
};

export const getPopularJobs = async () => {
  const response = await api.get('/jobs/popular');
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const getEmployerJobs = async () => {
  const response = await api.get('/jobs/employer/jobs');
  return response.data;
};

export const createJob = async (jobData: any) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id: string, jobData: any) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const updateJobStatus = async (id: string, status: string) => {
  const response = await api.patch(`/jobs/${id}/status`, { status });
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};