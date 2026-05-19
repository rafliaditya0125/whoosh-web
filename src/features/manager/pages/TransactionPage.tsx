import { useState } from 'react';
import { Search, Hash, User, DollarSign, CreditCard, Filter, Info, ArrowUpRight } from 'lucide-react';
import { useTransactions } from '../hooks/useManager';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import Table from '@/shared/components/Table';
import Badge from '@/shared/components/Badge';
import Card from '@/shared/components/Card';
import Select from '@/shared/components/Select';
import Pagination from '@/shared/components/Pagination';
import type { TransactionListItem, PaymentStatus } from '@/types';

const STATUS_VARIANTS: Record<PaymentStatus, any> = {
  pending: 'warning',
  success: 'success',
  failed: 'danger',
  expired: 'neutral',
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: 'Menunggu', success: 'Berhasil', failed: 'Gagal', expired: 'Kedaluwarsa',
};

const METHOD_LABEL: Record<string, string> = {
  qris: 'QRIS', bank_transfer: 'Transfer Bank', ewallet: 'E-Wallet',
};

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function TransactionPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTransactions({
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 20,
  });

  const transactions = data?.items ?? [];
  const pagination = data?.pagination;

  const columns = [
    {
      header: 'Reference',
      accessor: (t: TransactionListItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#870012] border border-[#eef2f6]">
            <Hash size={18} />
          </div>
          <span className="font-mono font-black text-[#141d23] text-sm tabular-nums uppercase">{t.booking_code}</span>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: (t: TransactionListItem) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-[#5c6a7e]">
            <User size={16} />
          </div>
          <div>
            <p className="font-bold text-[#141d23] text-[13px] leading-tight mb-0.5">{t.user_name}</p>
            <p className="text-[11px] font-medium text-[#8c9aaf]">{t.user_email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Nominal',
      accessor: (t: TransactionListItem) => (
        <div className="flex items-center gap-2 font-black text-[#141d23]">
          <DollarSign size={14} className="text-[#00874e]" />
          {formatPrice(t.amount)}
        </div>
      ),
    },
    {
      header: 'Channel Pembayaran',
      accessor: (t: TransactionListItem) => (
        <div className="flex items-center gap-2 text-[#5c6a7e] font-bold text-[13px]">
          <CreditCard size={14} className="text-[#870012]" />
          {METHOD_LABEL[t.payment_method] ?? t.payment_method}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (t: TransactionListItem) => (
        <Badge variant={STATUS_VARIANTS[t.status]} dot>
          {STATUS_LABEL[t.status]}
        </Badge>
      ),
    },
    {
      header: 'Timestamp',
      accessor: (t: TransactionListItem) => (
        <p className="text-[11px] font-black text-[#8c9aaf] tabular-nums uppercase tracking-tighter">
          {formatDate(t.created_at)}
        </p>
      ),
    },
    {
      header: '',
      accessor: () => (
        <button className="p-2 text-[#8c9aaf] hover:text-[#870012] transition-colors">
          <ArrowUpRight size={20} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[36px] font-black text-[#141d23] tracking-tight leading-none mb-2">Monitoring Transaksi</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Lacak seluruh aliran pembayaran masuk secara real-time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-white border border-[#eef2f6] rounded-xl shadow-sm text-[13px] font-black text-[#141d23] flex items-center gap-3">
             <DollarSign size={18} className="text-[#00874e]" />
             {pagination?.total ?? 0} Transaksi Terproses
          </div>
        </div>
      </div>

      <Card noPadding className="p-8 border-none shadow-xl shadow-[#141d23]/5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <Input
              placeholder="Cari kode booking, nama customer, atau email..."
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
              onChange={(e) => { setStatus(e.target.value as PaymentStatus | ''); setPage(1); }}
              options={[
                { value: '', label: 'Semua Status' },
                ...Object.entries(STATUS_LABEL).map(([k, v]) => ({ value: k, label: v }))
              ]}
              fullWidth
              className="!mb-0"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter size={18} />} className="px-10 border-[#eef2f6] text-[#5c6a7e]">
            FILTER
          </Button>
        </div>
      </Card>

      <div className="lg:col-span-12">
        <Table
          columns={columns}
          data={transactions}
          isLoading={isLoading}
          emptyMessage="Belum ada transaksi yang tercatat hari ini"
        />
        
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <div className="p-10 bg-white rounded-[3rem] border border-[#eef2f6] shadow-xl shadow-[#141d23]/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#870012]" />
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-[#fbeaea] rounded-2xl flex items-center justify-center text-[#870012] flex-shrink-0">
            <Info size={32} />
          </div>
          <div>
            <h4 className="font-hanken text-2xl font-black text-[#141d23] mb-2 tracking-tight">Audit Log Transaksi</h4>
            <p className="font-inter text-[#5c6a7e] text-lg max-w-3xl leading-relaxed">
              Seluruh data transaksi di atas sudah melalui proses sinkronisasi dengan payment gateway. Jika terdapat selisih, mohon lakukan rekonsiliasi manual di menu laporan keuangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
