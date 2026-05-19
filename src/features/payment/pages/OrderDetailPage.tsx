import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Clock, QrCode, Train, MapPin, ArrowRight, ShieldCheck, CreditCard, Undo2, Info, User, HelpCircle, Hash } from 'lucide-react';
import { useBookingDetail, useCancelBooking, useRefundBooking } from '@/features/booking/hooks/useBooking';
import ticketService from '../services/ticketService';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Modal from '@/shared/components/Modal';

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
function formatDateShort(dt: string) {
  return new Date(dt).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function formatDateTime(dt: string) {
  return new Date(dt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}
function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}
function formatDuration(dep: string, arr: string) {
  const diff = (new Date(arr).getTime() - new Date(dep).getTime()) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  const remaining = Math.max(0, targetMs - now);
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return `${m}m ${s}s`;
}

export default function OrderDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const { data: booking, isLoading } = useBookingDetail(bookingId!);
  const { mutate: cancel, isPending: cancelling } = useCancelBooking();
  const { mutate: refund, isPending: refunding } = useRefundBooking();

  const ticketId = booking?.ticket?.ticket_id;
  const { data: ticket } = useQuery({
    queryKey: ['ticket-qr', ticketId],
    queryFn: () => ticketService.getQR(ticketId!),
    enabled: !!ticketId && booking?.status === 'paid',
  });

  const payDeadlineMs = booking ? new Date(booking.created_at).getTime() + 20 * 60 * 1000 : 0;
  const countdown = useCountdown(payDeadlineMs);

  if (isLoading) return <div className="min-h-screen bg-[#f6faff] flex items-center justify-center font-bold text-[#8c9aaf] uppercase tracking-widest text-xs">Mempersiapkan Manifes...</div>;
  if (!booking) return null;

  const isPaid = booking.status === 'paid';
  const isPending = booking.status === 'pending';
  const isHistory = booking.status === 'completed' || booking.status === 'cancelled';

  const handleRefund = () => {
    refund({
      id: bookingId!,
      reason: refundReason,
      bank_account: { bank_name: bankName, account_number: accountNumber, account_name: accountName },
    });
    setShowRefundModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f6faff] pb-32">
      {/* Premium Header Decoration */}
      <div className="bg-[#141d23] pt-16 pb-32 px-6 relative overflow-hidden rounded-b-[4rem]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#870012]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(-1)} 
              className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-[#141d23] transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center">
              <h1 className="text-white text-2xl font-black tracking-tight leading-none mb-1">Detail Reservasi</h1>
              <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em]">Official Booking Ticket</p>
            </div>
            <button className="text-white/40 hover:text-white transition-colors">
              <HelpCircle size={24} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#870012] rounded-2xl flex items-center justify-center shadow-lg">
                <Hash size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Booking Reference</p>
                <p className="font-mono text-xl font-black text-white tracking-widest">{booking.booking_code}</p>
              </div>
            </div>
            <Badge 
              variant={isPaid ? 'success' : isPending ? 'warning' : 'neutral'} 
              className={`px-6 py-2 tracking-widest font-black text-[11px] uppercase ${isPaid ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}`}
            >
              {booking.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-6 -mt-16 relative z-20 space-y-8 animate-fadeIn">
        
        {/* Unpaid Alert */}
        {isPending && (
          <div className="bg-[#ba1a1a] p-6 rounded-[2rem] flex items-center justify-between text-white shadow-2xl shadow-[#ba1a1a]/20">
            <div className="flex items-center gap-4">
              <Clock size={24} className="animate-pulse" />
              <div>
                <p className="font-hanken font-black text-lg leading-none mb-1">Segera bayar tiket Anda</p>
                <p className="text-white/60 text-xs font-medium">Batas waktu sisa: {countdown}</p>
              </div>
            </div>
            <Button 
               variant="outline" 
               className="bg-white border-none text-[#ba1a1a] font-black text-[11px] tracking-widest px-8"
               onClick={() => navigate(`/payment/${bookingId}`)}
            >
              BAYAR SEKARANG
            </Button>
          </div>
        )}

        {/* Journey Card */}
        <Card noPadding className="border-none shadow-xl shadow-[#141d23]/5 !rounded-[3rem] overflow-hidden bg-white">
           <div className="p-10 border-b border-[#f6faff]">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#5c6a7e]">
                    <Train size={24} />
                  </div>
                  <div>
                    <h4 className="font-hanken font-black text-[#141d23] text-lg leading-none mb-1">WHOOSH EXPRESS</h4>
                    <p className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest">{booking.schedule?.train?.train_code}</p>
                  </div>
                </div>
                <Badge variant="info" className="bg-[#f6faff] border-[#eef2f6] px-5 py-1.5 font-black text-[#141d23] tracking-widest">{formatDateShort(booking.schedule?.departure_time ?? '')}</Badge>
              </div>

              <div className="flex items-center justify-between gap-10 mb-2">
                 <div className="flex-1">
                   <p className="font-hanken text-[48px] font-black text-[#141d23] tracking-tighter leading-none mb-4">{formatTime(booking.schedule?.departure_time ?? '')}</p>
                   <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#870012]" />
                      <span className="font-inter font-black text-sm text-[#141d23] uppercase tracking-tighter">{booking.schedule?.departure_station?.station_name}</span>
                   </div>
                 </div>
                 
                 <div className="flex flex-col items-center">
                    <div className="w-24 h-1 px-4 mb-2 flex items-center justify-center">
                       <ArrowRight size={24} className="text-[#eef2f6]" />
                    </div>
                    <span className="text-[9px] font-black text-[#bdc7d1] uppercase tracking-[0.4em]">{formatDuration(booking.schedule?.departure_time ?? '', booking.schedule?.arrival_time ?? '')}</span>
                 </div>

                 <div className="flex-1 text-right">
                   <p className="font-hanken text-[48px] font-black text-[#141d23] tracking-tighter leading-none mb-4">{formatTime(booking.schedule?.arrival_time ?? '')}</p>
                   <div className="flex items-center justify-end gap-2">
                      <span className="font-inter font-black text-sm text-[#141d23] uppercase tracking-tighter">{booking.schedule?.arrival_station?.station_name}</span>
                      <MapPin size={16} className="text-[#8c9aaf]" />
                   </div>
                 </div>
              </div>
           </div>

           {/* Quick Actions (Paid only) */}
           {isPaid && (
             <div className="flex border-t border-[#f6faff] bg-[#f6faff]/30">
                <button
                  onClick={() => navigate(`/reschedule/${bookingId}`)}
                  className="flex-1 py-6 flex items-center justify-center gap-3 font-hanken font-black text-[13px] tracking-[0.2em] uppercase text-[#141d23] hover:bg-white transition-all border-r border-[#f6faff]"
                >
                  <Undo2 size={18} className="text-[#870012]" /> Atur Jadwal
                </button>
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="flex-1 py-6 flex items-center justify-center gap-3 font-hanken font-black text-[13px] tracking-[0.2em] uppercase text-[#141d23] hover:bg-white transition-all"
                >
                  <CreditCard size={18} className="text-[#870012]" /> Ajukan Refund
                </button>
             </div>
           )}
        </Card>

        {/* Passenger List */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 px-4 mb-2">
             <User size={18} className="text-[#870012]" />
             <span className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-[0.2em]">Manifes Penumpang</span>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {booking.passengers?.map((p, i) => (
                <Card key={i} className="border-none shadow-xl shadow-[#141d23]/5 p-8 !rounded-[2.5rem] bg-white flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#f6faff] rounded-2xl flex items-center justify-center text-[#141d23] font-black text-xl border border-[#eef2f6]">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-hanken font-black text-xl text-[#141d23] mb-1 group-hover:text-[#870012] transition-colors uppercase">{p.full_name}</h4>
                      <div className="flex flex-wrap gap-4">
                        <span className="text-[11px] font-bold text-[#8c9aaf] uppercase tracking-widest">ID: {p.id_number}</span>
                        <span className="text-[11px] font-bold text-[#00874e] uppercase tracking-widest">Premium Ticket</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 border-t md:border-t-0 md:border-l border-[#f6faff] pt-6 md:pt-0 md:pl-8">
                     <div className="text-center">
                        <p className="text-[9px] font-black text-[#8c9aaf] uppercase tracking-widest mb-1">Kursi/Seat</p>
                        <p className="font-mono font-black text-xl text-[#141d23]">{p.seat?.seat_number || 'A1'}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[9px] font-black text-[#8c9aaf] uppercase tracking-widest mb-1">Kelas/Class</p>
                        <Badge variant="info" className="bg-blue-50 border-blue-100 text-blue-600 font-black px-4 py-1">{p.seat?.class || 'ECONOMY'}</Badge>
                     </div>
                     {isPaid && (
                       <button
                         onClick={() => setShowQR(true)}
                         className="flex items-center gap-3 bg-[#141d23] text-white px-6 py-3 rounded-2xl hover:bg-[#870012] transition-all shadow-lg active:scale-95"
                       >
                         <QrCode size={18} className="text-[#870012]" />
                         <span className="text-[11px] font-black tracking-widest uppercase">LIHAT TIKET</span>
                       </button>
                     )}
                  </div>
                </Card>
              ))}
           </div>
        </div>

        {/* Pricing Info */}
        <Card className="border-none shadow-xl shadow-[#141d23]/5 p-10 !rounded-[3rem] bg-white">
           <h4 className="font-hanken font-black text-2xl text-[#141d23] mb-1 leading-none">Rincian Transaksi</h4>
           <div className="space-y-6 pt-10">
              <div className="flex justify-between items-center text-sm font-bold text-[#8c9aaf]">
                <span>Harga Satuan x{booking.passengers?.length || 1}</span>
                <span className="text-[#141d23]">{formatPrice(booking.total_price)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-[#8c9aaf]">
                <span>PPN 11% & Biaya Layanan</span>
                <Badge variant="success" className="bg-green-50 text-green-700 py-0 px-2 text-[9px] font-black">TERMASUK</Badge>
              </div>
              <div className="pt-8 border-t border-[#f6faff] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-[#fbeaea] rounded-xl flex items-center justify-center text-[#870012] shadow-sm">
                      <CreditCard size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-[#8c9aaf] uppercase tracking-widest mb-1">Total Pembayaran</p>
                      <p className="font-hanken font-black text-3xl text-[#141d23] tracking-tighter">{formatPrice(booking.total_price)}</p>
                   </div>
                </div>
                {isPaid && <Badge variant="success" className="bg-green-500/10 text-green-600 border-green-500/20 px-8 py-2 font-black tracking-widest text-[12px] uppercase">LUNAS TERBAYAR</Badge>}
              </div>
           </div>
        </Card>

        {/* Disclaimer / Info */}
        <div className="p-10 bg-[#141d23] rounded-[3.5rem] text-white flex items-start gap-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#870012]/10 rounded-full blur-[80px]" />
           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#870012] border border-white/10 shrink-0">
              <ShieldCheck size={32} />
           </div>
           <div>
              <h4 className="font-hanken font-black text-xl mb-2">Informasi Boarding</h4>
              <p className="text-white/40 text-[13px] font-medium leading-relaxed italic">
                 Mohon tiba di stasiun minimal 30 menit sebelum jadwal keberangkatan untuk proses screening keamanan dan boarding. Tiket ini merupakan bukti sah perjalanan Anda.
              </p>
           </div>
        </div>
      </div>

      {/* QR Code Modal Rendering */}
      <Modal 
        isOpen={showQR} 
        onClose={() => setShowQR(false)}
        title="Tiket Digital Boarding"
      >
        <div className="flex flex-col items-center">
          <div className="p-10 bg-white border-4 border-[#141d23] rounded-[3rem] shadow-2xl relative mb-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#870012] text-white font-black text-[10px] tracking-widest px-8 py-2 rounded-full border-4 border-white">OFFICIAL TICKET</div>
            {ticket?.qr_code ? (
               <img src={`data:image/png;base64,${ticket.qr_code}`} alt="QR Code" className="w-64 h-64 grayscale contrast-125" />
            ) : (
               <div className="w-64 h-64 flex items-center justify-center"><Spinner /></div>
            )}
            <div className="mt-8 text-center">
               <p className="font-mono font-black text-xl text-[#141d23] tracking-[0.2em] mb-2">{booking.booking_code}</p>
               <p className="text-[10px] font-black text-[#bdc7d1] uppercase tracking-[0.5em]">Scan at Gate Entry</p>
            </div>
          </div>
          <div className="text-center space-y-2 mb-8">
             <div className="flex items-center justify-center gap-4 text-[#141d23] font-black">
                <span>{booking.schedule?.departure_station?.station_name}</span>
                <ArrowRight size={18} className="text-[#870012]" />
                <span>{booking.schedule?.arrival_station?.station_name}</span>
             </div>
             <p className="font-bold text-[#8c9aaf] text-xs uppercase tracking-widest">Keberangkatan: {formatTime(booking.schedule?.departure_time ?? '')} WIB</p>
          </div>
          <Button variant="primary" fullWidth onClick={() => setShowQR(false)} className="rounded-[2rem] py-6 font-black tracking-widest">TUTUP TIKET</Button>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Pengajuan Pengembalian Dana"
      >
        <div className="space-y-6 p-2">
           <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100 flex items-center gap-6">
              <Undo2 size={32} className="text-[#ba1a1a]" />
              <div>
                 <p className="font-hanken font-black text-[#ba1a1a] text-lg leading-none mb-1">Kebijakan Refund</p>
                 <p className="text-red-700/60 text-xs font-bold leading-relaxed italic">Biaya pembatalan sebesar 25% dari tarif dasar akan dikenakan secara otomatis.</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest ml-1">Alasan Pengajuan</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-[#f6faff] border-2 border-[#eef2f6] rounded-2xl py-4 px-6 outline-none focus:border-[#870012] focus:bg-white transition-all font-inter text-[15px] min-h-[100px]"
                  placeholder="Ceritakan alasan Anda..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { label: 'Bank Tujuan', value: bankName, set: setBankName, placeholder: 'BCA, Mandiri, BNI, BRI...' },
                   { label: 'Nomor Rekening', value: accountNumber, set: setAccountNumber, placeholder: 'Contoh: 12100823...' },
                 ].map(({ label, value, set, placeholder }) => (
                   <div key={label} className="space-y-2">
                     <label className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest ml-1">{label}</label>
                     <input
                       value={value}
                       onChange={(e) => set(e.target.value)}
                       placeholder={placeholder}
                       className="w-full h-14 bg-[#f6faff] border-2 border-[#eef2f6] rounded-xl px-6 outline-none focus:border-[#870012] focus:bg-white transition-all font-inter font-bold text-sm text-[#141d23]"
                     />
                   </div>
                 ))}
              </div>
              <div className="space-y-2">
                 <label className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest ml-1">Nama Pemilik Rekening</label>
                 <input
                   value={accountName}
                   onChange={(e) => setAccountName(e.target.value)}
                   placeholder="Sesuai buku tabungan"
                   className="w-full h-14 bg-[#f6faff] border-2 border-[#eef2f6] rounded-xl px-6 outline-none focus:border-[#870012] focus:bg-white transition-all font-inter font-bold text-sm text-[#141d23]"
                 />
              </div>
           </div>

           <div className="flex gap-4 pt-4">
              <Button variant="ghost" fullWidth onClick={() => setShowRefundModal(false)}>BATALKAN</Button>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleRefund}
                disabled={refunding || !refundReason || !bankName || !accountNumber || !accountName}
                isLoading={refunding}
                className="shadow-xl shadow-[#870012]/30"
              >
                PROSES REFUND
              </Button>
           </div>
        </div>
      </Modal>
    </div>
  );
}
