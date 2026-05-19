import { useQuery } from '@tanstack/react-query';
import reportService from '../services/reportService';
import type { SalesReportFilters, TransactionFilters } from '@/types';

export function useDashboard() {
  return useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: reportService.getDashboard,
    refetchInterval: 5 * 60 * 1000, // refresh tiap 5 menit
  });
}

export function useSalesReport(filters: SalesReportFilters, enabled = true) {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => reportService.getSalesReport(filters),
    enabled: enabled && !!filters.date_from && !!filters.date_to,
  });
}

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => reportService.getTransactions(filters),
  });
}
