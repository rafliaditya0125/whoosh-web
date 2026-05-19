import axiosInstance from '@/shared/lib/axios';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (payload: RegisterData): Promise<{ message: string; user: User }> => {
    const { data } = await axiosInstance.post<{ message: string; user: User }>('/auth/register', payload);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>('/auth/me');
    return data;
  },
};

export default authService;
