import axiosInstance from '@/shared/lib/axios';
import type { Schedule, ScheduleDetail, ScheduleFilters } from '@/types';

const scheduleService = {
  getAll: async (filters?: ScheduleFilters): Promise<Schedule[]> => {
    const { data } = await axiosInstance.get<Schedule[]>('/schedules', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<ScheduleDetail> => {
    const { data } = await axiosInstance.get<ScheduleDetail>(`/schedules/${id}`);
    return data;
  },
};

export default scheduleService;
