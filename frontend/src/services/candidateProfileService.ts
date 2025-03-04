import api from './api';

export const getCurrentProfile = async () => {
  const response = await api.get('/candidate-profiles/me');
  return response.data;
};

interface ProfileData {
  headline?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  jobPreferences?: {
    jobType?: string[];
    expectedSalary?: number;
    location?: string;
    industries?: string[];
  };
}

interface EducationData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

interface ExperienceData {
  company: string;
  position: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

interface SkillData {
  name: string;
  level: string;
}

export const createOrUpdateProfile = async (profileData: ProfileData) => {
  const response = await api.post('/candidate-profiles', profileData);
  return response.data;
};

export const addEducation = async (educationData: EducationData) => {
  const response = await api.put('/candidate-profiles/education', educationData);
  return response.data;
};

export const deleteEducation = async (id: string) => {
  const response = await api.delete(`/candidate-profiles/education/${id}`);
  return response.data;
};

export const addExperience = async (experienceData: ExperienceData) => {
  const response = await api.put('/candidate-profiles/experience', experienceData);
  return response.data;
};

export const deleteExperience = async (id: string) => {
  const response = await api.delete(`/candidate-profiles/experience/${id}`);
  return response.data;
};

export const addSkill = async (skillData: SkillData) => {
  const response = await api.put('/candidate-profiles/skills', skillData);
  return response.data;
};

export const deleteSkill = async (id: string) => {
  const response = await api.delete(`/candidate-profiles/skills/${id}`);
  return response.data;
};

export const uploadResume = async (formData: FormData) => {
  const response = await api.post('/candidate-profiles/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};