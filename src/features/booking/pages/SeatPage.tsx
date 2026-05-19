import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Armchair, Navigation } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAvailableSeats } from '../hooks/useBooking';
import useBookingStore from '../stores/bookingStore';
import seatService from '../services/seatService';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/Spinner';
import type { SeatAvailable } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-white border-[#bdc7d1] text-[#141d23] hover:border-[#870012] hover:bg-[#fbeaea] cursor-pointer',
  locked: 'bg-amber-50 border-amber-200 cursor-not-allowed opacity-60 text-amber-600',
  booked: 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-40 text-slate-400',
  selected: 'bg-[#870012] border-[#870012] text-white shadow-lg shadow-[#870012]/30 scale-110 z-10',
};

export default function SeatPage() {
  const navigate = useNavigate();
  const { selectedSchedule, passengers, setSeatLock, setPassengers } = useBookingStore();
  const [selected, setSelected] = useState<string[]>([]);

  const needed = passengers.length;
  const scheduleId = selectedSchedule?.schedule.schedule_id ?? '';
  const seatClass = selectedSchedule?.selectedClass;

  const { data, isLoading } = useAvailableSeats(scheduleId, seatClass);
  const seats: SeatAvailable[] = data?.available_seats ?? [];

  const lockMutation = useMutation({
    mutationFn: () => seatService.lock(scheduleId, selected),
    onSuccess: (lock) => {
      setSeatLock(lock);
      const updated = passengers.map((p, i) => ({ ...p, seat_id: selected[i] }));
      setPassengers(updated);
      navigate('/booking/confirm');
    },
  });

  if (!selectedSchedule) { navigate('/'); return null; }

  const toggle = (seatId: string, status: string) => {
    if (status !== 'available') return;
    setSelected((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : prev.length < needed
        ? [...prev, seatId]
        : prev
    );
  };

  const rows = seats.reduce<Record<string, SeatAvailable[]>>((acc, s) => {
    const rowMatch = s.seat_number.match(/[A-Z]+/);
    const row = rowMatch ? rowMatch[0] : 'Unknown';
    if (!acc[row]) acc[row] = [];
    acc[row].push(s);
    return acc;
  }, {});

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
            <div>
              <h1 className="font-hanken text-2xl font-black text-[#141d23] tracking-tight leading-none mb-1">Pilih Kursi Kamu</h1>
              <p className="font-inter text-[#8c9aaf] font-bold text-xs uppercase tracking-widest">{needed} Penumpang • {seatClass?.toUpperCase()}</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <Badge variant="info" dot className="bg-blue-50 border-blue-100 mb-1">
              DIKIT LAGI SAMPAI!
            </Badge>
            <span className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest leading-none">Keberangkatan: {new Date(selectedSchedule.schedule.departure_time).toLocaleTimeString('id-id', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-10 animate-fadeIn space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Seat Map Area */}
          <div className="lg:col-span-8">
            <Card noPadding className="p-10 border-none shadow-2xl shadow-[#141d23]/5 !rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#870012]/30 to-transparent" />
              
              <div className="flex flex-col items-center mb-12">
                <div className="flex items-center gap-3 px-8 py-3 bg-[#141d23] rounded-2xl text-white shadow-xl mb-4">
                  <Navigation size={18} className="rotate-0 text-[#870012]" />
                  <span className="font-hanken font-black text-sm uppercase tracking-widest text-[11px]">DEPAN KERETA / FRONT</span>
                </div>
                <div className="w-full h-px bg-slate-100 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                    <Armchair size={20} className="text-[#bdc7d1]" />
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <Spinner size="lg" />
                  <p className="font-inter font-black text-[#8c9aaf] text-[10px] tracking-widest uppercase">Lagi nyiapin denah kursi nih...</p>
                </div>
              ) : (
                <div className="flex justify-center overflow-x-auto pb-4">
                  <div className="space-y-4 min-w-max">
                    {Object.entries(rows).map(([row, rowSeats]) => (
                      <div key={row} className="flex items-center gap-6">
                        <div className="w-6 font-hanken font-black text-[#bdc7d1] text-lg">{row}</div>
                        <div className="flex gap-4">
                          {rowSeats.map((seat, i) => {
                            const isSelected = selected.includes(seat.seat_id);
                            const statusKey = isSelected ? 'selected' : seat.status;
                            
                            // Add aisle spacer
                            const isAisle = i === Math.floor(rowSeats.length / 2);

                            return (
                              <div key={seat.seat_id} className="flex gap-4">
                                {isAisle && <div className="w-10 flex items-center justify-center font-mono text-[9px] font-black text-[#eef2f6] rotate-90 tracking-[1em] uppercase">GANG</div>}
                                <button
                                  onClick={() => toggle(seat.seat_id, seat.status)}
                                  className={`
                                    w-11 h-11 rounded-[0.75rem] border-2 font-mono font-black text-sm transition-all duration-300
                                    ${STATUS_STYLES[statusKey]}
                                  `}
                                  title={`${seat.seat_number} - ${seat.status}`}
                                >
                                  {seat.seat_number.replace(row, '')}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 pt-10 border-t border-slate-50 flex flex-wrap justify-center gap-8">
                {[
                  { label: 'Bisa Dipilih', cls: 'bg-white border-[#bdc7d1]' },
                  { label: 'Pilihan Kamu', cls: 'bg-[#870012] border-[#870012]' },
                  { label: 'Udah Keisi', cls: 'bg-slate-100 border-slate-200' },
                  { label: 'Prioritas', cls: 'bg-amber-50 border-amber-200' },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border-2 ${cls}`} />
                    <span className="font-hanken font-bold text-[11px] text-[#5c6a7e] uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-xl shadow-[#141d23]/5 p-8 !rounded-[2.5rem] bg-white">
              <h3 className="font-hanken font-black text-xl text-[#141d23] mb-6">Pilihan Kamu</h3>
              <div className="space-y-4">
                {passengers.map((p, i) => {
                  const seatId = selected[i];
                  const seat = seats.find(s => s.seat_id === seatId);
                  return (
                    <div key={i} className="p-5 bg-[#f6faff] rounded-2xl border border-[#eef2f6] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#5c6a7e] border border-[#eef2f6]">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-bold text-[#141d23] text-sm leading-none mb-1">{p.full_name}</p>
                          <p className="text-[11px] font-medium text-[#8c9aaf]">Premium Economy</p>
                        </div>
                      </div>
                      <div className={`font-mono font-black text-lg ${seat ? 'text-[#870012]' : 'text-[#bdc7d1]'}`}>
                        {seat ? seat.seat_number : '--'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="border-none shadow-xl shadow-[#141d23]/5 p-8 !rounded-[2.5rem] bg-[#141d23] text-white">
               <div className="flex items-start gap-4 mb-8">
                  <div className="p-3 bg-white/10 rounded-xl text-[#870012]">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="font-hanken font-black text-lg mb-1 leading-none">Kursi Dikunci Otomatis</h4>
                    <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                      Kursi yang kamu pilih bakal dikunci selama 10 menit ya, biar kamu ada waktu buat bayar.
                    </p>
                  </div>
               </div>
               
               <Button
                fullWidth
                size="lg"
                onClick={() => lockMutation.mutate()}
                disabled={selected.length !== needed}
                isLoading={lockMutation.isPending}
                className="shadow-2xl shadow-[#870012]/40 font-black tracking-widest text-[13px] py-4"
              >
                {selected.length === needed
                  ? `KONFIRMASI ${needed} KURSI`
                  : `PILIH ${needed - selected.length} KURSI LAGI`}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
