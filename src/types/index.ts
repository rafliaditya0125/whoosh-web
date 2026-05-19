/**
 * Type Definitions
 * 
 * Centralized type definitions based on OpenAPI spec
 */

// ============================================
// User & Auth Types
// ============================================

export type UserRole = 'user' | 'manager' | 'admin';

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_active?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

// ============================================
// Station Types
// ============================================

export interface Station {
  station_id: string;
  station_name: string;
  location: string;
}

// ============================================
// Train Types
// ============================================

export interface Train {
  train_id: string;
  train_name: string;
  train_code: string;
  total_seats: number;
}

// ============================================
// Seat Types
// ============================================

export type SeatClass = 'economy' | 'business' | 'vip';
export type SeatStatus = 'available' | 'locked' | 'booked';

export interface Seat {
  seat_id: string;
  train_id: string;
  seat_number: string;
  class: SeatClass;
}

export interface SeatAvailable extends Seat {
  status: SeatStatus;
}

export interface SeatLock {
  lock_id: string;
  locked_seats: string[];
  expires_at: string;
}

// ============================================
// Schedule Types
// ============================================

export type ScheduleStatus = 'active' | 'inactive';

export interface Schedule {
  schedule_id: string;
  train_id: string;
  departure_station: string;
  arrival_station: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  price_business?: number;
  price_vip?: number;
  status?: ScheduleStatus;
}

export interface ScheduleDetail extends Schedule {
  train?: Train;
  departure_station_detail?: Station;
  arrival_station_detail?: Station;
  available_seats?: number;
}

// ============================================
// Booking Types
// ============================================

export type BookingStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export interface PassengerData {
  full_name: string;
  id_number: string;
  seat_id?: string;
}

export interface BookingPassenger extends PassengerData {
  seat?: {
    seat_id: string;
    seat_number: string;
    class: SeatClass;
  };
}

export interface CreateBookingData {
  schedule_id: string;
  lock_id?: string;
  passengers: PassengerData[];
}

export interface BookingDetail {
  booking_id: string;
  booking_code: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
  schedule?: {
    schedule_id: string;
    departure_station: Station;
    arrival_station: Station;
    departure_time: string;
    arrival_time: string;
    train: Train;
    price: number;
  };
  passengers?: BookingPassenger[];
  payment?: PaymentInfo;
  ticket?: TicketInfo;
}

// ============================================
// Payment Types
// ============================================

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired';

export interface Payment {
  payment_id: string;
  booking_id: string;
  status: PaymentStatus;
  amount: number;
  payment_method: string;
  created_at: string;
  updated_at?: string;
}

export interface PaymentInfo {
  payment_id: string;
  status: string;
  method: string;
  paid_at?: string;
}

export interface CreatePaymentData {
  payment_method_id?: string;
  channel_code?: string;
  amount: number;
}

// ============================================
// Ticket Types
// ============================================

export type TicketStatus = 'valid' | 'used' | 'expired' | 'cancelled';

export interface Ticket {
  ticket_id: string;
  booking_code: string;
  qr_code?: string;
  qr_data: string;
  expires_at?: string;
  status: TicketStatus;
}

export interface TicketInfo {
  ticket_id: string;
  qr_code_url?: string;
  qr_data: string;
}

// ============================================
// Refund Types
// ============================================

export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed';

export interface Refund {
  refund_id: string;
  booking_id: string;
  refund_amount: number;
  cancellation_fee: number;
  original_amount: number;
  status: RefundStatus;
  estimated_refund_date?: string;
}

export interface RefundRequest {
  reason: string;
  bank_account: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}

// ============================================
// Saved Passenger Types
// ============================================

export interface SavedPassenger {
  id: string;
  full_name: string;
  id_number: string;
}

// ============================================
// Pagination Types
// ============================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// ============================================
// Error Types
// ============================================

export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'INVALID_EMAIL_FORMAT'
  | 'INVALID_PHONE_FORMAT'
  | 'PASSWORD_TOO_SHORT'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'FORBIDDEN'
  | 'ADMIN_ONLY'
  | 'NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'BOOKING_NOT_FOUND'
  | 'PAYMENT_NOT_FOUND'
  | 'SCHEDULE_NOT_FOUND'
  | 'EMAIL_ALREADY_EXISTS'
  | 'PHONE_ALREADY_EXISTS'
  | 'SEAT_ALREADY_BOOKED'
  | 'SEAT_LOCKED'
  | 'NO_SEATS_AVAILABLE'
  | 'CANNOT_CANCEL_PAID_BOOKING'
  | 'CANNOT_REFUND_UNPAID_BOOKING'
  | 'TICKET_ALREADY_USED'
  | 'TICKET_EXPIRED'
  | 'INVALID_QR_CODE'
  | 'SEAT_LOCK_EXPIRED'
  | 'INVALID_STATE_TRANSITION'
  | 'DATABASE_CONNECTION_ERROR'
  | 'DATABASE_QUERY_ERROR'
  | 'DATABASE_TIMEOUT'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'PAYMENT_GATEWAY_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'INTERNAL_SERVER_ERROR';

export interface ApiError {
  error: string;
  code: ErrorCode;
  statusCode: number;
  details?: {
    fields?: Record<string, string>;
  };
  referenceCode?: number;
}

// ============================================
// Manager Dashboard Types
// ============================================

export interface DashboardSummary {
  revenue: {
    today: number;
    this_week: number;
    this_month: number;
  };
  tickets_sold: {
    today: number;
    this_week: number;
    this_month: number;
  };
  average_occupancy: number;
  top_routes: Array<{
    departure_station: string;
    arrival_station: string;
    tickets_sold: number;
    revenue: number;
  }>;
}

export interface SalesReportItem {
  date: string;
  route: string;
  train_name: string;
  class: SeatClass;
  tickets_sold: number;
  revenue: number;
  occupancy_rate: number;
}

export interface TransactionListItem {
  payment_id: string;
  booking_code: string;
  user_name: string;
  user_email: string;
  amount: number;
  payment_method: string;
  status: PaymentStatus;
  created_at: string;
}

// ============================================
// Filter & Query Types
// ============================================

export interface ScheduleFilters {
  departure?: string;
  arrival?: string;
  date?: string;
}

export interface BookingFilters {
  type?: 'unpaid' | 'paid' | 'history';
  status?: BookingStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface SalesReportFilters {
  date_from: string;
  date_to: string;
  route?: string;
  train_id?: string;
  page?: number;
  limit?: number;
}

export interface TransactionFilters {
  status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}
