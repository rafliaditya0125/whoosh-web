/**
 * React Query Client Configuration
 * 
 * Configured QueryClient with:
 * - Default query options
 * - Cache time settings
 * - Retry logic
 * - Error handling
 */

import { QueryClient } from '@tanstack/react-query';
import type {
  ScheduleFilters,
  BookingFilters,
  UserFilters,
  SalesReportFilters,
  TransactionFilters,
  SeatClass,
} from '@/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests 1 time
      retry: 1,
      
      // Retry delay: exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (disabled by default)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations 0 times (don't retry mutations by default)
      retry: 0,
      
      // Error handling is done in axios interceptor
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

/**
 * Query Keys Factory
 * Centralized query keys for better cache management
 */
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },
  
  // Stations
  stations: {
    all: ['stations'] as const,
    detail: (id: string) => ['stations', id] as const,
  },
  
  // Schedules
  schedules: {
    all: (filters?: ScheduleFilters) => ['schedules', filters] as const,
    detail: (id: string) => ['schedules', id] as const,
  },
  
  // Trains
  trains: {
    all: (pagination?: { page?: number; limit?: number }) => ['trains', pagination] as const,
    detail: (id: string) => ['trains', id] as const,
  },
  
  // Seats
  seats: {
    available: (scheduleId: string, classType?: SeatClass) => 
      ['seats', 'available', scheduleId, classType] as const,
    byTrain: (trainId: string, classType?: SeatClass) => 
      ['seats', 'train', trainId, classType] as const,
  },
  
  // Bookings
  bookings: {
    my: (type?: 'unpaid' | 'paid' | 'history') => ['bookings', 'my', type] as const,
    detail: (id: string) => ['bookings', id] as const,
    all: (filters?: BookingFilters) => ['bookings', 'all', filters] as const,
  },
  
  // Payments
  payments: {
    detail: (id: string) => ['payments', id] as const,
  },
  
  // Tickets
  tickets: {
    qr: (id: string) => ['tickets', 'qr', id] as const,
  },
  
  // Profile
  profile: {
    me: ['profile', 'me'] as const,
  },
  
  // Saved Passengers
  passengers: {
    all: ['passengers', 'saved'] as const,
  },
  
  // Admin - Users
  admin: {
    users: (filters?: UserFilters) => ['admin', 'users', filters] as const,
    userDetail: (id: string) => ['admin', 'users', id] as const,
    bookings: (filters?: BookingFilters) => ['admin', 'bookings', filters] as const,
    refunds: (filters?: { status?: string; page?: number; limit?: number }) => 
      ['admin', 'refunds', filters] as const,
  },
  
  // Manager
  manager: {
    dashboard: ['manager', 'dashboard'] as const,
    salesReport: (filters?: SalesReportFilters) => ['manager', 'sales', filters] as const,
    transactions: (filters?: TransactionFilters) => ['manager', 'transactions', filters] as const,
  },
};

/**
 * Invalidate Queries Helper
 * Helper functions to invalidate related queries
 */
export const invalidateQueries = {
  // Invalidate all schedule-related queries
  schedules: () => {
    queryClient.invalidateQueries({ queryKey: ['schedules'] });
  },
  
  // Invalidate all booking-related queries
  bookings: () => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  },
  
  // Invalidate all seat-related queries
  seats: () => {
    queryClient.invalidateQueries({ queryKey: ['seats'] });
  },
  
  // Invalidate user profile
  profile: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
  
  // Invalidate saved passengers
  passengers: () => {
    queryClient.invalidateQueries({ queryKey: ['passengers'] });
  },
  
  // Invalidate admin queries
  admin: () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
  },
  
  // Invalidate manager queries
  manager: () => {
    queryClient.invalidateQueries({ queryKey: ['manager'] });
  },
};
