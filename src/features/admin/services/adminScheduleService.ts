import axiosInstance from '@/shared/lib/axios';
import type { Schedule, ScheduleFilters } from '@/types';

interface SchedulePayload {
  train_id: string;
  departure_station: string;
  arrival_station: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  price_business?: number;
  price_vip?: number;
}

const adminScheduleService = {
  getAll: async (filters?: ScheduleFilters): Promise<Schedule[]> => {
    const { data } = await axiosInstance.get<Schedule[]>('/schedules', { params: filters });
    return data;
  },

  create: async (payload: SchedulePayload): Promise<Schedule> => {
    const { data } = await axiosInstance.post<Schedule>('/schedules', payload);
    return data;
  },

  update: async (id: string, payload: Partial<SchedulePayload>): Promise<Schedule> => {
    const { data } = await axiosInstance.put<Schedule>(`/schedules/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/schedules/${id}`);
  },

  setStatus: async (id: string, status: 'active' | 'inactive'): Promise<void> => {
    await axiosInstance.patch(`/schedules/${id}/status`, { status });
  },
};

export default adminScheduleService;
