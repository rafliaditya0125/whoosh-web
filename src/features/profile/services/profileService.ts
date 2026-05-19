import axiosInstance from '@/shared/lib/axios';
import type { User } from '@/types';

const profileService = {
  get: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>('/users/profile');
    return data;
  },

  update: async (payload: Partial<Pick<User, 'full_name' | 'email' | 'phone'>>): Promise<User> => {
    const { data } = await axiosInstance.put<User>('/users/profile', payload);
    return data;
  },

  changePassword: async (payload: { old_password: string; new_password: string }): Promise<void> => {
    await axiosInstance.put('/users/profile/password', payload);
  },
};

export default profileService;
