import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as profileService from '../../services/employerProfileService';

interface Location {
  _id?: string;
  address: string;
  isHeadquarter?: boolean;
}

interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
}

interface EmployerProfile {
  _id: string;
  user: string;
  companyName: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  description?: string;
  locations: Location[];
  socialLinks: SocialLinks;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployerProfileState {
  profile: EmployerProfile | null;
  completionPercentage: number;
  loading: boolean;
  error: string | null;
}

const initialState: EmployerProfileState = {
  profile: null,
  completionPercentage: 0,
  loading: false,
  error: null
};

export const getCurrentProfile = createAsyncThunk(
  'employerProfile/getCurrentProfile',
  async (_, thunkAPI) => {
    try {
      const response = await profileService.getCurrentProfile();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy thông tin công ty';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createOrUpdateProfile = createAsyncThunk(
  'employerProfile/createOrUpdateProfile',
  async (profileData: Partial<EmployerProfile>, thunkAPI) => {
    try {
      const response = await profileService.createOrUpdateProfile(profileData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể cập nhật thông tin công ty';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadLogo = createAsyncThunk(
  'employerProfile/uploadLogo',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await profileService.uploadLogo(formData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể tải lên logo';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadCoverImage = createAsyncThunk(
  'employerProfile/uploadCoverImage',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await profileService.uploadCoverImage(formData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể tải lên ảnh bìa';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addLocation = createAsyncThunk(
  'employerProfile/addLocation',
  async (locationData: Location, thunkAPI) => {
    try {
      const response = await profileService.addLocation(locationData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể thêm địa điểm';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteLocation = createAsyncThunk(
  'employerProfile/deleteLocation',
  async (id: string, thunkAPI) => {
    try {
      const response = await profileService.deleteLocation(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể xóa địa điểm';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const employerProfileSlice = createSlice({
  name: 'employerProfile',
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
      
      // Upload logo
      .addCase(uploadLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.completionPercentage = action.payload.completionPercentage;
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload cover image
      .addCase(uploadCoverImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadCoverImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.completionPercentage = action.payload.completionPercentage;
      })
      .addCase(uploadCoverImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add location
      .addCase(addLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.completionPercentage = action.payload.completionPercentage;
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete location
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.completionPercentage = action.payload.completionPercentage;
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetProfileError, clearProfile } = employerProfileSlice.actions;
export default employerProfileSlice.reducer;