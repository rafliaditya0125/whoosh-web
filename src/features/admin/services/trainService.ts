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
    if (Array.isArray(data)) {
      const total = data.length;
      return {
        items: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      };
    }

    if (data && typeof data === 'object') {
      const maybe = data as Partial<PaginatedResponse<Train>> & { items?: unknown };
      if (Array.isArray(maybe.items)) {
        if (maybe.pagination) return data as PaginatedResponse<Train>;

        const total = maybe.items.length;
        return {
          items: maybe.items as Train[],
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
          },
        };
      }
    }

    return {
      items: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 1,
      },
    };
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
