import axiosInstance from '@/shared/lib/axios';
import type { Station } from '@/types';

const stationService = {
  getAll: async (): Promise<Station[]> => {
    const { data } = await axiosInstance.get<Station[]>('/stations');
    return data;
  },
};

export default stationService;
