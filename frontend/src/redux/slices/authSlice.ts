import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import { AuthState, LoginCredentials, RegisterData } from '../../types/auth.types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Có lỗi xảy ra';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Đăng nhập thất bại';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      const response = await authService.getMe();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không lấy được thông tin người dùng';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Đăng xuất thất bại';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // GetMe cases
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { resetAuthError, clearAuth } = authSlice.actions;
export default authSlice.reducer;