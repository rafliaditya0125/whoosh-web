import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';
import passengerService from '../services/passengerService';
import seatService from '../services/seatService';
import useBookingStore from '../stores/bookingStore';
import type { SeatClass, BookingFilters } from '@/types';

export function useSavedPassengers() {
  return useQuery({
    queryKey: ['saved-passengers'],
    queryFn: passengerService.getAll,
  });
}

export function useAvailableSeats(scheduleId: string, seatClass?: SeatClass) {
  return useQuery({
    queryKey: ['seats', scheduleId, seatClass],
    queryFn: () => seatService.getAvailable(scheduleId, seatClass),
    enabled: !!scheduleId,
    refetchInterval: 15000, // refresh tiap 15 detik untuk status kursi terkini
  });
}

export function useMyBookings(type?: BookingFilters['type']) {
  return useQuery({
    queryKey: ['bookings', 'my', type],
    queryFn: () => bookingService.getMy({ type }),
  });
}

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const navigate = useNavigate();
  const { reset } = useBookingStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      reset();
      navigate(`/payment/${data.booking_id}`);
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: () => {
      toast.success('Booking berhasil dibatalkan!');
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useRefundBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Parameters<typeof bookingService.refund>[1]) =>
      bookingService.refund(id, payload),
    onSuccess: () => {
      toast.success('Permintaan refund berhasil diajukan!');
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
