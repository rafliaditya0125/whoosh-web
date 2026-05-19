import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Clock, CreditCard, Smartphone, Building2, ChevronLeft, ShieldCheck, Ticket, Hash, ArrowRight } from 'lucide-react';
import paymentService from '../services/paymentService';
import { useBookingDetail } from '@/features/booking/hooks/useBooking';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/Spinner';

const METHODS = [
  { id: 'qris', label: 'QRIS Snap', icon: Smartphone, desc: 'Pindai otomatis via semua m-banking & e-wallet', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'bank_transfer', label: 'Virtual Account', icon: Building2, desc: 'Transfer antar bank (BCA, Mandiri, BNI, BRI)', color: 'text-[#870012]', bg: 'bg-[#fbeaea]' },
  { id: 'ewallet', label: 'E-Wallet Direct', icon: CreditCard, desc: 'GoPay, OVO, Dana, ShopeePay', color: 'text-purple-600', bg: 'bg-purple-50' },
];

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining]);
  const m = Math.floor(remaining / 60).toString().padStart(2, '0');
  const s = (remaining % 60).toString().padStart(2, '0');
  return { display: `${m}:${s}`, expired: remaining <= 0 };
}

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [method, setMethod] = useState('qris');
  const { display, expired } = useCountdown(15 * 60);

  const { data: booking, isLoading } = useBookingDetail(bookingId!);

  const { mutate: pay, isPending } = useMutation({
    mutationFn: () =>
      paymentService.create(bookingId!, {
        payment_method_id: method,
        amount: booking!.total_price,
      }),
    onSuccess: () => {
      navigate(`/tickets`);
    },
  });

  useEffect(() => {
    if (expired) navigate('/tickets');
  }, [expired, navigate]);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-[#f6faff]"><Spinner size="xl" /></div>;
  if (!booking) return null;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

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
            <h1 className="font-hanken text-2xl font-black text-[#141d23] tracking-tight leading-none">Pilih Pembayaran</h1>
          </div>
          <Badge variant="info" className="bg-blue-50 border-blue-100 font-black tracking-widest text-[10px]">TRANSAKSI AMAN</Badge>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-10 animate-fadeIn space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Timer Banner */}
            <div className={`p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden transition-all duration-700 ${expired ? 'bg-[#ba1a1a] text-white' : 'bg-[#141d23] text-white'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-8 -translate-y-8" />
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${expired ? 'bg-white/20' : 'bg-[#870012]'}`}>
                  <Clock size={28} className="animate-pulse" />
                </div>
                <div>
                   <p className="font-inter font-black text-[11px] uppercase tracking-[0.3em] opacity-40 mb-1">Selesaikan dalam</p>
                   <p className="font-hanken text-[40px] font-black tracking-tighter leading-none">{display}</p>
                </div>
              </div>
              <div className="hidden md:block text-right opacity-30">
                 <p className="font-inter font-black text-[10px] uppercase tracking-widest leading-none mb-1">Merchant ID</p>
                 <p className="font-mono text-xs">WHS-PAY-0082</p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4">
                <span className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-[0.2em]">Pilih Kanal Pembayaran</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {METHODS.map(({ id, label, icon: Icon, desc, color, bg }) => {
                  const isActive = method === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setMethod(id)}
                      className={`
                        group relative w-full flex items-center gap-6 p-8 rounded-[2.5rem] border-2 transition-all duration-500
                        ${isActive 
                          ? 'bg-white border-[#870012] shadow-2xl shadow-[#870012]/10 scale-[1.02]' 
                          : 'bg-white border-transparent hover:border-[#eef2f6] shadow-sm'}
                      `}
                    >
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                        ${isActive ? `${bg} ${color} rotate-12 scale-110` : 'bg-slate-50 text-slate-300'}
                      `}>
                        <Icon size={28} />
                      </div>
                      <div className="text-left flex-grow">
                        <p className={`font-hanken font-black text-xl mb-1 transition-colors ${isActive ? 'text-[#141d23]' : 'text-slate-400'}`}>{label}</p>
                        <p className="font-inter font-medium text-sm text-slate-400 leading-tight">{desc}</p>
                      </div>
                      <div className={`
                        w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center
                        ${isActive ? 'border-[#870012] bg-[#870012]' : 'border-slate-200'}
                      `}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-2xl shadow-[#141d23]/5 p-10 !rounded-[3rem] bg-white text-[#141d23]">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-10 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#870012]">
                   <Ticket size={24} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-[#8c9aaf] uppercase tracking-widest leading-none mb-1">Booking Ref</p>
                   <p className="font-mono font-black text-sm text-[#141d23]">{booking.booking_code}</p>
                 </div>
               </div>

               <div className="space-y-4 mb-10 pb-8 border-b border-[#f6faff]">
                  <div className="flex justify-between items-center text-sm font-bold text-[#8c9aaf]">
                    <span>Tiket Whoosh</span>
                    <span className="text-[#141d23]">{formatPrice(booking.total_price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#8c9aaf]">
                    <span>Pajak (VAT)</span>
                    <Badge variant="success" className="bg-green-50 text-green-700 py-0 px-2 text-[9px] font-black">INCLUDED</Badge>
                  </div>
               </div>

               <div className="mb-10 text-center">
                  <p className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest mb-2">Total Harga</p>
                  <p className="font-hanken font-black text-4xl text-[#870012] tracking-tighter leading-none">{formatPrice(booking.total_price)}</p>
               </div>

               <Button 
                fullWidth 
                size="lg" 
                onClick={() => pay()} 
                isLoading={isPending} 
                disabled={expired}
                className="shadow-2xl shadow-[#870012]/40 font-black tracking-widest py-5 text-[15px]"
              >
                {isPending ? 'ENCRYPTING...' : 'KONFIRMASI BAYAR'}
              </Button>
            </Card>

            <div className="p-8 bg-[#141d23] rounded-[3rem] text-white flex items-start gap-4">
              <ShieldCheck size={32} className="text-[#870012] shrink-0" />
              <div>
                <p className="font-hanken font-black text-lg mb-1 leading-none tracking-tight">Xendit Secured</p>
                <p className="text-white/40 text-[11px] font-medium leading-relaxed italic">
                  Data pembayaran Anda diproses secara mandiri oleh Xendit sesuai standar PCI-DSS Level 1 global.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
