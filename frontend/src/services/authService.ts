import api from './api';
import { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const getMe = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>('/auth/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.get('/auth/logout');
};

export const forgotPassword = async (email: string): Promise<{success: boolean, data: string}> => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (resetToken: string, passwords: {password: string, confirmPassword: string}): Promise<AuthResponse> => {
  const response = await api.put(`/auth/reset-password/${resetToken}`, passwords);
  return response.data;
};

export const verifyEmail = async (verificationToken: string): Promise<AuthResponse> => {
  const response = await api.get(`/auth/verify-email/${verificationToken}`);
  return response.data;
};

export const resendVerificationEmail = async (): Promise<{success: boolean, data: string}> => {
  const response = await api.get('/auth/resend-verification-email');
  return response.data;
};