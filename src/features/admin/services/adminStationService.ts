import axiosInstance from '@/shared/lib/axios';
import type { Station } from '@/types';

interface StationPayload {
  station_name: string;
  location: string;
}

const adminStationService = {
  getAll: async (): Promise<Station[]> => {
    const { data } = await axiosInstance.get<Station[]>('/stations');
    return data;
  },

  create: async (payload: StationPayload): Promise<Station> => {
    const { data } = await axiosInstance.post<Station>('/stations', payload);
    return data;
  },

  update: async (id: string, payload: Partial<StationPayload>): Promise<Station> => {
    const { data } = await axiosInstance.put<Station>(`/stations/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/stations/${id}`);
  },
};

export default adminStationService;
