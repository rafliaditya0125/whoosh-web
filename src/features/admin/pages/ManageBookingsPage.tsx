import { useState } from 'react';
import { Search, Hash, MapPin, ArrowRight, Filter, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { useAdminBookings } from '../hooks/useAdmin';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import Table from '@/shared/components/Table';
import Badge from '@/shared/components/Badge';
import Pagination from '@/shared/components/Pagination';
import Select from '@/shared/components/Select';
import Card from '@/shared/components/Card';
import type { BookingDetail, BookingStatus } from '@/types';

const STATUS_VARIANTS: Record<BookingStatus, any> = {
  pending: 'warning',
  paid: 'success',
  completed: 'info',
  cancelled: 'danger',
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Belum Bayar', paid: 'Lunas', completed: 'Selesai', cancelled: 'Dibatalkan',
};

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ManageBookingsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminBookings({
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 20,
  });

  const bookings = data?.items ?? [];
  const pagination = data?.pagination;

  const columns = [
    {
      header: 'Kode Booking',
      accessor: (b: BookingDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#870012] border border-[#eef2f6]">
            <Hash size={18} />
          </div>
          <span className="font-mono font-black text-[#141d23] text-sm">{b.booking_code}</span>
        </div>
      ),
    },
    {
      header: 'Rute Perjalanan',
      accessor: (b: BookingDetail) => (
        <div className="space-y-1">
          {b.schedule ? (
            <div className="flex items-center gap-2 font-inter font-bold text-[#141d23] text-[13px]">
              {b.schedule.departure_station?.station_name || '...'}
              <ArrowRight size={12} className="text-[#8c9aaf]" />
              {b.schedule.arrival_station?.station_name || '...'}
            </div>
          ) : '—'}
          <p className="text-[11px] font-medium text-[#8c9aaf]">{b.user?.full_name || 'Customer'}</p>
        </div>
      ),
    },
    {
      header: 'Total Pembayaran',
      accessor: (b: BookingDetail) => (
        <div className="flex items-center gap-2 font-black text-[#141d23]">
          <DollarSign size={14} className="text-[#00874e]" />
          {formatPrice(b.total_price)}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (b: BookingDetail) => (
        <Badge variant={STATUS_VARIANTS[b.status]} dot>
          {STATUS_LABEL[b.status]}
        </Badge>
      ),
    },
    {
      header: 'Waktu Transaksi',
      accessor: (b: BookingDetail) => (
        <div className="flex items-center gap-2 text-[#5c6a7e] text-[12px] font-medium">
          <Calendar size={14} />
          {formatDate(b.created_at)}
        </div>
      ),
    },
    {
      header: 'Detail',
      accessor: (b: BookingDetail) => (
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f6faff] text-[#5c6a7e] hover:text-[#870012] transition-colors">
          <ExternalLink size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[32px] font-black text-[#141d23] mb-1 tracking-tight">Manajemen Pemesanan</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Monitoring seluruh transaksi dan status tiket penumpang.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="info" className="px-5 py-2.5 font-black uppercase tracking-widest text-[11px] bg-white shadow-sm border-[#eef2f6]">
            {pagination?.total ?? 0} Transaksi Terdeteksi
          </Badge>
        </div>
      </div>

      <Card noPadding className="p-8 border-none shadow-xl shadow-[#141d23]/5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <Input
              placeholder="Cari kode booking atau nama customer..."
              leftIcon={<Search size={20} />}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              fullWidth
              className="!mb-0"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={status}
              onChange={(e) => { setStatus(e.target.value as BookingStatus | ''); setPage(1); }}
              options={[
                { value: '', label: 'Semua Status' },
                ...Object.entries(STATUS_LABEL).map(([k, v]) => ({ value: k, label: v }))
              ]}
              fullWidth
              className="!mb-0"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter size={18} />} className="whitespace-nowrap px-8">
            REKAP
          </Button>
        </div>
      </Card>

      <div className="lg:col-span-12">
        <Table
          columns={columns}
          data={bookings}
          isLoading={isLoading}
          emptyMessage="Belum ada data pemesanan yang masuk"
        />
        
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
