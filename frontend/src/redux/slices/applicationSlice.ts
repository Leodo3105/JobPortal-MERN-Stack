import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as applicationService from '../../services/applicationService';

interface Note {
  text: string;
  createdAt: string;
  createdBy: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
  };
  location: string;
  status: string;
  deadline: string;
  salary?: {
    min?: number;
    max?: number;
    isNegotiable: boolean;
    currency: string;
  };
  jobType: string[];
}

interface Application {
  _id: string;
  job: string | Job;
  candidate: string | User;
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'interview' | 'hired';
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null
};

// Async Thunks
export const applyForJob = createAsyncThunk(
  'applications/apply',
  async ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }, thunkAPI) => {
    try {
      const response = await applicationService.applyForJob(jobId, coverLetter);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể ứng tuyển công việc';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCandidateApplications = createAsyncThunk(
  'applications/candidate',
  async (_, thunkAPI) => {
    try {
      const response = await applicationService.getCandidateApplications();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy danh sách đơn ứng tuyển';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getJobApplications = createAsyncThunk(
  'applications/job',
  async (jobId: string, thunkAPI) => {
    try {
      const response = await applicationService.getJobApplications(jobId);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy danh sách đơn ứng tuyển';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      const response = await applicationService.updateApplicationStatus(id, status);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể cập nhật trạng thái đơn ứng tuyển';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addApplicationNote = createAsyncThunk(
  'applications/addNote',
  async ({ id, text }: { id: string; text: string }, thunkAPI) => {
    try {
      const response = await applicationService.addApplicationNote(id, text);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể thêm ghi chú';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getApplication = createAsyncThunk(
  'applications/getById',
  async (id: string, thunkAPI) => {
    try {
      const response = await applicationService.getApplication(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy thông tin đơn ứng tuyển';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Slice
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    resetApplicationError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply for job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload.application);
        state.currentApplication = action.payload.application;
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get candidate applications
      .addCase(getCandidateApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCandidateApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
      })
      .addCase(getCandidateApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get job applications
      .addCase(getJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
      })
      .addCase(getJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.application;
        
        // Update the application in the list if exists
        const index = state.applications.findIndex(app => app._id === action.payload.application._id);
        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add application note
      .addCase(addApplicationNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApplicationNote.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.application;
        
        // Update the application in the list if exists
        const index = state.applications.findIndex(app => app._id === action.payload.application._id);
        if (index !== -1) {
          state.applications[index] = action.payload.application;
        }
      })
      .addCase(addApplicationNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get application by ID
      .addCase(getApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.application;
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetApplicationError, clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;