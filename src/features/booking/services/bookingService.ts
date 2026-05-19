import axiosInstance from '@/shared/lib/axios';
import type { BookingDetail, CreateBookingData, Refund, RefundRequest, BookingFilters } from '@/types';

const bookingService = {
  create: async (payload: CreateBookingData): Promise<{ booking_id: string; booking_code: string; total_price: number }> => {
    const { data } = await axiosInstance.post('/bookings', payload);
    return data;
  },

  getMy: async (filters?: Pick<BookingFilters, 'type'>): Promise<{ items: BookingDetail[] }> => {
    const { data } = await axiosInstance.get('/bookings/my', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<BookingDetail> => {
    const { data } = await axiosInstance.get<BookingDetail>(`/bookings/${id}`);
    return data;
  },

  cancel: async (id: string): Promise<{ message: string }> => {
    const { data } = await axiosInstance.post(`/bookings/${id}/cancel`);
    return data;
  },

  reschedule: async (id: string, newScheduleId: string, reason?: string) => {
    const { data } = await axiosInstance.post(`/bookings/${id}/reschedule`, { new_schedule_id: newScheduleId, reason });
    return data;
  },

  refund: async (id: string, payload: RefundRequest): Promise<Refund> => {
    const { data } = await axiosInstance.post<Refund>(`/bookings/${id}/refund`, payload);
    return data;
  },

  getRefundStatus: async (refundId: string): Promise<Refund> => {
    const { data } = await axiosInstance.get<Refund>(`/bookings/refunds/${refundId}`);
    return data;
  },
};

export default bookingService;
