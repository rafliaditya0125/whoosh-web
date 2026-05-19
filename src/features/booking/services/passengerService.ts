import axiosInstance from '@/shared/lib/axios';
import type { SavedPassenger } from '@/types';

const passengerService = {
  getAll: async (): Promise<SavedPassenger[]> => {
    const { data } = await axiosInstance.get<SavedPassenger[]>('/saved-passengers');
    return data;
  },

  save: async (payload: { full_name: string; id_number: string }): Promise<SavedPassenger> => {
    const { data } = await axiosInstance.post<SavedPassenger>('/saved-passengers', payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/saved-passengers/${id}`);
  },
};

export default passengerService;
