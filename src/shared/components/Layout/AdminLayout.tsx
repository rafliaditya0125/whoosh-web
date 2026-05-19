import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Train, MapPin, Calendar, Ticket, 
  LogOut, Bell, Search, LayoutDashboard, 
  Menu, Undo2
} from 'lucide-react';
import useAuthStore from '@/features/auth/stores/authStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Kelola Pengguna', icon: Users },
    { path: '/admin/stations', label: 'Data Stasiun', icon: MapPin },
    { path: '/admin/trains', label: 'Data Kereta', icon: Train },
    { path: '/admin/schedules', label: 'Jadwal Kereta', icon: Calendar },
    { path: '/admin/bookings', label: 'Tiket & Pesanan', icon: Ticket },
    { path: '/admin/refunds', label: 'Refund & Batal', icon: Undo2 },
  ];

  return (
    <div className="min-h-screen bg-[#f6faff] flex">
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 bottom-0 z-50 bg-[#141d23] text-white transition-all duration-300
          ${isSidebarOpen ? 'w-80' : 'w-24'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-[#870012] rounded-2xl flex items-center justify-center font-hanken font-bold text-2xl shadow-lg shadow-[#870012]/20">
              W
            </div>
            {isSidebarOpen && (
              <div className="animate-fadeIn">
                <span className="font-hanken text-2xl font-black tracking-tight block leading-none">Whoosh</span>
                <span className="text-[10px] font-bold text-[#870012] uppercase tracking-[0.2em] mt-1 block">Control Center</span>
              </div>
            )}
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all group
                  ${active 
                    ? 'bg-[#870012] text-white shadow-xl shadow-[#870012]/30' 
                    : 'text-[#8c9aaf] hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={24} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                {isSidebarOpen && (
                  <span className="font-inter font-bold text-[15px] animate-fadeIn">{item.label}</span>
                )}
                {!isSidebarOpen && active && (
                  <div className="absolute left-24 bg-[#870012] px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-4 p-4 rounded-2xl transition-all
              bg-white/5 text-[#8c9aaf] hover:bg-[#ba1a1a] hover:text-white group
            `}
          >
            <LogOut size={24} />
            {isSidebarOpen && <span className="font-bold text-[15px]">Keluar Panel</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-24'}`}>
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#e5bdba] flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#f6faff] text-[#141d23] hover:bg-[#870012] hover:text-white transition-all shadow-sm"
            >
              <Menu size={24} />
            </button>
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bdc7d1]" size={18} />
              <input 
                type="text" 
                placeholder="Cari menu atau data..." 
                className="bg-[#f6faff] border border-[#e5bdba] rounded-xl py-3 pl-12 pr-6 outline-none focus:border-[#870012] focus:ring-4 focus:ring-[#870012]/10 transition-all w-80 font-inter text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[#f6faff] text-[#141d23] hover:bg-gray-100 transition-all">
              <Bell size={24} />
              <span className="absolute top-3 right-3 w-3 h-3 bg-[#ba1a1a] border-2 border-white rounded-full"></span>
            </button>

            <div className="h-12 w-px bg-[#e5bdba]" />

            <div className="flex items-center gap-4 pl-2">
              <div className="text-right">
                <p className="font-inter font-black text-[#141d23] text-sm leading-none mb-1">{user?.full_name}</p>
                <p className="font-hanken font-bold text-[#870012] text-[10px] uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#141d23] flex items-center justify-center text-white font-black overflow-hidden shadow-lg border-2 border-[#870012]/20">
                {user?.full_name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 pb-12 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
