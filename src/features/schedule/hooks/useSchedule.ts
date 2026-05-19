import { useQuery } from '@tanstack/react-query';
import stationService from '../services/stationService';
import scheduleService from '../services/scheduleService';
import type { ScheduleFilters } from '@/types';

export function useStations() {
  return useQuery({
    queryKey: ['stations'],
    queryFn: stationService.getAll,
    staleTime: 10 * 60 * 1000, // 10 menit — data stasiun jarang berubah
  });
}

export function useSchedules(filters: ScheduleFilters, enabled = true) {
  return useQuery({
    queryKey: ['schedules', filters],
    queryFn: () => scheduleService.getAll(filters),
    enabled: enabled && !!filters.departure && !!filters.arrival && !!filters.date,
  });
}

export function useScheduleDetail(id: string) {
  return useQuery({
    queryKey: ['schedule', id],
    queryFn: () => scheduleService.getById(id),
    enabled: !!id,
  });
}
