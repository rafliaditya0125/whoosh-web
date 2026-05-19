import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '@/features/booking/hooks/useBooking';
import { Ticket, ChevronRight, Hash, Calendar, ArrowRight, Zap, History, Clock, Users } from 'lucide-react';
import type { BookingDetail, BookingFilters } from '@/types';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/Spinner';

type Tab = NonNullable<BookingFilters['type']>;

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'unpaid', label: 'Menunggu Pembayaran', icon: Clock },
  { key: 'paid', label: 'Tiket Aktif', icon: Zap },
  { key: 'history', label: 'Riwayat Pesanan', icon: History },
];

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('unpaid');
  const { data, isLoading } = useMyBookings(activeTab);
  const bookings: BookingDetail[] = data?.items ?? [];

  const handleClick = (b: BookingDetail) => {
    navigate(`/tickets/${b.booking_id}`);
  };

  return (
    <div className="min-h-screen bg-[#f6faff] pb-24">
      {/* Page Header */}
      <div className="bg-white border-b border-[#e5bdba] sticky top-24 z-40 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
            <div>
              <h1 className="font-hanken text-[40px] font-black text-[#141d23] tracking-tighter leading-none mb-2">Tiket Saya</h1>
              <p className="font-inter text-[#5c403e] font-medium opacity-80">Pantau semua jadwal perjalanan seru kamu bareng Whoosh.</p>
            </div>
            <div className="bg-[#f6faff] rounded-2xl p-4 border border-[#eef2f6] flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#870012] shadow-sm">
                <Ticket size={24} />
              </div>
              <div>
                <p className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest leading-none mb-1">Total Tiket</p>
                <p className="font-hanken font-black text-[#141d23] text-xl">{bookings.length}</p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-4">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-3 py-4 px-8 rounded-2xl font-inter font-black text-[15px] transition-all duration-500
                  ${activeTab === key 
                    ? 'bg-[#870012] text-white shadow-xl shadow-[#870012]/30 scale-105' 
                    : 'bg-[#f6faff] text-[#5c403e] hover:bg-white hover:text-[#870012] border border-transparent hover:border-[#e5bdba]'}
                `}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Spinner size="xl" />
              <p className="font-hanken font-black text-[#141d23] text-lg uppercase tracking-widest">Sinkronisasi Tiket...</p>
            </div>
          ) : bookings.length === 0 ? (
            <Card className="text-center py-24 border-none shadow-xl shadow-[#141d23]/5 bg-white/50 backdrop-blur-md">
              <div className="w-24 h-24 bg-[#f6faff] rounded-[2.5rem] flex items-center justify-center text-[#bdc7d1] mx-auto mb-8 border border-[#eef2f6]">
                <Ticket size={48} />
              </div>
              <h3 className="font-hanken text-[32px] font-black text-[#141d23] mb-4 tracking-tight">Belum Ada Tiket</h3>
              <p className="font-inter text-[#5c403e] text-lg max-w-sm mx-auto mb-12 opacity-80 leading-relaxed">
                {activeTab === 'unpaid' 
                  ? 'Kamu nggak punya tagihan pembayaran yang nunggak saat ini. Aman pol!' 
                  : 'Kayaknya kamu belum pernah jalan-jalan nih. Yuk, mulai perjalanan pertama kamu!'}
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-[#870012] text-white font-hanken font-black px-12 py-5 rounded-[20px] shadow-2xl shadow-[#870012]/30 hover:bg-[#9d0015] hover:scale-105 active:scale-95 transition-all text-[15px] tracking-widest"
              >
                PESEN TIKETNYA SEKARANG
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-8 animate-fadeIn">
              {bookings.map((b) => (
                <div
                  key={b.booking_id}
                  onClick={() => handleClick(b)}
                  className="group relative cursor-pointer"
                >
                  <Card noPadding className="border-none shadow-xl shadow-[#141d23]/5 group-hover:shadow-2xl group-hover:shadow-[#870012]/10 transition-all duration-500 overflow-hidden !rounded-[2.5rem]">
                    {/* Status Badge Overaly */}
                    <div className="absolute top-8 right-8 z-10">
                      <Badge 
                        variant={activeTab === 'paid' ? 'success' : activeTab === 'unpaid' ? 'warning' : 'neutral'} 
                        dot 
                        className="py-2 px-5 bg-white backdrop-blur-md border-[#eef2f6] shadow-sm"
                      >
                        {TABS.find(t => t.key === activeTab)?.label}
                      </Badge>
                    </div>

                    <div className="p-10 flex flex-col md:flex-row gap-10">
                      {/* Left Side: Route Visual */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-10">
                          <div className="w-10 h-10 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#870012] border border-[#eef2f6]">
                            <Hash size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-[#8c9aaf] uppercase tracking-widest mb-0.5 leading-none">Booking Reference</p>
                            <p className="font-hanken font-black text-[#141d23] text-lg leading-none">{b.booking_code}</p>
                          </div>
                        </div>

                        {b.schedule && (
                          <div className="flex items-center justify-between gap-8 py-8 px-4 bg-[#f6faff]/50 rounded-[2rem] border border-[#f6faff] relative overflow-hidden group-hover:bg-[#f6faff] transition-colors">
                            <div className="relative z-10">
                              <p className="font-hanken text-[32px] font-black text-[#141d23] leading-none mb-3">{formatTime(b.schedule.departure_time)}</p>
                              <p className="font-inter font-bold text-[13px] text-[#870012] uppercase tracking-widest">{b.schedule.departure_station?.station_name || 'Jakarta'}</p>
                            </div>

                            <div className="flex-grow flex flex-col items-center relative z-10">
                              <ArrowRight size={24} className="text-[#bdc7d1] mb-2 group-hover:translate-x-4 transition-transform duration-700" />
                              <span className="font-mono text-[10px] font-bold text-[#8c9aaf] tracking-[0.2em]">{b.schedule.train?.train_code || 'G-WHOOSH'}</span>
                            </div>

                            <div className="text-right relative z-10">
                              <p className="font-hanken text-[32px] font-black text-[#141d23] leading-none mb-3">{formatTime(b.schedule.arrival_time)}</p>
                              <p className="font-inter font-bold text-[13px] text-[#5c6a7e] uppercase tracking-widest">{b.schedule.arrival_station?.station_name || 'Bandung'}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Quick Info & Action */}
                      <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#f6faff] pt-8 md:pt-0 md:pl-10">
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#5c6a7e]">
                              <Calendar size={18} />
                            </div>
                            <p className="font-inter font-black text-[#141d23] text-sm">
                              {b.schedule ? new Date(b.schedule.departure_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#5c6a7e]">
                              <Users size={18} />
                            </div>
                            <p className="font-inter font-bold text-[#5c6a7e] text-sm">
                              {b.passengers?.length ?? 1} Penumpang
                            </p>
                          </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-[#f6faff]">
                          <div className="flex items-center justify-between group-hover:text-[#870012] transition-colors">
                            <span className="font-hanken font-black text-[13px] tracking-widest uppercase">Cek Detailnya</span>
                            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
