import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as profileService from '../../services/candidateProfileService';

interface EducationItem {
  _id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

interface ExperienceItem {
  _id?: string;
  company: string;
  position: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

interface SkillItem {
  _id?: string;
  name: string;
  level: string;
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
}

interface JobPreferences {
  jobType?: string[];
  expectedSalary?: number;
  location?: string;
  industries?: string[];
}

interface CandidateProfile {
  _id: string;
  user: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  bio?: string;
  headline?: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  resumeUrl?: string;
  socialLinks: SocialLinks;
  jobPreferences: JobPreferences;
  createdAt: string;
  updatedAt: string;
}

interface CandidateProfileState {
  profile: CandidateProfile | null;
  completionPercentage: number;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateProfileState = {
  profile: null,
  completionPercentage: 0,
  loading: false,
  error: null
};

export const getCurrentProfile = createAsyncThunk(
  'candidateProfile/getCurrentProfile',
  async (_, thunkAPI) => {
    try {
      const response = await profileService.getCurrentProfile();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy hồ sơ';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createOrUpdateProfile = createAsyncThunk(
  'candidateProfile/createOrUpdateProfile',
  async (profileData: Partial<CandidateProfile>, thunkAPI) => {
    try {
      const response = await profileService.createOrUpdateProfile(profileData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể cập nhật hồ sơ';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addEducation = createAsyncThunk(
  'candidateProfile/addEducation',
  async (educationData: EducationItem, thunkAPI) => {
    try {
      const response = await profileService.addEducation(educationData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể thêm học vấn';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'candidateProfile/deleteEducation',
  async (id: string, thunkAPI) => {
    try {
      const response = await profileService.deleteEducation(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể xóa học vấn';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addExperience = createAsyncThunk(
  'candidateProfile/addExperience',
  async (experienceData: ExperienceItem, thunkAPI) => {
    try {
      const response = await profileService.addExperience(experienceData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể thêm kinh nghiệm';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'candidateProfile/deleteExperience',
  async (id: string, thunkAPI) => {
    try {
      const response = await profileService.deleteExperience(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể xóa kinh nghiệm';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addSkill = createAsyncThunk(
  'candidateProfile/addSkill',
  async (skillData: SkillItem, thunkAPI) => {
    try {
      const response = await profileService.addSkill(skillData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể thêm kỹ năng';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'candidateProfile/deleteSkill',
  async (id: string, thunkAPI) => {
    try {
      const response = await profileService.deleteSkill(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể xóa kỹ năng';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadResume = createAsyncThunk(
  'candidateProfile/uploadResume',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await profileService.uploadResume(formData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể tải lên CV';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
    
    const candidateProfileSlice = createSlice({
      name: 'candidateProfile',
      initialState,
      reducers: {
        resetProfileError: (state) => {
          state.error = null;
        },
        clearProfile: (state) => {
          state.profile = null;
          state.completionPercentage = 0;
        }
      },
      extraReducers: (builder) => {
        builder
          // Get current profile
          .addCase(getCurrentProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getCurrentProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(getCurrentProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Create or update profile
          .addCase(createOrUpdateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(createOrUpdateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Add education
          .addCase(addEducation.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addEducation.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(addEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Delete education
          .addCase(deleteEducation.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteEducation.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(deleteEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Add experience
          .addCase(addExperience.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addExperience.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(addExperience.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Delete experience
          .addCase(deleteExperience.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteExperience.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(deleteExperience.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Add skill
          .addCase(addSkill.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addSkill.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(addSkill.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Delete skill
          .addCase(deleteSkill.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteSkill.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(deleteSkill.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
          
          // Upload resume
          .addCase(uploadResume.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(uploadResume.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile;
            state.completionPercentage = action.payload.completionPercentage;
          })
          .addCase(uploadResume.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });
      }
    });
    
    export const { resetProfileError, clearProfile } = candidateProfileSlice.actions;
    export default candidateProfileSlice.reducer;