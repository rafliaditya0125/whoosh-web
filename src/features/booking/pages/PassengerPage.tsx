import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit2, Users, Check, ShieldCheck, Info } from 'lucide-react';
import { useSavedPassengers } from '../hooks/useBooking';
import useBookingStore from '../stores/bookingStore';
import type { SavedPassenger } from '@/types';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/Spinner';

export default function PassengerPage() {
  const navigate = useNavigate();
  const { setPassengers } = useBookingStore();
  const { data: savedPassengers = [], isLoading } = useSavedPassengers();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const MAX = 15;

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < MAX) next.add(id);
      }
      return next;
    });
  };

  const handleDone = () => {
    const chosen = savedPassengers.filter((p: SavedPassenger) => selected.has(p.id));
    setPassengers(chosen.map((p: SavedPassenger) => ({
      full_name: p.full_name,
      id_number: p.id_number,
    })));
    navigate('/booking/book');
  };

  return (
    <div className="min-h-screen bg-[#f6faff] pb-24">
      {/* Premium Static Header */}
      <div className="bg-white border-b border-[#e5bdba] sticky top-24 z-40 transition-all shadow-sm">
        <div className="container mx-auto max-w-2xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="w-12 h-12 bg-[#f6faff] rounded-2xl flex items-center justify-center text-[#870012] hover:bg-[#870012] hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="font-hanken text-2xl font-black text-[#141d23] tracking-tight">Siapa yang Mau Jalan?</h1>
          </div>
          <Button 
            variant="primary" 
            onClick={handleDone} 
            disabled={selected.size === 0}
            className="px-10 shadow-xl shadow-[#870012]/20 font-black tracking-widest text-[12px]"
          >
            GAS LANJUT!
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-6 py-10 space-y-8 animate-fadeIn">
        {/* Status Card */}
        <Card className="bg-[#141d23] text-white border-none shadow-2xl relative overflow-hidden p-8 !rounded-[2.5rem]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#870012]/20 rounded-full blur-3xl translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-[#870012]" />
                <p className="font-hanken font-black text-xl">Batas Booking</p>
              </div>
              <Badge variant="info" className="bg-white/10 text-white border-white/20">MAX {MAX}</Badge>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[#8c9aaf] font-bold text-[13px] uppercase tracking-widest mb-1">Udah Kepilih</p>
                <div className="flex items-center gap-2">
                  <span className="font-hanken font-black text-5xl text-white leading-none">{selected.size}</span>
                  <span className="font-hanken font-black text-2xl text-white/30 italic">/ {MAX}</span>
                </div>
              </div>
              <p className="text-[12px] font-medium text-white/50 max-w-[150px] text-right italic">
                {selected.size === 0 ? 'Pilih minimal 1 orang buat lanjut.' : 'Data penumpang bakal masuk ke manifes perjalanan.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Action: Add New */}
        <button
          onClick={() => navigate('/booking/passenger-info')}
          className="w-full flex items-center justify-center gap-4 py-8 bg-white border-2 border-dashed border-[#e5bdba] rounded-[2rem] text-[#870012] font-hanken font-black tracking-widest text-[14px] hover:bg-[#f6faff] hover:border-[#870012] transition-all group"
        >
          <div className="w-10 h-10 bg-[#fbeaea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          TAMBAH DATA PENUMPANG
        </button>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-4 mb-2">
            <ShieldCheck size={18} className="text-[#00874e]" />
            <span className="text-[12px] font-black text-[#5c6a7e] uppercase tracking-widest">Daftar Penumpang yang Udah Kamu Simpen</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Spinner size="lg" />
              <p className="font-bold text-[#8c9aaf] text-xs uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
          ) : savedPassengers.length === 0 ? (
            <Card className="text-center py-16 border-none shadow-xl shadow-[#141d23]/5 bg-white/50">
              <p className="font-inter font-bold text-[#5c6a7e]">Daftar kamu masih kosong nih.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {savedPassengers.map((p: SavedPassenger) => {
                const isSelected = selected.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className={`
                      group w-full relative flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all duration-500
                      ${isSelected 
                        ? 'bg-white border-[#870012] shadow-xl shadow-[#870012]/10 scale-[1.02]' 
                        : 'bg-white border-transparent hover:border-[#e5bdba] shadow-sm'}
                    `}
                  >
                    {/* Checkbox Visual */}
                    <div className={`
                      w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0
                      ${isSelected ? 'bg-[#870012] border-[#870012] rotate-12 scale-110' : 'bg-slate-50 border-slate-100'}
                    `}>
                      {isSelected && <Check size={18} className="text-white" />}
                    </div>

                    {/* Info */}
                    <div className="flex-grow text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-hanken font-black text-[#141d23] text-lg tracking-tight group-hover:text-[#870012] transition-colors">{p.full_name}</span>
                        <Badge variant="info" className="text-[9px] py-0 px-2 bg-[#f6faff] border-[#eef2f6]">DEWASA</Badge>
                      </div>
                      <p className="font-inter font-medium text-[13px] text-[#8c9aaf]">
                        KTP/Paspor: {p.id_number}
                      </p>
                    </div>

                    {/* Edit Option */}
                    <div className="w-10 h-10 flex items-center justify-center text-[#bdc7d1] hover:text-[#870012] hover:bg-[#fbeaea] rounded-xl transition-all">
                      <Edit2 size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex items-start gap-4">
          <Info size={20} className="text-blue-500 mt-1" />
          <p className="text-[13px] font-medium text-blue-800 leading-relaxed">
            Data ini dipake buat keperluan manifes dan asuransi perjalanan. Pastiin nama lengkap sesuai sama kartu identitas (KTP/Paspor) kamu yang masih berlaku, ya!
          </p>
        </div>
      </div>
    </div>
  );
}
