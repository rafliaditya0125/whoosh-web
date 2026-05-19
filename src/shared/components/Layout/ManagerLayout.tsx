import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LineChart, FileText, 
  LogOut, Bell, Menu, LayoutDashboard, Monitor
} from 'lucide-react';
import useAuthStore from '@/features/auth/stores/authStore';

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/manager', label: 'Monitor Dashboard', icon: LayoutDashboard },
    { path: '/manager/sales', label: 'Laporan Penjualan', icon: LineChart },
    { path: '/manager/transactions', label: 'Data Transaksi', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Sidebar - More sleek for manager */}
      <aside 
        className={`
          fixed left-0 top-0 bottom-0 z-50 bg-[#0f172a] text-white transition-all duration-500
          ${isSidebarOpen ? 'w-80' : 'w-24'}
        `}
      >
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">
              M
            </div>
            {isSidebarOpen && (
              <div className="animate-fadeIn">
                <span className="font-hanken text-xl font-black tracking-tight block">Whoosh Insights</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block font-mono">Manager Panel</span>
              </div>
            )}
          </div>
        </div>

        <nav className="p-6 space-y-3 mt-6">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all relative
                  ${active 
                    ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                {active && <div className="absolute left-0 w-1.5 h-8 bg-blue-500 rounded-r-full" />}
                <item.icon size={22} />
                {isSidebarOpen && <span className="font-inter text-[15px]">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-10 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">Keluar</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-grow transition-all duration-500 ${isSidebarOpen ? 'ml-80' : 'ml-24'}`}>
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between px-10">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-hanken text-[22px] font-black text-slate-800">
              {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-slate-100 rounded-full text-slate-500 font-inter text-sm">
              <Monitor size={16} />
              <span>Sistem Normal</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
              <Bell size={22} />
            </button>

            <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
              <div className="text-right">
                <p className="font-inter font-black text-slate-800 text-sm leading-none mb-1">{user?.full_name}</p>
                <p className="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-widest">Revenue Manager</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-black border-4 border-white shadow-xl">
                {user?.full_name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
