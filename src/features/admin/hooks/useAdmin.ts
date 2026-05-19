import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import adminUserService from '../services/adminUserService';
import trainService from '../services/trainService';
import adminStationService from '../services/adminStationService';
import adminScheduleService from '../services/adminScheduleService';
import adminRefundService, { adminBookingService } from '../services/adminRefundService';
import type { UserFilters, BookingFilters } from '@/types';

// Users
export function useAdminUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminUserService.getAll(filters),
  });
}

export function useSetUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminUserService.setStatus(id, isActive),
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? 'Akun pengguna diaktifkan' : 'Akun pengguna diblokir');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Parameters<typeof adminUserService.update>[1] & { id: string }) =>
      adminUserService.update(id, payload),
    onSuccess: () => {
      toast.success('Data pengguna berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

// Trains
export function useAdminTrains(page = 1) {
  return useQuery({
    queryKey: ['admin-trains', page],
    queryFn: () => trainService.getAll(page),
  });
}

export function useCreateTrain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: trainService.create,
    onSuccess: () => {
      toast.success('Kereta berhasil ditambahkan');
      qc.invalidateQueries({ queryKey: ['admin-trains'] });
    },
  });
}

export function useUpdateTrain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Parameters<typeof trainService.update>[1] & { id: string }) =>
      trainService.update(id, payload),
    onSuccess: () => {
      toast.success('Data kereta berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['admin-trains'] });
    },
  });
}

export function useDeleteTrain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: trainService.delete,
    onSuccess: () => {
      toast.success('Kereta berhasil dihapus');
      qc.invalidateQueries({ queryKey: ['admin-trains'] });
    },
  });
}

// Stations
export function useAdminStations() {
  return useQuery({
    queryKey: ['admin-stations'],
    queryFn: adminStationService.getAll,
  });
}

export function useCreateStation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminStationService.create,
    onSuccess: () => {
      toast.success('Stasiun berhasil ditambahkan');
      qc.invalidateQueries({ queryKey: ['admin-stations', 'stations'] });
    },
  });
}

export function useUpdateStation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Parameters<typeof adminStationService.update>[1] & { id: string }) =>
      adminStationService.update(id, payload),
    onSuccess: () => {
      toast.success('Data stasiun berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['admin-stations', 'stations'] });
    },
  });
}

export function useDeleteStation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminStationService.delete,
    onSuccess: () => {
      toast.success('Stasiun berhasil dihapus');
      qc.invalidateQueries({ queryKey: ['admin-stations', 'stations'] });
    },
  });
}

// Schedules
export function useAdminSchedules() {
  return useQuery({
    queryKey: ['admin-schedules'],
    queryFn: () => adminScheduleService.getAll(),
  });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminScheduleService.create,
    onSuccess: () => {
      toast.success('Jadwal berhasil ditambahkan');
      qc.invalidateQueries({ queryKey: ['admin-schedules'] });
    },
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Parameters<typeof adminScheduleService.update>[1] & { id: string }) =>
      adminScheduleService.update(id, payload),
    onSuccess: () => {
      toast.success('Jadwal berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['admin-schedules'] });
    },
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminScheduleService.delete,
    onSuccess: () => {
      toast.success('Jadwal berhasil dihapus');
      qc.invalidateQueries({ queryKey: ['admin-schedules'] });
    },
  });
}

export function useToggleScheduleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' }) =>
      adminScheduleService.setStatus(id, status),
    onSuccess: () => {
      toast.success('Status jadwal berhasil diperbarui');
      qc.invalidateQueries({ queryKey: ['admin-schedules'] });
    },
  });
}

// Refunds
export function useAdminRefunds(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-refunds', params],
    queryFn: () => adminRefundService.getAll(params),
  });
}

export function useProcessRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'approved' | 'rejected'; notes?: string }) =>
      adminRefundService.process(id, status, notes),
    onSuccess: (_, { status }) => {
      toast.success(status === 'approved' ? 'Refund disetujui' : 'Refund ditolak');
      qc.invalidateQueries({ queryKey: ['admin-refunds'] });
    },
  });
}

// Bookings
export function useAdminBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: () => adminBookingService.getAll(filters),
  });
}
