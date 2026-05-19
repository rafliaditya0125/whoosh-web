import { useState } from 'react';
import { Plus, Edit2, Trash2, Train as TrainIcon, Hash, Users, Info } from 'lucide-react';
import { useAdminTrains, useCreateTrain, useUpdateTrain, useDeleteTrain } from '../hooks/useAdmin';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import Table from '@/shared/components/Table';
import Modal from '@/shared/components/Modal';
import Card from '@/shared/components/Card';
import Pagination from '@/shared/components/Pagination';
import type { Train } from '@/types';

interface FormState { train_name: string; train_code: string; total_seats: string }

export default function ManageTrainsPage() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; data?: Train } | null>(null);
  const [form, setForm] = useState<FormState>({ train_name: '', train_code: '', total_seats: '' });

  const { data, isLoading } = useAdminTrains(page);
  const { mutate: create, isPending: creating } = useCreateTrain();
  const { mutate: update, isPending: updating } = useUpdateTrain();
  const { mutate: remove } = useDeleteTrain();

  const trains = data?.items ?? [];
  const pagination = data?.pagination;

  const openCreate = () => { setForm({ train_name: '', train_code: '', total_seats: '' }); setModal({ mode: 'create' }); };
  const openEdit = (t: Train) => {
    setForm({ train_name: t.train_name, train_code: t.train_code, total_seats: String(t.total_seats) });
    setModal({ mode: 'edit', data: t });
  };

  const handleSave = () => {
    const payload = { train_name: form.train_name, train_code: form.train_code, total_seats: Number(form.total_seats) };
    if (modal?.mode === 'create') {
      create(payload, { onSuccess: () => setModal(null) });
    } else if (modal?.data) {
      update({ id: modal.data.train_id, ...payload }, { onSuccess: () => setModal(null) });
    }
  };

  const columns = [
    {
      header: 'Informasi Armada',
      accessor: (t: Train) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#141d23] rounded-xl flex items-center justify-center text-white shadow-lg">
            <TrainIcon size={24} />
          </div>
          <div>
            <p className="font-hanken font-black text-[#141d23] text-lg leading-none mb-1">{t.train_name}</p>
            <div className="flex items-center gap-2">
              <Hash size={12} className="text-[#870012]" />
              <span className="font-mono text-[11px] font-bold text-[#8c9aaf] uppercase tracking-widest">{t.train_code}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Kapasitas Kursi',
      accessor: (t: Train) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#5c6a7e] font-bold">
            <Users size={16} className="text-[#870012]" />
            {t.total_seats} Kursi
          </div>
          <div className="text-[10px] bg-[#f6faff] text-[#141d23] px-2 py-0.5 rounded border border-[#eef2f6] font-black uppercase">Standard Config</div>
        </div>
      ),
    },
    {
      header: 'Aksi',
      accessor: (t: Train) => (
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openEdit(t)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5bdba] text-[#5c6a7e] hover:border-[#870012] hover:text-[#870012] transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => { if(confirm('Hapus data kereta?')) remove(t.train_id); }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 border border-red-100 text-[#ba1a1a] hover:bg-red-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[36px] font-black text-[#141d23] tracking-tight leading-none mb-2">Manajemen Armada</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Kelola rangkaian kereta cepat Whoosh dan kapasitas kursinya.</p>
        </div>
        <Button 
          variant="primary" 
          size="lg" 
          leftIcon={<Plus size={20} />} 
          onClick={openCreate}
          className="shadow-xl"
        >
          TAMBAH KERETA
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <Card noPadding className="p-8 border-none shadow-xl shadow-[#141d23]/5 mb-8">
            <div className="flex items-center gap-4 text-[#141d23]">
              <Info size={20} className="text-[#870012]" />
              <p className="font-inter font-bold text-sm">
                Total {pagination?.total ?? 0} Rangkaian Kereta Terdaftar dalam Sistem.
              </p>
            </div>
          </Card>

          <Table
            columns={columns}
            data={trains}
            isLoading={isLoading}
            emptyMessage="Armada kereta belum terdaftar"
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

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? 'Tambah Armada Baru' : 'Perbarui Data Armada'}
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" fullWidth onClick={() => setModal(null)}>BATAL</Button>
            <Button 
              fullWidth 
              onClick={handleSave} 
              isLoading={creating || updating}
              disabled={!form.train_name || !form.train_code || !form.total_seats}
            >
              SIMPAN ARMADA
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-6 bg-[#141d23] rounded-[2rem] border border-white/5 flex flex-col items-center text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#870012]/10 rounded-full blur-2xl" />
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#870012] mb-4 border border-white/10 relative z-10">
              <TrainIcon size={40} />
            </div>
            <h4 className="font-hanken font-black text-xl mb-1 relative z-10">Konfigurasi Kereta</h4>
            <p className="text-sm font-medium text-[#8c9aaf] relative z-10">Tentukan kode unik dan kapasitas maksimal rangkaian.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Nama Armada"
              placeholder="Contoh: Whoosh G-1"
              fullWidth
              value={form.train_name}
              onChange={(e) => setForm((f) => ({ ...f, train_name: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Kode Kereta"
                placeholder="WHS-01"
                fullWidth
                value={form.train_code}
                onChange={(e) => setForm((f) => ({ ...f, train_code: e.target.value }))}
              />
              <Input
                label="Total Kursi"
                type="number"
                placeholder="601"
                fullWidth
                value={form.total_seats}
                onChange={(e) => setForm((f) => ({ ...f, total_seats: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
