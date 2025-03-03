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