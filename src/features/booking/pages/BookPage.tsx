import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Check, Users, ShieldCheck, MapPin } from 'lucide-react';
import useBookingStore from '../stores/bookingStore';
import type { SeatClass } from '@/types';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatDuration(dep: string, arr: string) {
  const diff = (new Date(arr).getTime() - new Date(dep).getTime()) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h} jam ${m} mnt` : `${m} mnt`;
}

function formatDateShort(dt: string) {
  return new Date(dt).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

const CLASS_OPTIONS: { key: SeatClass; label: string; detail: string }[] = [
  { key: 'vip', label: 'VIP Pass', detail: '1-1 Seat Config' },
  { key: 'business', label: 'Business', detail: '2-2 Seat Config' },
  { key: 'economy', label: 'Premium Econ', detail: '2-3 Seat Config' },
];

export default function BookPage() {
  const navigate = useNavigate();
  const { selectedSchedule, passengers, setSelectedSchedule } = useBookingStore();

  if (!selectedSchedule) {
    navigate('/');
    return null;
  }

  const { schedule, departureStation, arrivalStation, selectedClass } = selectedSchedule;
  const [activeClass, setActiveClass] = useState<SeatClass>(selectedClass);

  const getPrice = (cls: SeatClass) => {
    if (cls === 'vip') return schedule.price_vip;
    if (cls === 'business') return schedule.price_business;
    return schedule.price;
  };

  const handleClassSelect = (cls: SeatClass) => {
    const price = getPrice(cls);
    if (price === undefined) return;
    setActiveClass(cls);
    setSelectedSchedule({ ...selectedSchedule, selectedClass: cls, classPrice: price });
  };

  return (
    <div className="min-h-screen bg-[#f6faff] pb-48">
      {/* Header */}
      <div className="bg-white border-b border-[#e5bdba] sticky top-24 z-40 transition-all shadow-sm">
        <div className="container mx-auto max-w-3xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-[#f6faff] rounded-2xl flex items-center justify-center text-[#870012] hover:bg-[#870012] hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-hanken text-2xl font-black text-[#141d23] tracking-tight leading-none">Cek Dulu Pesanan Kamu</h1>
          </div>
          <Badge variant="info" className="bg-blue-50 border-blue-100 font-black tracking-widest text-[10px]">STEP 1/3</Badge>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-6 py-10 space-y-10 animate-fadeIn">

        {/* Trip Detail Card */}
        <Card noPadding className="border-none shadow-2xl shadow-[#141d23]/5 !rounded-[3rem] overflow-hidden bg-white">
          <div className="p-10 border-b border-[#f6faff]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fbeaea] rounded-xl flex items-center justify-center text-[#870012]">
                  <Clock size={20} />
                </div>
                <span className="font-hanken font-black text-[#141d23] tracking-tight">{formatDateShort(schedule.departure_time)}</span>
              </div>
              <Badge variant="neutral" className="bg-[#f6faff] border-[#eef2f6] text-[#8c9aaf] font-black">{formatDuration(schedule.departure_time, schedule.arrival_time)}</Badge>
            </div>

            <div className="flex items-center justify-between gap-10">
              <div className="flex-grow">
                <p className="font-hanken text-[40px] font-black text-[#141d23] leading-none mb-4">{formatTime(schedule.departure_time)}</p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#870012]" />
                  <span className="font-inter font-black text-sm text-[#141d23] uppercase tracking-tight">{departureStation.station_name}</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="font-mono text-[11px] font-black text-[#bdc7d1] mb-2 tracking-[0.2em]">{(schedule as any).train?.train_code || (schedule as any).train_code || 'G-WHOOSH'}</div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-[3px] bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-[#870012] origin-left animate-slideRight" />
                  </div>
                </div>
              </div>

              <div className="flex-grow text-right">
                <p className="font-hanken text-[40px] font-black text-[#141d23] leading-none mb-4">{formatTime(schedule.arrival_time)}</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="font-inter font-black text-sm text-[#141d23] uppercase tracking-tight">{arrivalStation.station_name}</span>
                  <MapPin size={16} className="text-[#8c9aaf]" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Class Selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <span className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-[0.2em]">Pilih Kelas Kursi Kamu</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLASS_OPTIONS.map(({ key, label, detail }) => {
              const price = getPrice(key);
              if (price === undefined) return null;
              const isActive = activeClass === key;
              return (
                <button
                  key={key}
                  onClick={() => handleClassSelect(key)}
                  className={`
                    relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 overflow-hidden
                    ${isActive
                      ? 'bg-[#141d23] border-[#870012] text-white shadow-2xl shadow-[#141d23]/20 scale-[1.05] z-10'
                      : 'bg-white border-transparent hover:border-[#e5bdba] text-[#141d23] shadow-sm'}
                  `}
                >
                  <p className={`font-hanken font-black text-xl mb-1 ${isActive ? 'text-white' : 'text-[#141d23]'}`}>{formatPrice(price)}</p>
                  <p className={`font-inter font-black text-[11px] uppercase tracking-widest mb-4 ${isActive ? 'text-[#870012]' : 'text-[#8c9aaf]'}`}>{label}</p>
                  <div className={`text-[10px] font-bold ${isActive ? 'text-white/40' : 'text-slate-300'}`}>{detail}</div>

                  {isActive && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-[#870012] rounded-xl flex items-center justify-center shadow-lg">
                      <Check size={18} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Passenger Information */}
        <Card noPadding className="border-none shadow-xl shadow-[#141d23]/5 !rounded-[3rem] overflow-hidden bg-white">
          <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#f6faff] rounded-[2rem] flex items-center justify-center text-[#870012]">
                <Users size={32} />
              </div>
              <div>
                <h3 className="font-hanken font-black text-xl text-[#141d23] mb-1">Siapa Aja yang Berangkat?</h3>
                {passengers.length > 0 ? (
                  <p className="font-inter font-bold text-sm text-[#00874e]">{passengers.length} Penumpang Terdaftar</p>
                ) : (
                  <p className="font-inter font-bold text-sm text-[#ba1a1a]">Manifes penumpang belum diisi.</p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/booking/passengers')}
              className="border-[#e5bdba] text-[#870012] font-black tracking-widest px-10 hover:bg-[#870012] hover:text-white transition-all"
            >
              {passengers.length > 0 ? 'EDIT DATA' : 'TAMBAH DATA'}
            </Button>
          </div>

          {passengers.length > 0 && (
            <div className="px-10 pb-10 flex flex-wrap gap-3">
              {passengers.map((p, i) => (
                <Badge key={i} variant="neutral" className="bg-[#f6faff] border-[#eef2f6] px-4 py-1.5 font-bold text-[#141d23]">
                  {p.full_name}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Policies */}
        <div className="p-10 bg-[#141d23] rounded-[3rem] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#870012]/10 rounded-full blur-3xl" />
          <h4 className="font-hanken font-black text-lg mb-6 flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#870012]" /> Kebijakan Transaksi
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] font-medium text-white/50 leading-relaxed italic">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5">1</div>
              <p>Pastiin nama dan nomor identitas sama kayak di KTP/Paspor yang kamu bawa pas boarding nanti.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5">2</div>
              <p>Anak di bawah 3 tahun (infant) tidak dikenakan biaya namun tidak mendapatkan jaminan kursi terpisah.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-[#eef2f6] p-8 z-50">
        <div className="container mx-auto max-w-3xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-grow">
            <p className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest mb-1">Total Estimasi Harga</p>
            <p className="font-hanken font-black text-3xl text-[#870012] tracking-tighter leading-none">{formatPrice(getPrice(activeClass) * (passengers.length || 1))}</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/booking/seats')}
              className="flex-grow md:flex-none px-12 border-[#e5bdba] text-[#141d23] font-black tracking-widest bg-white"
            >
              PILIH KURSI
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/booking/confirm')}
              disabled={passengers.length === 0}
              className="flex-grow md:flex-none px-12 shadow-2xl shadow-[#870012]/30 font-black tracking-widest"
            >
              LANJUT KE BAYAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
