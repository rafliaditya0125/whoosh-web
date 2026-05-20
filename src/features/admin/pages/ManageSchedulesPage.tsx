import { useState } from 'react';
import { 
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, 
  Calendar, MapPin, Train, ArrowRight, Clock,
  DollarSign, Info
} from 'lucide-react';
import {
  useAdminSchedules, useCreateSchedule, useUpdateSchedule,
  useDeleteSchedule, useToggleScheduleStatus, useAdminStations, useAdminTrains,
} from '../hooks/useAdmin';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import Table from '@/shared/components/Table';
import Modal from '@/shared/components/Modal';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Select from '@/shared/components/Select';
import type { Schedule, Station, Train as TrainType } from '@/types';

interface FormState {
  train_id: string; departure_station: string; arrival_station: string;
  departure_time: string; arrival_time: string;
  price: string; price_business: string; price_vip: string;
}

const EMPTY_FORM: FormState = {
  train_id: '', departure_station: '', arrival_station: '',
  departure_time: '', arrival_time: '', price: '', price_business: '', price_vip: '',
};

function formatDT(dt: string) {
  return new Date(dt).toLocaleString('id-ID', { 
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
  });
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function ManageSchedulesPage() {
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; data?: Schedule } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const { data: schedules = [], isLoading } = useAdminSchedules();
  const { data: stations = [] } = useAdminStations();
  const { data: trainsData } = useAdminTrains();
  const trains = trainsData?.items ?? [];

  const { mutate: create, isPending: creating } = useCreateSchedule();
  const { mutate: update, isPending: updating } = useUpdateSchedule();
  const { mutate: remove } = useDeleteSchedule();
  const { mutate: toggleStatus } = useToggleScheduleStatus();

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ mode: 'create' }); };
  const openEdit = (s: Schedule) => {
    const getID = (val: string | Station) => typeof val === 'object' ? val.station_id : val;
    setForm({
      train_id: s.train_id, 
      departure_station: getID(s.departure_station), 
      arrival_station: getID(s.arrival_station),
      departure_time: s.departure_time.slice(0, 16), 
      arrival_time: s.arrival_time.slice(0, 16),
      price: String(s.price), 
      price_business: String(s.price_business ?? ''), 
      price_vip: String(s.price_vip ?? ''),
    });
    setModal({ mode: 'edit', data: s });
  };

  const handleSave = () => {
    const payload = {
      train_id: form.train_id, departure_station: form.departure_station, arrival_station: form.arrival_station,
      departure_time: new Date(form.departure_time).toISOString(),
      arrival_time: new Date(form.arrival_time).toISOString(),
      price: Number(form.price),
      price_business: form.price_business ? Number(form.price_business) : undefined,
      price_vip: form.price_vip ? Number(form.price_vip) : undefined,
    };
    if (modal?.mode === 'create') create(payload, { onSuccess: () => setModal(null) });
    else if (modal?.data) update({ id: modal.data.schedule_id, ...payload }, { onSuccess: () => setModal(null) });
  };

  const stationName = (val: string | Station) => {
    if (typeof val === 'object' && val !== null) return val.station_name;
    return stations.find((s: Station) => s.station_id === val)?.station_name ?? val;
  };

  const columns = [
    {
      header: 'Rute & Armada',
      accessor: (s: Schedule) => (
        <div className="space-y-2">
          <div className="flex items-center gap-3 font-hanken font-bold text-[#141d23] text-[16px]">
            <span>{stationName(s.departure_station)}</span>
            <ArrowRight size={14} className="text-[#870012]" />
            <span>{stationName(s.arrival_station)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest">
            <Train size={12} /> {s.train?.train_code || 'WHS-X'}
          </div>
        </div>
      ),
    },
    {
      header: 'Waktu Operasional',
      accessor: (s: Schedule) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#141d23]">
            <Clock size={14} className="text-[#870012]" />
            {formatDT(s.departure_time)}
          </div>
          <p className="text-[11px] font-medium text-[#8c9aaf] pl-6">Hingga {formatDT(s.arrival_time)}</p>
        </div>
      ),
    },
    {
      header: 'Struktur Harga',
      accessor: (s: Schedule) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="neutral" className="text-[9px] py-0 px-2">ECO</Badge>
            <span className="text-[13px] font-black">{formatCurrency(s.price)}</span>
          </div>
          {s.price_business && (
            <div className="flex items-center gap-2">
              <Badge variant="info" className="text-[9px] py-0 px-2">BUS</Badge>
              <span className="text-[13px] font-black">{formatCurrency(s.price_business)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (s: Schedule) => (
        <Badge variant={s.status === 'active' ? 'success' : 'neutral'} dot>
          {s.status === 'active' ? 'AKTIF' : 'NONAKTIF'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      accessor: (s: Schedule) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleStatus({ id: s.schedule_id, status: s.status === 'active' ? 'inactive' : 'active' })}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
              s.status === 'active' ? 'text-[#870012] bg-[#fbeaea]' : 'text-[#8c9aaf] bg-gray-50'
            }`}
            title="Toggle status"
          >
            {s.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          </button>
          <button onClick={() => openEdit(s)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5bdba] text-[#5c6a7e] hover:border-[#870012] hover:text-[#870012]">
            <Edit2 size={16} />
          </button>
          <button onClick={() => { if(confirm('Hapus jadwal?')) remove(s.schedule_id); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-[#ba1a1a]">
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
          <h1 className="font-hanken text-[36px] font-black text-[#141d23] tracking-tight leading-none mb-2">Jadwal Perjalanan</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Atur waktu keberangkatan, penetapan harga, dan status aktif rute.</p>
        </div>
        <Button 
          variant="primary" 
          size="lg" 
          leftIcon={<Plus size={20} />} 
          onClick={openCreate}
          className="shadow-xl"
        >
          TAMBAH JADWAL
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <Card noPadding className="p-8 border-none shadow-xl shadow-[#141d23]/5 mb-8">
            <div className="flex items-center gap-4 text-[#141d23]">
              <Calendar size={20} className="text-[#870012]" />
              <p className="font-inter font-bold text-sm">
                Total {schedules.length} Jadwal Operasional Aktif & Nonaktif.
              </p>
            </div>
          </Card>

          <Table
            columns={columns}
            data={schedules}
            isLoading={isLoading}
            emptyMessage="Jadwal belum dikonfigurasi"
          />
        </div>
      </div>

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? 'Tambah Jadwal Baru' : 'Perbarui Jadwal'}
        size="lg"
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" fullWidth onClick={() => setModal(null)}>BATAL</Button>
            <Button 
              fullWidth 
              onClick={handleSave} 
              isLoading={creating || updating}
              disabled={!form.train_id || !form.departure_station || !form.arrival_station || !form.departure_time || !form.arrival_time || !form.price}
            >
              SIMPAN JADWAL
            </Button>
          </div>
        }
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Core Info */}
            <div className="space-y-6">
              <Select 
                label="Armada Kereta"
                value={form.train_id}
                onChange={(e) => setForm(f => ({ ...f, train_id: e.target.value }))}
                options={[
                  { value: '', label: 'Pilih Kereta' },
                  ...trains.map((t: TrainType) => ({ value: t.train_id, label: t.train_name }))
                ]}
                fullWidth
              />

              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Dari (Asal)"
                  value={form.departure_station}
                  onChange={(e) => setForm(f => ({ ...f, departure_station: e.target.value }))}
                  options={[
                    { value: '', label: 'Pilih Asal' },
                    ...stations.map((s: Station) => ({ value: s.station_id, label: s.station_name }))
                  ]}
                  fullWidth
                />
                <Select 
                  label="Ke (Tujuan)"
                  value={form.arrival_station}
                  onChange={(e) => setForm(f => ({ ...f, arrival_station: e.target.value }))}
                  options={[
                    { value: '', label: 'Pilih Tujuan' },
                    ...stations.map((s: Station) => ({ value: s.station_id, label: s.station_name }))
                  ]}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Waktu Berangkat" type="datetime-local" fullWidth value={form.departure_time} onChange={(e) => setForm(f => ({ ...f, departure_time: e.target.value }))} />
                <Input label="Waktu Tiba" type="datetime-local" fullWidth value={form.arrival_time} onChange={(e) => setForm(f => ({ ...f, arrival_time: e.target.value }))} />
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-[#f6faff] p-8 rounded-[2rem] border border-[#eef2f6] space-y-6">
              <h4 className="font-hanken font-black text-lg text-[#141d23] flex items-center gap-3">
                <DollarSign size={20} className="text-[#870012]" />
                Konfigurasi Harga
              </h4>
              <Input label="Ekonomi (Base)" type="number" fullWidth value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="150000" />
              <Input label="Bisnis" type="number" fullWidth value={form.price_business} onChange={(e) => setForm(f => ({ ...f, price_business: e.target.value }))} placeholder="300000" />
              <Input label="VIP / First Class" type="number" fullWidth value={form.price_vip} onChange={(e) => setForm(f => ({ ...f, price_vip: e.target.value }))} placeholder="500000" />
              
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#eef2f6]">
                <Info size={16} className="text-blue-500 mt-1" />
                <p className="text-[11px] font-medium text-[#5c6a7e] leading-relaxed">
                  Harga yang Anda masukkan akan menjadi acuan billing saat pengguna melakukan reservasi. Pastikan nominal sesuai dengan kebijakan tarif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
