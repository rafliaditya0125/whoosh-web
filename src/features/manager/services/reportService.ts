import axiosInstance from '@/shared/lib/axios';
import type { DashboardSummary, SalesReportItem, TransactionListItem, PaginatedResponse, SalesReportFilters, TransactionFilters } from '@/types';

const reportService = {
  getDashboard: async (): Promise<DashboardSummary> => {
    const { data } = await axiosInstance.get<DashboardSummary>('/manager/dashboard');
    return data;
  },

  getSalesReport: async (filters: SalesReportFilters): Promise<PaginatedResponse<SalesReportItem>> => {
    const { data } = await axiosInstance.get('/manager/reports/sales', { params: filters });
    return data;
  },

  getTransactions: async (filters?: TransactionFilters): Promise<PaginatedResponse<TransactionListItem>> => {
    const { data } = await axiosInstance.get('/manager/transactions', { params: filters });
    return data;
  },

  exportReport: (filters: SalesReportFilters & { format?: 'csv' | 'xlsx' }): string => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return `/api/manager/reports/export?${params.toString()}`;
  },
};

export default reportService;
