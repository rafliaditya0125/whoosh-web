import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GuestGuard, AdminGuard, ManagerGuard, UserGuard } from '@/features/auth/components/Guards';
import MainLayout from '@/shared/components/Layout/MainLayout.tsx';
import AdminLayout from '@/shared/components/Layout/AdminLayout.tsx';
import ManagerLayout from '@/shared/components/Layout/ManagerLayout.tsx';

// Auth
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));

// User
const HomePage = lazy(() => import('@/features/schedule/pages/HomePage'));
const ScheduleListPage = lazy(() => import('@/features/schedule/pages/ScheduleListPage'));
const PassengerPage = lazy(() => import('@/features/booking/pages/PassengerPage'));
const SeatPage = lazy(() => import('@/features/booking/pages/SeatPage'));
const BookConfirmPage = lazy(() => import('@/features/booking/pages/BookConfirmPage'));
const BookPage = lazy(() => import('@/features/booking/pages/BookPage'));
const PaymentPage = lazy(() => import('@/features/payment/pages/PaymentPage'));
const MyTicketsPage = lazy(() => import('@/features/payment/pages/MyTicketsPage'));
const OrderDetailPage = lazy(() => import('@/features/payment/pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));

// Admin
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const ManageUsersPage = lazy(() => import('@/features/admin/pages/ManageUsersPage'));
const ManageStationsPage = lazy(() => import('@/features/admin/pages/ManageStationsPage'));
const ManageTrainsPage = lazy(() => import('@/features/admin/pages/ManageTrainsPage'));
const ManageSchedulesPage = lazy(() => import('@/features/admin/pages/ManageSchedulesPage'));
const ManageBookingsPage = lazy(() => import('@/features/admin/pages/ManageBookingsPage'));
const ManageRefundsPage = lazy(() => import('@/features/admin/pages/ManageRefundsPage'));

// Manager
const ManagerDashboardPage = lazy(() => import('@/features/manager/pages/ManagerDashboardPage'));
const SalesReportPage = lazy(() => import('@/features/manager/pages/SalesReportPage'));
const TransactionPage = lazy(() => import('@/features/manager/pages/TransactionPage'));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function withMain(Page: React.ComponentType) {
  return <MainLayout><Page /></MainLayout>;
}

function withAdmin(Page: React.ComponentType) {
  return <AdminLayout><Page /></AdminLayout>;
}

function withManager(Page: React.ComponentType) {
  return <ManagerLayout><Page /></ManagerLayout>;
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Guest only */}
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* User routes */}
        <Route element={<UserGuard />}>
          <Route path="/" element={withMain(HomePage)} />
          <Route path="/schedules" element={withMain(ScheduleListPage)} />
          <Route path="/booking/passengers" element={withMain(PassengerPage)} />
          <Route path="/booking/book" element={withMain(BookPage)} />
          <Route path="/booking/seats" element={withMain(SeatPage)} />
          <Route path="/booking/confirm" element={withMain(BookConfirmPage)} />
          <Route path="/payment/:bookingId" element={withMain(PaymentPage)} />
          <Route path="/tickets" element={withMain(MyTicketsPage)} />
          <Route path="/tickets/:bookingId" element={withMain(OrderDetailPage)} />
          <Route path="/profile" element={withMain(ProfilePage)} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={withAdmin(AdminDashboardPage)} />
          <Route path="/admin/users" element={withAdmin(ManageUsersPage)} />
          <Route path="/admin/stations" element={withAdmin(ManageStationsPage)} />
          <Route path="/admin/trains" element={withAdmin(ManageTrainsPage)} />
          <Route path="/admin/schedules" element={withAdmin(ManageSchedulesPage)} />
          <Route path="/admin/bookings" element={withAdmin(ManageBookingsPage)} />
          <Route path="/admin/refunds" element={withAdmin(ManageRefundsPage)} />
        </Route>

        {/* Manager routes */}
        <Route element={<ManagerGuard />}>
          <Route path="/manager" element={withManager(ManagerDashboardPage)} />
          <Route path="/manager/sales" element={withManager(SalesReportPage)} />
          <Route path="/manager/transactions" element={withManager(TransactionPage)} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
