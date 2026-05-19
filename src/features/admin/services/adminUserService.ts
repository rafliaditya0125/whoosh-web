import axiosInstance from '@/shared/lib/axios';
import type { User, PaginatedResponse, UserFilters } from '@/types';

const adminUserService = {
  getAll: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const { data } = await axiosInstance.get('/admin/users', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await axiosInstance.get<User>(`/admin/users/${id}`);
    return data;
  },

  update: async (id: string, payload: Partial<Pick<User, 'full_name' | 'email' | 'phone' | 'role'>>): Promise<User> => {
    const { data } = await axiosInstance.put<User>(`/admin/users/${id}`, payload);
    return data;
  },

  setStatus: async (id: string, isActive: boolean): Promise<void> => {
    await axiosInstance.patch(`/admin/users/${id}/status`, { is_active: isActive });
  },
};

export default adminUserService;
