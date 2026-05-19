import axiosInstance from '@/shared/lib/axios';
import type { SeatAvailable, SeatLock, SeatClass } from '@/types';

const seatService = {
  getAvailable: async (scheduleId: string, seatClass?: SeatClass): Promise<{ schedule_id: string; available_seats: SeatAvailable[] }> => {
    const { data } = await axiosInstance.get('/seats/available', {
      params: { schedule_id: scheduleId, class: seatClass },
    });
    return data;
  },

  lock: async (scheduleId: string, seatIds: string[]): Promise<SeatLock> => {
    const { data } = await axiosInstance.post<SeatLock>('/seats/lock', {
      schedule_id: scheduleId,
      seat_ids: seatIds,
      lock_duration: 600,
    });
    return data;
  },

  unlock: async (lockId: string): Promise<void> => {
    await axiosInstance.post('/seats/unlock', { lock_id: lockId });
  },
};

export default seatService;
