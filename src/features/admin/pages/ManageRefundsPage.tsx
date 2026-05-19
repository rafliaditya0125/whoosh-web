import { useState } from 'react';
import { CheckCircle, XCircle, Undo2, Hash, DollarSign, Filter, Info, MessageSquare } from 'lucide-react';
import { useAdminRefunds, useProcessRefund } from '../hooks/useAdmin';
import Button from '@/shared/components/Button';
import Table from '@/shared/components/Table';
import Badge from '@/shared/components/Badge';
import Modal from '@/shared/components/Modal';
import Card from '@/shared/components/Card';
import Select from '@/shared/components/Select';
import Pagination from '@/shared/components/Pagination';
import type { Refund } from '@/types';

const STATUS_VARIANTS: Record<string, any> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  processed: 'info',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak', processed: 'Diproses',
};

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function ManageRefundsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [notes, setNotes] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ refund: Refund; action: 'approved' | 'rejected' } | null>(null);

  const { data, isLoading } = useAdminRefunds({ status: statusFilter || undefined, page });
  const { mutate: process, isPending: processing } = useProcessRefund();

  const refunds = data?.items ?? [];
  const pagination = data?.pagination;

  const handleProcess = () => {
    if (!confirmModal) return;
    process({ id: confirmModal.refund.refund_id, status: confirmModal.action, notes }, {
      onSuccess: () => { setConfirmModal(null); setNotes(''); },
    });
  };

  const columns = [
    {
      header: 'ID Refund',
      accessor: (r: Refund) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#870012] border border-[#eef2f6]">
            <Hash size={18} />
          </div>
          <span className="font-mono font-black text-[#141d23] text-sm tabular-nums">{r.refund_id.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      header: 'Detail Finansial',
      accessor: (r: Refund) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-black text-[#141d23]">
            <DollarSign size={14} className="text-[#00874e]" />
            {formatPrice(r.refund_amount)}
          </div>
          <p className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-widest leading-none">Fee: {formatPrice(r.cancellation_fee)}</p>
        </div>
      ),
    },
    {
      header: 'Status Pengajuan',
      accessor: (r: Refund) => (
        <Badge variant={STATUS_VARIANTS[r.status]} dot>
          {STATUS_LABEL[r.status]}
        </Badge>
      ),
    },
    {
      header: 'Alasan / Catatan',
      accessor: (r: Refund) => (
        <div className="max-w-xs">
          <p className="text-[13px] text-[#5c6a7e] italic truncate">{r.refund_reason || 'Tidak ada alasan'}</p>
        </div>
      ),
    },
    {
      header: 'Aksi',
      accessor: (r: Refund) => (
        <div className="flex items-center gap-2">
          {r.status === 'pending' ? (
            <>
              <button
                onClick={() => setConfirmModal({ refund: r, action: 'approved' })}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-[#00874e] hover:bg-green-100 transition-all border border-green-100"
                title="Setujui"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => setConfirmModal({ refund: r, action: 'rejected' })}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-[#ba1a1a] hover:bg-red-100 transition-all border border-red-100"
                title="Tolak"
              >
                <XCircle size={18} />
              </button>
            </>
          ) : (
             <Badge variant="neutral">FINALIZED</Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[32px] font-black text-[#141d23] mb-1 tracking-tight leading-none mb-2">Manajemen Refund</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Proses pembatalan tiket dan pengembalian dana penumpang.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#fbeaea] rounded-2xl flex items-center justify-center text-[#870012] shadow-sm">
            <Undo2 size={24} />
          </div>
        </div>
      </div>

      <Card noPadding className="p-8 border-none shadow-xl shadow-[#141d23]/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-grow flex items-center gap-4">
            <div className="p-3 bg-white border border-[#eef2f6] rounded-xl text-[#870012] shadow-sm">
              <Filter size={20} />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                options={[
                  { value: '', label: 'Semua Status' },
                  ...Object.entries(STATUS_LABEL).map(([k, v]) => ({ value: k, label: v }))
                ]}
                fullWidth
                className="!mb-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-[#f6faff] rounded-2xl border border-[#eef2f6] text-[13px] font-bold text-[#141d23]">
            <Info size={16} className="text-[#870012]" />
            {pagination?.total ?? 0} Total Pengajuan Refund
          </div>
        </div>
      </Card>

      <div className="lg:col-span-12">
        <Table
          columns={columns}
          data={refunds}
          isLoading={isLoading}
          emptyMessage="Tidak ada permintaan refund saat ini"
        />
        
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={confirmModal?.action === 'approved' ? 'Setujui Pengembalian Dana' : 'Tolak Pengajuan Refund'}
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" fullWidth onClick={() => setConfirmModal(null)}>BATAL</Button>
            <Button 
              fullWidth 
              variant={confirmModal?.action === 'approved' ? 'primary' : 'danger'}
              onClick={handleProcess} 
              isLoading={processing}
            >
              {confirmModal?.action === 'approved' ? 'SETUJUI REFUND' : 'TOLAK REFUND'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className={`p-8 rounded-[2rem] border min-h-[160px] flex flex-col items-center justify-center text-center ${confirmModal?.action === 'approved' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <h4 className={`font-hanken font-black text-2xl mb-2 ${confirmModal?.action === 'approved' ? 'text-[#00874e]' : 'text-[#ba1a1a]'}`}>
              {confirmModal?.action === 'approved' ? 'Konfirmasi Persetujuan' : 'Konfirmasi Penolakan'}
            </h4>
            <div className="flex flex-col items-center gap-1">
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Total Refund</p>
              <p className="text-3xl font-black text-slate-800">{confirmModal ? formatPrice(confirmModal.refund.refund_amount) : '—'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-black text-[#141d23] px-1">
              <MessageSquare size={16} className="text-[#870012]" /> Berikan Catatan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Berikan alasan atau detail tambahan untuk penumpang..."
              className="w-full bg-[#f6faff] border-2 border-[#eef2f6] rounded-2xl py-4 px-6 outline-none focus:border-[#870012] focus:bg-white transition-all font-inter text-[15px] min-h-[120px]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
