import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Train, Users, MapPin, ArrowRight, ShieldCheck, DollarSign, Clock, Hash } from 'lucide-react';
import { useCreateBooking } from '../hooks/useBooking';
import useBookingStore from '../stores/bookingStore';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

const CLASS_LABELS: Record<string, string> = { economy: 'Premium Economy', business: 'Business Class', vip: 'VIP Pass' };

export default function BookConfirmPage() {
  const navigate = useNavigate();
  const { selectedSchedule, passengers, seatLock } = useBookingStore();
  const { mutate: createBooking, isPending } = useCreateBooking();

  if (!selectedSchedule) { navigate('/'); return null; }

  const { schedule, departureStation, arrivalStation, selectedClass, classPrice } = selectedSchedule;
  const total = classPrice * passengers.length;

  const handleConfirm = () => {
    createBooking({
      schedule_id: schedule.schedule_id,
      lock_id: seatLock?.lock_id,
      passengers: passengers.map((p) => ({
        full_name: p.full_name,
        id_number: p.id_number,
        seat_id: p.seat_id,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-[#f6faff] pb-32">
      <div className="bg-white border-b border-[#e5bdba] sticky top-24 z-40 transition-all shadow-sm">
        <div className="container mx-auto max-w-4xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="w-12 h-12 bg-[#f6faff] rounded-2xl flex items-center justify-center text-[#870012] hover:bg-[#870012] hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-hanken text-2xl font-black text-[#141d23] tracking-tight leading-none">Konfirmasi Final</h1>
          </div>
          <Badge variant="success" dot className="bg-[#f0fff4]/50 text-[#00874e] border-[#c6f6d5]">KURSI TERKUNCI</Badge>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-10 animate-fadeIn space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Trip Summary Card */}
            <Card noPadding className="border-none shadow-2xl shadow-[#141d23]/5 !rounded-[3rem] overflow-hidden bg-white">
              <div className="bg-[#141d23] p-10 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#870012] rounded-2xl flex items-center justify-center">
                    <Train size={24} />
                  </div>
                  <div>
                    <h3 className="font-hanken font-black text-xl leading-none mb-1">Penerbangan di Darat</h3>
                    <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-none">WHOOSH EXPRESS • {schedule.train?.train_code}</p>
                  </div>
                </div>
                <Badge variant="info" className="bg-white/10 text-white border-white/20 px-5 py-2 font-black tracking-widest text-[10px] uppercase">{CLASS_LABELS[selectedClass]}</Badge>
              </div>

              <div className="p-10">
                <div className="flex items-center justify-between gap-10">
                  <div className="flex-1">
                    <p className="font-hanken text-[40px] font-black text-[#141d23] leading-none mb-4">{formatTime(schedule.departure_time)}</p>
                    <div className="flex items-start gap-2">
                       <MapPin size={16} className="text-[#870012] mt-0.5" />
                       <div>
                         <p className="font-inter font-black text-sm text-[#141d23] uppercase tracking-tight">{departureStation.station_name}</p>
                         <p className="text-[11px] font-medium text-[#8c9aaf] uppercase tracking-widest mt-1">Stasiun Keberangkatan</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <ArrowRight size={24} className="text-slate-200 mb-2" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Direct</span>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="font-hanken text-[40px] font-black text-[#141d23] leading-none mb-4">{formatTime(schedule.arrival_time)}</p>
                    <div className="flex items-start justify-end gap-2 text-right">
                       <div className="text-right">
                         <p className="font-inter font-black text-sm text-[#141d23] uppercase tracking-tight">{arrivalStation.station_name}</p>
                         <p className="text-[11px] font-medium text-[#8c9aaf] uppercase tracking-widest mt-1">Stasiun Tujuan</p>
                       </div>
                       <MapPin size={16} className="text-[#8c9aaf] mt-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Passenger Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 mb-2">
                <Users size={18} className="text-[#870012]" />
                <span className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-widest">Detail Manifest Penumpang</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {passengers.map((p, i) => (
                  <Card key={i} className="border-none shadow-xl shadow-[#141d23]/5 p-6 !rounded-[2rem] bg-white flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-[#f6faff] rounded-[1.25rem] flex items-center justify-center font-black text-[#141d23]">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-hanken font-black text-lg text-[#141d23] group-hover:text-[#870012] transition-colors">{p.full_name}</p>
                        <div className="flex items-center gap-3">
                           <span className="font-inter font-bold text-[11px] text-[#8c9aaf] uppercase tracking-widest">NIK: {p.id_number}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-200" />
                           <span className="font-inter font-bold text-[11px] text-[#00874e] uppercase tracking-widest">Asuransi Aktif</span>
                        </div>
                      </div>
                    </div>
                    {p.seat_id && (
                      <div className="text-center px-4 py-2 bg-[#fbeaea] rounded-xl border border-[#e5bdba]">
                        <p className="text-[9px] font-black text-[#870012] uppercase tracking-widest mb-1 leading-none">Seat No.</p>
                        <p className="font-mono font-black text-xl text-[#870012] leading-none">A1</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Summary Side */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-2xl shadow-[#141d23]/5 p-10 !rounded-[3rem] bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbeaea] rounded-full blur-3xl translate-x-12 -translate-y-12" />
              
              <h3 className="font-hanken font-black text-2xl text-[#141d23] mb-8 relative z-10">Rincian Pembayaran</h3>
              
              <div className="space-y-6 mb-10 relative z-10">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-inter font-bold text-[#8c9aaf]">{CLASS_LABELS[selectedClass]}</span>
                  <span className="font-hanken font-black text-[#141d23]">{formatPrice(classPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-inter font-bold text-[#8c9aaf]">Jumlah Penumpang</span>
                  <span className="font-hanken font-black text-[#141d23]">x{passengers.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-inter font-bold text-[#8c9aaf]">Biaya Layanan</span>
                  <Badge variant="success" className="bg-green-50 text-green-700 py-0 px-2 text-[9px] font-black">FREE</Badge>
                </div>
                <div className="pt-6 border-t border-[#f6faff] flex items-center justify-between">
                  <span className="font-hanken font-black text-lg text-[#141d23]">Total Tagihan</span>
                  <span className="font-hanken font-black text-3xl text-[#870012] tracking-tighter leading-none">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="p-6 bg-[#f6faff] rounded-[2rem] border border-[#eef2f6] space-y-4 mb-10">
                 <div className="flex items-center gap-3 text-[#141d23] opacity-60">
                   <Clock size={16} />
                   <span className="text-[11px] font-black uppercase tracking-widest">Batas Waktu Bayar</span>
                 </div>
                 <p className="font-hanken font-black text-[24px] text-slate-800 leading-none">14:59<span className="text-sm ml-2 font-black text-red-500 uppercase tracking-widest">Detik</span></p>
              </div>

              <Button 
                fullWidth 
                size="lg" 
                onClick={handleConfirm} 
                isLoading={isPending}
                className="shadow-2xl shadow-[#870012]/30 font-black tracking-[0.2em] py-5 text-[14px]"
              >
                BAYAR SEKARANG
              </Button>
            </Card>

            <div className="flex items-start gap-4 p-8 bg-[#141d23] rounded-[3rem] text-white">
              <ShieldCheck size={32} className="text-[#870012]" />
              <div className="space-y-1">
                <p className="font-hanken font-black text-[16px] leading-tight">Secure Checkout</p>
                <p className="text-[11px] font-medium text-white/40 leading-relaxed italic">
                  Transaksi Anda dienkripsi secara end-to-end melalui gateway pembayaran resmi Whoosh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
