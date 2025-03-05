import api from './api';

// Nộp đơn ứng tuyển
export const applyForJob = async (jobId: string, coverLetter?: string) => {
  const response = await api.post('/applications', {
    jobId,
    coverLetter
  });
  return response.data;
};

// Lấy danh sách đơn ứng tuyển của ứng viên
export const getCandidateApplications = async () => {
  const response = await api.get('/applications/candidate');
  return response.data;
};

// Lấy danh sách đơn ứng tuyển cho một công việc (dành cho nhà tuyển dụng)
export const getJobApplications = async (jobId: string) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

// Cập nhật trạng thái đơn ứng tuyển
export const updateApplicationStatus = async (id: string, status: string) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data;
};

// Thêm ghi chú cho đơn ứng tuyển
export const addApplicationNote = async (id: string, text: string) => {
  const response = await api.post(`/applications/${id}/notes`, { text });
  return response.data;
};

// Lấy chi tiết đơn ứng tuyển
export const getApplication = async (id: string) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};