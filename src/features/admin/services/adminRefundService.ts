import axiosInstance from '@/shared/lib/axios';
import type { Refund, PaginatedResponse, BookingDetail, BookingFilters } from '@/types';

const adminRefundService = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Refund>> => {
    const { data } = await axiosInstance.get('/admin/refunds', { params });
    return data;
  },

  process: async (id: string, status: 'approved' | 'rejected', notes?: string): Promise<Refund> => {
    const { data } = await axiosInstance.put<Refund>(`/admin/refunds/${id}`, { status, notes });
    return data;
  },
};

export const adminBookingService = {
  getAll: async (filters?: BookingFilters): Promise<PaginatedResponse<BookingDetail>> => {
    const { data } = await axiosInstance.get('/admin/bookings', { params: filters });
    return data;
  },
};

export default adminRefundService;
