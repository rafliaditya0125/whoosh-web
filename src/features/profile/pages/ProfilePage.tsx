import { useState, useEffect } from 'react';
import { useLogout } from '@/features/auth/hooks/useAuth';
import useAuthStore from '@/features/auth/stores/authStore';
import {
  Users, Globe, Lock, Mail, Bell, MessageCircle,
  ChevronRight, LogOut, Volume2, BookOpen, Info,
  Settings, ShieldCheck, HelpCircle, User, CreditCard as CardIcon
} from 'lucide-react';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import EmailModal from '../components/EmailModal';
import PasswordModal from '../components/PasswordModal';
import PassengerModal from '../components/PassengerModal';
import profileService from '../services/profileService';

const COMMON_FUNCTIONS = [
  { id: 'passengers', icon: Users, label: 'Penumpang Terdaftar', color: 'bg-[#fbeaea] text-[#870012]' },
  { id: 'payment', icon: CardIcon, label: 'Metode Pembayaran', color: 'bg-blue-50 text-blue-600' },
  { id: 'promo', icon: Bell, label: 'Notifikasi & Promo', color: 'bg-amber-50 text-amber-600' },
  { id: 'whatsapp', icon: MessageCircle, label: 'Bantuan WhatsApp', color: 'bg-green-50 text-green-600' },
];

const ACCOUNT_SETTINGS = [
  { id: 'email', icon: Mail, label: 'E-mail', detail: 'Email utama akun' },
  { id: 'password', icon: Lock, label: 'Ganti Kata Sandi', detail: 'Update keamanan akun' },
  { id: 'language', icon: Globe, label: 'Bahasa', detail: 'Indonesia (ID)' },
  { id: 'security', icon: ShieldCheck, label: 'Keamanan Akun', detail: 'Verifikasi dua langkah' },
];

const SERVICE_INFO = [
  { icon: Volume2, label: 'Pusat Pengumuman' },
  { icon: BookOpen, label: 'Aturan & Kebijakan' },
  { icon: HelpCircle, label: 'Pusat Bantuan' },
  { icon: Info, label: 'Versi Aplikasi', value: 'V2.0.1 PRO' },
];



