import api from './api';

export const getCurrentProfile = async () => {
  const response = await api.get('/employer-profiles/me');
  return response.data;
};

interface EmployerProfileData {
  companyName?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

interface LocationData {
  address: string;
  isHeadquarter?: boolean;
}

export const createOrUpdateProfile = async (profileData: EmployerProfileData) => {
  const response = await api.post('/employer-profiles', profileData);
  return response.data;
};

export const uploadLogo = async (formData: FormData) => {
  const response = await api.post('/employer-profiles/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const uploadCoverImage = async (formData: FormData) => {
  const response = await api.post('/employer-profiles/cover-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const addLocation = async (locationData: LocationData) => {
  const response = await api.put('/employer-profiles/locations', locationData);
  return response.data;
};

export const deleteLocation = async (id: string) => {
  const response = await api.delete(`/employer-profiles/locations/${id}`);
  return response.data;
};