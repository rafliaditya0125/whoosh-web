import axiosInstance from '@/shared/lib/axios';
import type { Ticket } from '@/types';

const ticketService = {
  getQR: async (ticketId: string): Promise<Ticket> => {
    const { data } = await axiosInstance.get<Ticket>(`/tickets/${ticketId}/qr`);
    return data;
  },
};

export default ticketService;