export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const logout = useLogout();

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.get();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [setUser]);

  const handleActionClick = (id: string) => {
    if (id === 'passengers') setIsPassengerModalOpen(true);
    if (id === 'email') setIsEmailModalOpen(true);
    if (id === 'password') setIsPasswordModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f6faff] pb-24">
      {/* Premium Hero Header */}
      <div className="relative bg-[#141d23] pt-24 pb-48 px-6 overflow-hidden rounded-b-[4rem]">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#870012]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto max-w-5xl relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] bg-white p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
              <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-[#870012] to-[#B31A21] flex items-center justify-center border-4 border-[#fbeaea]">
                <User size={80} className="text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#00874e] rounded-2xl border-4 border-[#141d23] flex items-center justify-center shadow-xl">
              <ShieldCheck size={24} className="text-white" />
            </div>
          </div>

          {/* User Meta */}
          <div className="text-center md:text-left flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="font-hanken text-white text-[48px] font-black tracking-tighter leading-none">
                {user?.full_name ?? 'Guest User'}
              </h1>
              <Badge variant="success" className="bg-white/10 text-white border-white/20 px-4 py-1">VERIFIED</Badge>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-5 py-2 bg-white/5 backdrop-blur-md rounded-xl text-white/80 text-[13px] font-bold uppercase tracking-widest border border-white/10 uppercase">
                Bergabung {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Error'}
              </div>
            </div>
          </div>

          <button className="w-16 h-16 bg-white/10 hover:bg-white text-white hover:text-[#870012] flex items-center justify-center rounded-2xl border border-white/10 transition-all group backdrop-blur-md">
            <Settings size={28} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto max-w-5xl -mt-24 px-6 relative z-20 space-y-10">

        {/* Quick Actions Grid */}
        <Card noPadding className="p-10 border-none shadow-2xl shadow-[#141d23]/5 !rounded-[3rem]">
          <h3 className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-[0.25em] mb-10 px-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#870012]" />
            Akses Cepat Pengguna
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {COMMON_FUNCTIONS.map(({ id, icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => handleActionClick(id)}
                className="group flex flex-col items-center gap-5 p-6 rounded-[2.5rem] hover:bg-[#f6faff] transition-all border border-transparent hover:border-[#eef2f6]"
              >
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#141d23]/5 group-hover:-rotate-6 duration-500`}>
                  <Icon size={28} />
                </div>
                <span className="text-[14px] font-black text-[#141d23] text-center leading-tight tracking-tight uppercase">{label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Settings and Info Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card noPadding className="border-none shadow-xl shadow-[#141d23]/5 !rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-[#f6faff]">
              <h3 className="font-hanken text-[22px] font-black text-[#141d23] tracking-tight">Pengaturan Keamanan</h3>
            </div>
            <div className="p-4">
              {ACCOUNT_SETTINGS.map(({ id, icon: Icon, label, detail }) => (
                <button
                  key={label}
                  onClick={() => handleActionClick(id)}
                  className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-[#f6faff] transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#8c9aaf] group-hover:bg-[#870012] group-hover:text-white transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <div className="text-left">
                      <p className="text-[16px] font-black text-[#141d23] leading-none mb-1.5">{label}</p>
                      <p className="text-[12px] font-medium text-[#8c9aaf]">{detail}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[#bdc7d1] group-hover:text-[#870012] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </Card>

          <Card noPadding className="border-none shadow-xl shadow-[#141d23]/5 !rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-[#f6faff]">
              <h3 className="font-hanken text-[22px] font-black text-[#141d23] tracking-tight">Informasi Whoosh</h3>
            </div>
            <div className="p-4">
              {SERVICE_INFO.map(({ icon: Icon, label, value }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-[#f6faff] transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#8c9aaf] group-hover:bg-[#141d23] group-hover:text-white transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <span className="text-[16px] font-black text-[#141d23] leading-none">{label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {value && <span className="text-[10px] font-black text-[#8c9aaf] bg-[#f6faff] px-3 py-1 rounded-full border border-[#eef2f6] uppercase tracking-widest">{value}</span>}
                    <ChevronRight size={20} className="text-[#bdc7d1] group-hover:text-[#141d23] group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Global Action Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <Card className="bg-[#870012] text-white p-10 border-none shadow-2xl relative overflow-hidden group border-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h4 className="font-hanken text-2xl font-black mb-2">Pusat Bantuan</h4>
                <p className="text-red-100 font-medium text-sm opacity-80 mb-6">Butuh asistensi? Hubungi tim support kami 24/7.</p>
                <Button variant="outline" className="bg-white border-none text-[#870012] hover:bg-red-50 text-[12px] font-black">CHAT DENGAN AGENT</Button>
              </div>
              <HelpCircle size={80} className="text-white/10 absolute -right-4 -bottom-4 rotate-12" />
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <button
              onClick={logout}
              className="w-full h-full bg-white text-[#ba1a1a] font-hanken font-black text-[15px] p-8 rounded-[2.5rem] border-2 border-red-50 hover:bg-[#ba1a1a] hover:text-white transition-all shadow-xl shadow-red-100/30 active:scale-[0.98] flex items-center justify-center gap-4 group uppercase tracking-widest"
            >
              <LogOut size={24} className="group-hover:-translate-x-2 transition-transform" />
              Keluar dari Akun
            </button>
          </div>
        </div>

        <div className="text-center space-y-2 opacity-30 py-10">
          <p className="font-hanken font-bold text-[#141d23] text-lg uppercase tracking-[0.5em]">Whoosh Next-Gen</p>
          <p className="font-inter font-medium text-[#141d23] text-[10px] uppercase tracking-widest leading-none">Designed & Engineered for Future Mobility</p>
        </div>
      </div>

      {/* Modals */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <PassengerModal
        isOpen={isPassengerModalOpen}
        onClose={() => setIsPassengerModalOpen(false)}
      />
    </div>
  );
}
