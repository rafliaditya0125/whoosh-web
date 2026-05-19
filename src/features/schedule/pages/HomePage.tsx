import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, Calendar, MapPin, Search, 
  ChevronRight, Train, ShieldCheck, Zap,
  Navigation, Smartphone, Bell, Info
} from 'lucide-react';
import { useStations } from '../hooks/useSchedule';
import type { Station } from '@/types';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: stations = [], isLoading } = useStations();

  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');

  const swap = () => {
    setDeparture(arrival);
    setArrival(departure);
  };

  const handleSearch = () => {
    if (!departure || !arrival || !date) return;
    navigate(`/schedules?departure=${departure}&arrival=${arrival}&date=${date}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-[#f6faff] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden mb-24 rounded-b-[4rem] bg-[#141d23]">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#141d23] via-[#141d23]/80 to-transparent" />
        
        {/* Particles/Shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#870012]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-[13px] font-bold uppercase tracking-widest mb-8">
              <Zap size={14} className="text-[#870012]" />
              Naik Kereta Masa Depan, Yuk!
            </div>
            
            <h1 className="font-hanken text-white text-[64px] lg:text-[80px] font-black leading-[1.05] mb-8 tracking-tighter">
              Redefining <span className="text-[#870012]">Speed.</span><br />
              Precision in Motion.
            </h1>
            
            <p className="font-inter text-[#bdc7d1] text-xl leading-relaxed max-w-lg mb-12 opacity-90">
              Nikmatin perjalanan seru bareng Kereta Cepat Jakarta-Bandung. 
              Sat-set, aman, dan pastinya nyaman banget buat kamu.
            </p>

            <div className="flex flex-wrap gap-6">
              <Button size="lg" className="px-10 py-5 rounded-[20px]" leftIcon={<Search size={20} />} onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}>
                YUK, BELI TIKETNYA!
              </Button>
            </div>
          </div>

          <div className="hidden lg:block relative fade-in delay-300">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 rotate-3 translate-y-12 transition-transform hover:rotate-0 duration-700 group">
              <img 
                src="https://images.unsplash.com/photo-1532105956690-b14a887bb72d?auto=format&fit=crop&q=80&w=800" 
                alt="Whoosh Train" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141d23] to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <span className="font-hanken text-white text-3xl font-black">Whoosh</span>
                <p className="text-white/80 font-bold tracking-widest text-[12px] uppercase">Jakarta - Bandung</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Search Section */}
      <section id="search-section" className="container mx-auto px-6 -mt-40 relative z-30 mb-24">
        <Card noPadding className="shadow-2xl shadow-[#141d23]/10 !rounded-[4rem] p-8 lg:p-10 border-none bg-white">
          <div className="flex flex-col xl:flex-row items-end gap-6">
            
            {/* Stations and Date Group */}
            <div className="flex-[5] w-full grid grid-cols-1 lg:grid-cols-11 gap-4 items-end">
              
              {/* Departure */}
              <div className="lg:col-span-4 relative group w-full">
                <label className="flex items-center gap-3 text-[11px] font-black text-[#5c6a7e] mb-3 px-2 uppercase tracking-[0.2em]">
                  <Navigation size={14} className="text-[#870012]" /> Berangkat dari mana?
                </label>
                <div className="relative">
                  <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-[#f6faff] border-2 border-[#eef2f6] rounded-2xl py-4 px-6 text-[17px] font-black text-[#141d23] outline-none focus:border-[#870012] focus:bg-white transition-all appearance-none cursor-pointer group-hover:border-[#bdc7d1]"
                  >
                    <option value="">Pilih stasiun asal</option>
                    {stations
                      .filter((sRef: Station) => sRef.station_id !== arrival)
                      .map((sRef: Station) => (
                        <option key={sRef.station_id} value={sRef.station_id}>{sRef.station_name}</option>
                      ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#bdc7d1]">
                    <ChevronRight size={20} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Switch Button Container */}
              <div className="lg:col-span-1 flex items-center justify-center pb-2">
                <button
                  type="button"
                  onClick={swap}
                  className="w-12 h-12 rounded-xl bg-[#f6faff] border-2 border-[#eef2f6] text-[#870012] transition-all hover:bg-[#870012] hover:text-white hover:border-[#870012] active:scale-90 flex items-center justify-center group shadow-sm"
                  title="Tukar Rute"
                >
                  <ArrowLeftRight size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>

              {/* Arrival */}
              <div className="lg:col-span-4 relative group w-full">
                <label className="flex items-center gap-3 text-[11px] font-black text-[#5c6a7e] mb-3 px-2 uppercase tracking-[0.2em]">
                  <MapPin size={14} className="text-[#870012]" /> Mau ke mana?
                </label>
                <div className="relative">
                  <select
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-[#f6faff] border-2 border-[#eef2f6] rounded-2xl py-4 px-6 text-[17px] font-black text-[#141d23] outline-none focus:border-[#870012] focus:bg-white transition-all appearance-none cursor-pointer group-hover:border-[#bdc7d1]"
                  >
                    <option value="">Pilih stasiun tujuan</option>
                    {stations
                      .filter((sRef: Station) => sRef.station_id !== departure)
                      .map((sRef: Station) => (
                        <option key={sRef.station_id} value={sRef.station_id}>{sRef.station_name}</option>
                      ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#bdc7d1]">
                    <ChevronRight size={20} className="rotate-90" />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="lg:col-span-2 relative group w-full">
                <label className="flex items-center gap-3 text-[11px] font-black text-[#5c6a7e] mb-3 px-2 uppercase tracking-[0.2em]">
                  <Calendar size={14} className="text-[#870012]" /> Kapan jalannya?
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#f6faff] border-2 border-[#eef2f6] rounded-2xl py-4 px-6 text-[17px] font-black text-[#141d23] outline-none focus:border-[#870012] focus:bg-white transition-all cursor-pointer group-hover:border-[#bdc7d1]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full xl:w-auto xl:min-w-[180px]">
              <Button
                onClick={handleSearch}
                disabled={!departure || !arrival || !date || isLoading}
                className="w-full !py-[22px] !rounded-2xl shadow-xl shadow-[#870012]/30 hover:shadow-2xl hover:shadow-[#870012]/40 transition-all font-hanken font-black tracking-widest text-lg"
                variant="primary"
                leftIcon={<Search size={24} />}
              >
                GAS CARI!
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Feature Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverable className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#fbeaea] rounded-2xl flex items-center justify-center text-[#870012] mb-6">
              <Zap size={32} />
            </div>
            <h3 className="font-hanken text-2xl font-black mb-4">Sat-Set & Efisien</h3>
            <p className="font-inter text-[#5c403e] leading-relaxed">
              Nggak pake lama, Jakarta - Bandung cuma itungan menit. Sat-set banget buat mobilitas kamu.
            </p>
          </Card>
          
          <Card hoverable className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-hanken text-2xl font-black mb-4">Tetep Aman & Nyaman</h3>
            <p className="font-inter text-[#5c403e] leading-relaxed">
              Sistem aman pol pake teknologi canggih. Perjalanan kamu dijamin aman dan tenang.
            </p>
          </Card>

          <Card hoverable className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <Navigation size={32} />
            </div>
            <h3 className="font-hanken text-2xl font-black mb-4">Nyampe Pusat Kota</h3>
            <p className="font-inter text-[#5c403e] leading-relaxed">
              Gampang banget nuju pusat kota Bandung. Ada KA Feeder yang udah siap nungguin kamu.
            </p>
          </Card>
        </div>
      </section>

      {/* Info Sections Grid */}
      <section className="container mx-auto px-6 mb-24 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card noPadding className="p-10 border-none bg-gradient-to-r from-[#870012] to-[#B31A21] flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
                <Info size={40} />
              </div>
              <div>
                <h3 className="font-hanken text-2xl font-black mb-2 leading-none">Info Terbaru Nih!</h3>
                <p className="font-inter text-red-100 opacity-90 max-w-md">Ada update soal syarat perjalanan pas musim liburan, cek yuk!</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white border-none text-[#870012] hover:bg-red-50 text-[14px]">
              LIHAT DETAILNYA
            </Button>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card hoverable className="p-8 group shadow-sm hover:translate-y-[-5px]">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-[#f6faff] rounded-2xl flex items-center justify-center text-[#870012] transition-colors group-hover:bg-[#870012] group-hover:text-white">
                  <Train size={30} />
                </div>
                <ChevronRight size={24} className="text-[#bdc7d1] group-hover:translate-x-2 transition-transform" />
              </div>
              <h4 className="font-hanken text-xl font-black mb-2 text-[#141d23]">Bawa Barang? Cek Aturannya</h4>
              <p className="font-inter text-[#5c403e] text-[15px]">Cek panduan lengkap soal berat dan ukuran barang bawaan kamu di sini.</p>
            </Card>

            <Card hoverable className="p-8 group shadow-sm hover:translate-y-[-5px]">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                  <Bell size={30} />
                </div>
                <ChevronRight size={24} className="text-[#bdc7d1] group-hover:translate-x-2 transition-transform" />
              </div>
              <h4 className="font-hanken text-xl font-black mb-2 text-[#141d23]">Jangan Sampe Ketinggalan</h4>
              <p className="font-inter text-[#5c403e] text-[15px]">Daftar email kamu biar dapet kabar kalo ada jadwal yang telat atau gangguan.</p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card noPadding className="h-full bg-[#141d23] text-white p-12 overflow-hidden relative border-none">
            {/* Shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#870012]/40 rounded-full translate-x-12 -translate-y-12 blur-3xl" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-red-500 mb-8 border border-white/5">
                  Whoosh App
                </div>
                <h2 className="font-hanken text-[38px] font-black leading-[1.1] mb-8 tracking-tighter">
                  Pesen Tiket? Di App<br />Aja, Lebih Praktis!
                </h2>
                <p className="font-inter text-[#bdc7d1] text-lg leading-relaxed mb-12 opacity-80">
                  Dapetin promo eksklusif dan akses profil Sat-Set cuma lewat HP kamu.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center gap-4 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all group">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Smartphone size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-[#bdc7d1] font-bold uppercase leading-none mb-1">Get it on</p>
                      <p className="font-hanken font-bold text-lg leading-none">Play Store</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-4 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all group">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Smartphone size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-[#bdc7d1] font-bold uppercase leading-none mb-1">Download on</p>
                      <p className="font-hanken font-bold text-lg leading-none">App Store</p>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="mt-12">
                <img 
                  src="https://images.unsplash.com/photo-1556656793-062ff9878273?auto=format&fit=crop&q=80&w=400" 
                  alt="App Preview" 
                  className="w-full h-40 object-cover rounded-2xl opacity-40 hover:opacity-100 transition-opacity duration-700" 
                />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
