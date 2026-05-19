import axiosInstance from '@/shared/lib/axios';
import type { Train, PaginatedResponse } from '@/types';

interface TrainPayload {
  train_name: string;
  train_code: string;
  total_seats: number;
}

const trainService = {
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Train>> => {
    const { data } = await axiosInstance.get('/trains', { params: { page, limit } });
    return data;
  },

  getById: async (id: string): Promise<Train> => {
    const { data } = await axiosInstance.get<Train>(`/trains/${id}`);
    return data;
  },

  create: async (payload: TrainPayload): Promise<Train> => {
    const { data } = await axiosInstance.post<Train>('/trains', payload);
    return data;
  },

  update: async (id: string, payload: Partial<TrainPayload>): Promise<Train> => {
    const { data } = await axiosInstance.put<Train>(`/trains/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/trains/${id}`);
  },

  getSeats: async (trainId: string, seatClass?: string) => {
    const { data } = await axiosInstance.get(`/trains/${trainId}/seats`, { params: { class: seatClass } });
    return data;
  },

  createSeat: async (trainId: string, payload: { seat_number: string; class: string }) => {
    const { data } = await axiosInstance.post(`/trains/${trainId}/seats`, payload);
    return data;
  },
};

export default trainService;
