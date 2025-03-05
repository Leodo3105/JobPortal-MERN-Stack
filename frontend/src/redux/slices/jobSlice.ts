import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as jobService from '../../services/jobService';

// Định nghĩa các interface
interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  jobType: string[];
  location: string;
  salary: {
    min?: number;
    max?: number;
    isNegotiable: boolean;
    currency: string;
  };
  skills?: string[];
  experience?: string;
  education?: string;
  deadline: string;
  status: 'draft' | 'open' | 'closed';
  views: number;
  applications: string[];
  company: {
    name: string;
    logo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface JobFilterOptions {
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

interface JobState {
  jobs: Job[];
  latestJobs: Job[];
  popularJobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  totalJobs: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    jobsPerPage: number;
  };
}

const initialState: JobState = {
  jobs: [],
  latestJobs: [],
  popularJobs: [],
  currentJob: null,
  loading: false,
  error: null,
  totalJobs: 0,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    jobsPerPage: 10
  }
};

// Async Thunks
export const searchJobs = createAsyncThunk(
  'jobs/search',
  async (filters: JobFilterOptions, thunkAPI) => {
    try {
      const response = await jobService.searchJobs(filters);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể tìm kiếm việc làm';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getLatestJobs = createAsyncThunk(
  'jobs/latest',
  async (_, thunkAPI) => {
    try {
      const response = await jobService.getLatestJobs();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy việc làm mới nhất';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPopularJobs = createAsyncThunk(
  'jobs/popular',
  async (_, thunkAPI) => {
    try {
      const response = await jobService.getPopularJobs();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy việc làm phổ biến';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getJobById = createAsyncThunk(
  'jobs/getById',
  async (id: string, thunkAPI) => {
    try {
      const response = await jobService.getJobById(id);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy thông tin việc làm';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getEmployerJobs = createAsyncThunk(
  'jobs/employerJobs',
  async (_, thunkAPI) => {
    try {
      const response = await jobService.getEmployerJobs();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy danh sách việc làm';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData: Partial<Job>, thunkAPI) => {
    try {
      const response = await jobService.createJob(jobData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể tạo tin tuyển dụng';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, jobData }: { id: string; jobData: Partial<Job> }, thunkAPI) => {
    try {
      const response = await jobService.updateJob(id, jobData);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể cập nhật tin tuyển dụng';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateJobStatus = createAsyncThunk(
  'jobs/updateStatus',
  async ({ id, status }: { id: string; status: 'draft' | 'open' | 'closed' }, thunkAPI) => {
    try {
      const response = await jobService.updateJobStatus(id, status);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể cập nhật trạng thái tin tuyển dụng';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id: string, thunkAPI) => {
    try {
      const response = await jobService.deleteJob(id);
      return { id, ...response };
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể xóa tin tuyển dụng';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Slice
const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    resetJobError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search Jobs
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalJobs = action.payload.total;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Latest Jobs
      .addCase(getLatestJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLatestJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.latestJobs = action.payload.jobs;
      })
      .addCase(getLatestJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Popular Jobs
      .addCase(getPopularJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPopularJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.popularJobs = action.payload.jobs;
      })
      .addCase(getPopularJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get Job By ID
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.job;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get Employer Jobs
      .addCase(getEmployerJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalJobs = action.payload.count;
      })
      .addCase(getEmployerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload.job);
        state.currentJob = action.payload.job;
        state.totalJobs += 1;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.job;
        
        // Cập nhật job trong danh sách nếu tồn tại
        const index = state.jobs.findIndex(job => job._id === action.payload.job._id);
        if (index !== -1) {
          state.jobs[index] = action.payload.job;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Job Status
      .addCase(updateJobStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.job;
        
        // Cập nhật job trong danh sách nếu tồn tại
        const index = state.jobs.findIndex(job => job._id === action.payload.job._id);
        if (index !== -1) {
          state.jobs[index] = action.payload.job;
        }
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job._id !== action.payload.id);
        state.totalJobs -= 1;
        if (state.currentJob && state.currentJob._id === action.payload.id) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetJobError, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;