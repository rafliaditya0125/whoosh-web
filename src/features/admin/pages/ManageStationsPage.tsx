import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Building2, Search, Info } from 'lucide-react';
import { useAdminStations, useCreateStation, useUpdateStation, useDeleteStation } from '../hooks/useAdmin';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import Table from '@/shared/components/Table';
import Modal from '@/shared/components/Modal';
import Card from '@/shared/components/Card';
import type { Station } from '@/types';

interface FormState { station_name: string; location: string }

export default function ManageStationsPage() {
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; data?: Station } | null>(null);
  const [form, setForm] = useState<FormState>({ station_name: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: stations = [], isLoading } = useAdminStations();
  const { mutate: create, isPending: creating } = useCreateStation();
  const { mutate: update, isPending: updating } = useUpdateStation();
  const { mutate: remove } = useDeleteStation();

  const openCreate = () => { setForm({ station_name: '', location: '' }); setModal({ mode: 'create' }); };
  const openEdit = (s: Station) => { setForm({ station_name: s.station_name, location: s.location }); setModal({ mode: 'edit', data: s }); };

  const handleSave = () => {
    if (modal?.mode === 'create') {
      create(form, { onSuccess: () => setModal(null) });
    } else if (modal?.data) {
      update({ id: modal.data.station_id, ...form }, { onSuccess: () => setModal(null) });
    }
  };

  const filteredStations = stations.filter(s => 
    s.station_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Stasiun',
      accessor: (s: Station) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#870012] border border-[#eef2f6]">
            <Building2 size={24} />
          </div>
          <div>
            <p className="font-hanken font-black text-[#141d23] text-lg leading-none mb-1">{s.station_name}</p>
            <p className="font-inter text-[12px] text-[#8c9aaf] font-bold uppercase tracking-widest">{s.station_id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Lokasi & Koordinat',
      accessor: (s: Station) => (
        <div className="flex items-center gap-2 text-[#5c6a7e] font-medium">
          <MapPin size={16} className="text-[#870012]" />
          {s.location}
        </div>
      ),
    },
    {
      header: 'Aksi',
      accessor: (s: Station) => (
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openEdit(s)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5bdba] text-[#5c6a7e] hover:border-[#870012] hover:text-[#870012] transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => { if(confirm('Hapus stasiun?')) remove(s.station_id); }}
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
          <h1 className="font-hanken text-[36px] font-black text-[#141d23] tracking-tight leading-none mb-2">Manajemen Stasiun</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Kelola titik pemberhentian dan lokasi operasional Whoosh.</p>
        </div>
        <Button 
          variant="primary" 
          size="lg" 
          leftIcon={<Plus size={20} />} 
          onClick={openCreate}
          className="shadow-xl"
        >
          TAMBAH STASIUN
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <Card noPadding className="p-8 border-none shadow-xl shadow-[#141d23]/5 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <Input
                  placeholder="Cari nama stasiun atau lokasi..."
                  leftIcon={<Search size={20} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  className="!mb-0"
                />
              </div>
              <div className="flex items-center gap-4 px-6 bg-[#f6faff] rounded-2xl border border-[#eef2f6] text-[13px] font-bold text-[#141d23]">
                <Info size={16} className="text-[#870012]" />
                {stations.length} Total Stasiun Terdaftar
              </div>
            </div>
          </Card>

          <Table
            columns={columns}
            data={filteredStations}
            isLoading={isLoading}
            emptyMessage="Stasiun belum ditambahkan"
          />
        </div>
      </div>

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? 'Tambah Stasiun Baru' : 'Perbarui Data Stasiun'}
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" fullWidth onClick={() => setModal(null)}>BATAL</Button>
            <Button 
              fullWidth 
              onClick={handleSave} 
              isLoading={creating || updating}
              disabled={!form.station_name || !form.location}
            >
              SIMPAN DATA
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-6 bg-[#f6faff] rounded-[2rem] border border-[#eef2f6] flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#870012] shadow-sm mb-4 border border-[#eef2f6]">
              <Building2 size={40} />
            </div>
            <h4 className="font-hanken font-black text-xl text-[#141d23] mb-1">Informasi Lokasi</h4>
            <p className="text-sm font-medium text-[#5c6a7e]">Pastikan nama stasiun sesuai dengan peta operasional.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Nama Stasiun"
              placeholder="Contoh: Halim, Padalarang"
              fullWidth
              value={form.station_name}
              onChange={(e) => setForm((f) => ({ ...f, station_name: e.target.value }))}
            />
            <Input
              label="Lokasi / Alamat"
              placeholder="Contoh: Jakarta Timur, Jawa Barat"
              fullWidth
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
