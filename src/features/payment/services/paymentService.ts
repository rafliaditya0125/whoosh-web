import axiosInstance from '@/shared/lib/axios';
import type { Payment, CreatePaymentData } from '@/types';

const paymentService = {
  create: async (bookingId: string, payload: CreatePaymentData): Promise<Payment> => {
    const { data } = await axiosInstance.post<Payment>(`/payments/booking/${bookingId}`, payload);
    return data;
  },

  getStatus: async (paymentId: string): Promise<Payment> => {
    const { data } = await axiosInstance.get<Payment>(`/payments/${paymentId}`);
    return data;
  },

  updateStatus: async (paymentId: string, status: string): Promise<void> => {
    await axiosInstance.put(`/payments/${paymentId}/status`, { payment_status: status });
  },
};

export default paymentService;
