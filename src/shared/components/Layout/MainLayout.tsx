import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Ticket, Home, UserCircle, Briefcase } from 'lucide-react';
import useAuthStore from '@/features/auth/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const logout = useLogout();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', path: '/', icon: Home },
    { label: 'Tiket Saya', path: '/tickets', icon: Ticket },
    { label: 'Profil', path: '/profile', icon: UserCircle },
  ];

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="min-h-screen bg-[#f6faff] flex flex-col">
      {/* Premium Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#870012] rounded-xl flex items-center justify-center shadow-lg shadow-[#870012]/20 group-active:scale-95 transition-transform">
              <span className="text-white font-hanken font-black text-xl">W</span>
            </div>
            <span className="font-hanken text-[24px] font-black tracking-tight text-[#141d23]">
              Whoosh
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-2 rounded-full font-inter text-[15px] font-semibold transition-all ${location.pathname === item.path
                    ? 'bg-[#870012] text-white shadow-lg shadow-[#870012]/30'
                    : 'text-[#5c403e] hover:bg-[#870012]/5 hover:text-[#870012]'
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {isAdminOrManager && (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/manager'}
                className="ml-2 px-6 py-2 rounded-full font-inter text-[15px] font-bold bg-[#141d23] text-white hover:bg-black transition-all flex items-center gap-2"
              >
                <Briefcase size={16} />
                Dashboard
              </Link>
            )}

            <div className="ml-6 pl-6 border-l border-[#e5bdba] flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-[#141d23] leading-none mb-1">{user.full_name}</p>
                    <p className="text-[12px] font-medium text-[#5c403e] uppercase tracking-wider">{user.role}</p>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="w-10 h-10 rounded-full bg-[#fbeaea] text-[#870012] flex items-center justify-center hover:bg-[#870012] hover:text-white transition-all shadow-sm"
                    title="Keluar"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-8 py-2.5 rounded-xl bg-[#870012] text-white font-hanken font-bold text-[15px] hover:bg-[#9d0015] transition-all shadow-xl shadow-[#870012]/20"
                >
                  MASUK YUK
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[#870012]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-[#fbeaea] animate-fadeIn">
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl font-inter font-bold ${location.pathname === item.path
                      ? 'bg-[#870012] text-white'
                      : 'text-[#5c403e] bg-[#f6faff]'
                    }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl font-inter font-bold text-[#ba1a1a] bg-red-50"
                >
                  <LogOut size={20} />
                  Keluar
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block text-center p-4 rounded-xl bg-[#870012] text-white font-hanken font-black tracking-widest"
                >
                  MASUK YUK
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-6 h-full">
          {children}
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-[#141d23] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#870012] rounded-2xl flex items-center justify-center font-hanken font-black text-2xl">W</div>
                <span className="font-hanken text-3xl font-black tracking-tight">Whoosh</span>
              </div>
              <p className="font-inter text-[#bdc7d1] text-[18px] leading-relaxed max-w-md">
                Solusi jalan-jalan yang sat-set, aman, dan nyaman banget buat masa depan kamu.
                Ngehubungin kota-kota penting cuma dalam hitungan menit.
              </p>
            </div>

            <div>
              <h4 className="font-hanken text-xl font-bold mb-8 text-[#870012] uppercase tracking-widest">Layanan</h4>
              <ul className="space-y-4 font-inter text-[#bdc7d1]">
                <li><Link to="/" className="hover:text-white transition-colors">Cari Tiket</Link></li>
                <li><Link to="/tickets" className="hover:text-white transition-colors">Tiket Saya</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Pusat Bantuan</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-hanken text-xl font-bold mb-8 text-[#870012] uppercase tracking-widest">Perusahaan</h4>
              <ul className="space-y-4 font-inter text-[#bdc7d1]">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[#bdc7d1] font-inter text-[14px]">
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Kontak</a>
              <a href="#" className="hover:text-white transition-colors">Bantuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
