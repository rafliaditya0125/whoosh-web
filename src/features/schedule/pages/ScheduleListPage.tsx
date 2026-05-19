import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, Clock, Train, MapPin, Calendar, 
  ArrowRight, Search, ChevronRight, Filter,
  Timer, Info, MoreHorizontal, User, Navigation
} from 'lucide-react';
import { useSchedules, useStations } from '../hooks/useSchedule';
import useBookingStore from '@/features/booking/stores/bookingStore';
import type { Schedule, SeatClass, Station } from '@/types';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(dep: string, arr: string) {
  const diff = (new Date(arr).getTime() - new Date(dep).getTime()) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

function formatPrice(n: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(n)}`;
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function ScheduleListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSelectedSchedule } = useBookingStore();

  const departure = searchParams.get('departure') || '';
  const arrival = searchParams.get('arrival') || '';
  const date = searchParams.get('date') || '';

  const { data: stations = [] } = useStations();
  const { data: schedules = [], isLoading, isError } = useSchedules({ departure, arrival, date });

  const stationMap = Object.fromEntries(stations.map((s: Station) => [s.station_id, s]));
  const depStation = stationMap[departure];
  const arrStation = stationMap[arrival];

  const changeDate = (newDate: string) => {
    setSearchParams({ departure, arrival, date: newDate });
  };

  const handleBook = (schedule: Schedule, cls: SeatClass, price: number) => {
    if (!depStation || !arrStation) return;
    setSelectedSchedule({
      schedule,
      departureStation: depStation,
      arrivalStation: arrStation,
      selectedClass: cls,
      classPrice: price,
    });
    navigate('/booking/book');
  };

  const getSeatBadge = (count: number) => {
    if (count < 10) return <Badge variant="danger" dot>Sisa {count} Kursi Aja</Badge>;
    if (count < 30) return <Badge variant="warning" dot>Sisa {count} Kursi</Badge>;
    return <Badge variant="success" dot>Masih Ada</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#f6faff]">
      {/* Search Header Bar */}
      <div className="bg-white border-b border-[#e5bdba] sticky top-24 z-40 transition-all duration-300 shadow-sm">
        <div className="container mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')} 
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#f6faff] text-[#141d23] hover:bg-[#870012] hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-4">
                <span className="font-hanken text-2xl font-black text-[#141d23] tracking-tight">{depStation?.station_name ?? '...'}</span>
                <div className="w-10 h-px bg-[#bdc7d1]" />
                <span className="font-hanken text-2xl font-black text-[#141d23] tracking-tight">{arrStation?.station_name ?? '...'}</span>
              </div>
              <p className="font-inter text-[#5c403e] text-[14px] font-bold mt-1 flex items-center gap-2">
                <Calendar size={14} className="text-[#870012]" />
                {date ? formatDate(date) : 'Memuat Tanggal...'}
              </p>
            </div>
          </div>

          {/* Progressive Date Picker */}
          <div className="flex items-center gap-2 bg-[#f6faff] p-2 rounded-2xl border border-[#eef2f6]">
            {[-1, 0, 1, 2, 3].map((diff) => {
              const d = date ? addDays(date, diff) : '';
              const isActive = diff === 0;
              const dateObj = new Date(d + 'T00:00:00');
              return (
                <button
                  key={diff}
                  onClick={() => changeDate(d)}
                  className={`
                    flex flex-col items-center justify-center w-24 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-[#870012] text-white shadow-xl shadow-[#870012]/30 scale-105' 
                      : 'text-[#5c6a7e] hover:bg-white hover:text-[#870012]'}
                  `}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-70">
                    {dateObj.toLocaleDateString('id-ID', { weekday: 'short' })}
                  </span>
                  <span className="font-hanken font-black text-lg leading-none">
                    {dateObj.getDate()} {dateObj.toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-8">
          <Card noPadding className="p-8 border-none shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-hanken text-xl font-black text-[#141d23] flex items-center gap-3">
                <Filter size={20} className="text-[#870012]" />
                Saring Jadwal
              </h3>
              <button className="text-[12px] font-bold text-[#870012] hover:underline">HAPUS</button>
            </div>

            <div className="space-y-10">
              <div>
                <p className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-widest mb-4">Kapan Berangkatnya?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Pagi', 'Siang', 'Sore', 'Malam'].map((time) => (
                    <button key={time} className="py-3 px-2 rounded-xl border border-[#eef2f6] text-[13px] font-bold text-[#1e2532] hover:border-[#870012] hover:bg-[#fbeaea] transition-all">
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-widest mb-4">Urutin Pake Apa?</p>
                <select className="w-full bg-[#f6faff] border border-[#eef2f6] rounded-xl p-3 font-inter font-bold text-sm outline-none focus:border-[#870012]">
                  <option>Keberangkatan Terawal</option>
                  <option>Keberangkatan Terakhir</option>
                  <option>Harga Termurah</option>
                </select>
              </div>

              <div className="pt-8 border-t border-[#f6faff]">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic font-inter text-[#5c6a7e] text-sm">
                  <p>"Keselamatan dan kenyamanan Anda adalah prioritas utama kami. Mohon datang 30 menit sebelum keberangkatan."</p>
                </div>
              </div>
            </div>
          </Card>
        </aside>

        {/* Schedule List Content */}
        <div className="lg:col-span-9 space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-16 h-16 border-4 border-[#870012] border-t-transparent rounded-full animate-spin" />
              <p className="font-hanken font-black text-xl text-[#141d23]">Lagi nyari jadwal paling pas buat kamu...</p>
            </div>
          ) : isError ? (
            <Card className="text-center py-20 border-none">
              <div className="text-6xl mb-6">⚠️</div>
              <h3 className="font-hanken text-2xl font-black mb-4">Terjadi Masalah</h3>
              <p className="font-inter text-[#5c403e] mb-8">Maaf, kami tidak dapat memuat jadwal saat ini. Silakan coba lagi nanti.</p>
              <Button onClick={() => window.location.reload()}>COBA LAGI</Button>
            </Card>
          ) : schedules.length === 0 ? (
            <Card className="text-center py-20 border-none bg-white/50 backdrop-blur-md">
              <div className="w-24 h-24 bg-[#f6faff] rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[#eef2f6]">
                <Search size={48} className="text-[#bdc7d1]" />
              </div>
              <h3 className="font-hanken text-[28px] font-black mb-4">Yah, Jadwal Nggak Ada Nih</h3>
              <p className="font-inter text-[#5c403e] text-lg max-w-sm mx-auto mb-12">
                Duh, nggak ada jadwal buat rute dan tanggal yang kamu pilih. Coba tanggal lain yuk!
              </p>
              <Button onClick={() => navigate('/')} variant="outline">GANTI RUTE</Button>
            </Card>
          ) : (
            schedules.map((s: Schedule) => (
              <Card key={s.schedule_id} noPadding className="border-none shadow-xl shadow-[#141d23]/5 group">
                {/* Header Train Info */}
                <div className="p-8 border-b border-[#f6faff] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#141d23] rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-[#141d23]/20 transition-transform group-hover:scale-105">
                      <Train size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-hanken text-xl font-black text-[#141d23]">{s.train_code || 'G1234'}</span>
                        <Badge variant="info">WHOOSH EXPRESS</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[#8c9aaf] font-bold text-xs uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Navigation size={12} /> Jakarta - Bandung</span>
                        <span className="flex items-center gap-1.5"><Timer size={12} /> {formatDuration(s.departure_time, s.arrival_time)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getSeatBadge(24)} {/* Mock seat count */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f6faff] text-[#bdc7d1] hover:text-[#870012] transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                {/* Times and Track View */}
                <div className="p-8 md:p-12">
                  <div className="flex items-center justify-between gap-12 max-w-3xl mx-auto">
                    <div className="text-center md:text-left">
                      <p className="font-hanken text-[48px] font-black text-[#141d23] leading-none mb-4">{formatTime(s.departure_time)}</p>
                      <p className="font-inter font-bold text-[14px] text-[#870012] uppercase tracking-[0.15em]">{depStation?.station_name || '...'}</p>
                    </div>

                    <div className="flex-grow relative px-12">
                      <div className="h-[2px] bg-dashed w-full bg-gradient-to-r from-[#eef2f6] via-[#bdc7d1] to-[#eef2f6]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#e5bdba] flex items-center justify-center shadow-lg shadow-[#141d23]/5">
                        <ChevronRight size={18} className="text-[#870012]" />
                      </div>
                      <div className="mt-4 text-center">
                        <span className="font-mono text-[11px] font-bold text-[#8c9aaf] uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          NON-STOP
                        </span>
                      </div>
                    </div>

                    <div className="text-center md:text-right">
                      <p className="font-hanken text-[48px] font-black text-[#141d23] leading-none mb-4">{formatTime(s.arrival_time)}</p>
                      <p className="font-inter font-bold text-[14px] text-[#5c6a7e] uppercase tracking-[0.15em]">{arrStation?.station_name || '...'}</p>
                    </div>
                  </div>
                </div>

                {/* Class Selection Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#f6faff]">
                  {[
                    { key: 'economy', label: 'Premium Economy', price: s.price, color: 'bg-slate-50 text-slate-700' },
                    { key: 'business', label: 'Business Class', price: s.price_business, color: 'bg-red-50/30 text-[#870012]' },
                    { key: 'vip', label: 'First Class', price: s.price_vip, color: 'bg-[#141d23] text-white' },
                  ].map((cls) => cls.price && (
                    <div 
                      key={cls.key} 
                      className={`p-8 border-r last:border-r-0 border-[#f6faff] flex flex-col justify-between hover:bg-[#f6faff]/50 transition-colors cursor-pointer group/item`}
                      onClick={() => handleBook(s, cls.key as SeatClass, cls.price as number)}
                    >
                      <div className="mb-8">
                        <div className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 ${cls.color}`}>
                          {cls.label}
                        </div>
                        <p className="font-hanken text-2xl font-black text-[#141d23] group-hover/item:text-[#870012] transition-colors">{formatPrice(cls.price as number)}</p>
                      </div>
                      <button className="flex items-center gap-3 font-hanken font-black text-[13px] text-[#870012] group-hover/item:gap-5 transition-all">
                        AMBIL KURSI <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}

          <Card noPadding className="p-12 border-dashed border-2 border-[#bdc7d1] bg-transparent text-center">
            <div className="max-w-md mx-auto">
              <h3 className="font-hanken text-xl font-black text-[#141d23] mb-4 flex items-center justify-center gap-4">
                <User size={24} className="text-[#870012]" />
                Layanan Prioritas
              </h3>
              <p className="font-inter text-[#5c403e] text-[15px] mb-8">
                Tenang, ada layanan bantuan buat lansia, ibu hamil, dan temen disabilitas di tiap stasiun kami.
              </p>
              <button className="font-hanken font-bold text-[#870012] flex items-center gap-2 mx-auto hover:gap-4 transition-all">
                Info Layanan <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
