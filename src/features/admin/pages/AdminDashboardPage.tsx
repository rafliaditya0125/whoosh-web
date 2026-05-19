import React from 'react';
import { 
  Users, Train, Calendar, FileText, ArrowUpRight, 
  ArrowDownRight, MoreVertical, MapPin, Ticket, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminUsers } from '../hooks/useAdmin';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';

export default function AdminDashboardPage() {
  const { data: usersData } = useAdminUsers({ limit: 1 });

  const stats = [
    { label: 'Total Pengguna', value: usersData?.pagination.total ?? '—', trend: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Kereta Aktif', value: '12', trend: 'Stabil', icon: Train, color: 'text-[#870012]', bg: 'bg-[#fbeaea]' },
    { label: 'Jadwal Hari Ini', value: '48', trend: '+4', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Permintaan Refund', value: '3', trend: '-2', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[36px] font-black text-[#141d23] mb-2 tracking-tight">Main Dashboard</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Selamat datang kembali! Berikut ringkasan operasional Whoosh hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" dot className="bg-white border-[#00874e]/20 text-[11px] py-1.5 px-4 font-black">Sistem Normal</Badge>
          <div className="text-[12px] font-bold text-[#8c9aaf] uppercase tracking-widest whitespace-nowrap">
            Last Update: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} hoverable className="relative overflow-hidden group border-none shadow-xl shadow-[#141d23]/5">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-30 rounded-bl-[4rem] -translate-y-2 translate-x-2 transition-transform group-hover:scale-110`} />
            
            <div className="relative z-10">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6 shadow-sm`}>
                <stat.icon size={24} />
              </div>
              
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[12px] font-black text-[#8c9aaf] uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="font-hanken text-4xl font-black text-[#141d23]">{stat.value}</p>
                </div>
                <div className={`flex items-center gap-1 text-[13px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-amber-500'}`}>
                  {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : stat.trend.startsWith('-') ? <ArrowDownRight size={14} /> : null}
                  {stat.trend}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions / Recent Activity Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <Card className="border-none shadow-xl shadow-[#141d23]/5 flex-grow">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-hanken text-2xl font-black text-[#141d23]">Aktivitas Operasional</h3>
              <button className="text-[#8c9aaf] hover:text-[#870012] transition-colors"><MoreVertical size={20} /></button>
            </div>

            <div className="space-y-6">
              {[
                { time: '10:45', action: 'Update Jadwal', detail: 'Perubahan keberangkatan KA G1234 di Stasiun Halim', icon: Calendar, user: 'Admin Jkt' },
                { time: '10:30', action: 'Validasi Refund', detail: 'Pengembalian dana untuk pesanan #TRX-9921 disetujui', icon: FileText, user: 'Finance' },
                { time: '09:12', action: 'Sistem Alert', detail: 'Integrasi KA Feeder Bandung terhubung dengan jadwal Whoosh G002', icon: Zap, user: 'System' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-6 p-6 rounded-2xl bg-[#f6faff] border border-[#eef2f6] group hover:border-[#870012]/30 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#eef2f6] flex items-center justify-center text-[#141d23] group-hover:text-[#870012] transition-colors">
                    <activity.icon size={22} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-hanken font-bold text-[#141d23]">{activity.action}</span>
                      <span className="font-inter font-bold text-[11px] text-[#8c9aaf]">{activity.time}</span>
                    </div>
                    <p className="font-inter text-sm text-[#5c6a7e] mb-2">{activity.detail}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#141d23]/10" />
                      <span className="text-[11px] font-bold text-[#8c9aaf] uppercase tracking-widest">{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Mini Section */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <Card className="bg-[#141d23] text-white border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#870012]/20 rounded-full translate-x-12 -translate-y-12 blur-3xl opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck size={32} className="text-[#870012]" />
                <h3 className="font-hanken text-xl font-black">Security Center</h3>
              </div>
              
              <p className="font-inter text-[#8c9aaf] text-sm leading-relaxed mb-8">
                Pantau login mencurigakan dan autentikasi admin di seluruh platform.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm py-3 border-b border-white/5">
                  <span className="text-white/60 font-medium">Session Aktif</span>
                  <span className="font-black">12 Admin</span>
                </div>
                <div className="flex items-center justify-between text-sm py-3 border-b border-white/5">
                  <span className="text-white/60 font-medium">Login Terakhir</span>
                  <span className="font-black">2 Menit Lalu</span>
                </div>
              </div>
              
              <button className="w-full py-4 bg-white/5 hover:bg-[#870012] border border-white/10 rounded-xl font-inter font-black text-[12px] tracking-widest transition-all">
                Audit Log Lengkap
              </button>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-[#141d23]/5 bg-gradient-to-br from-white to-[#f6faff]">
            <h3 className="font-hanken text-lg font-black text-[#141d23] mb-6">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add User', icon: Users, path: '/admin/users' },
                { label: 'Add Station', icon: MapPin, path: '/admin/stations' },
                { label: 'Schedule', icon: Calendar, path: '/admin/schedules' },
                { label: 'Reports', icon: FileText, path: '/admin/refunds' },
              ].map((link, i) => (
                <Link 
                  key={i} 
                  to={link.path}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-[#eef2f6] hover:border-[#870012] hover:shadow-lg transition-all group"
                >
                  <div className="w-10 h-10 bg-[#f6faff] rounded-xl flex items-center justify-center text-[#141d23] group-hover:bg-[#870012] group-hover:text-white transition-all">
                    <link.icon size={20} />
                  </div>
                  <span className="text-[11px] font-black text-[#5c6a7e] uppercase group-hover:text-[#141d23] tracking-tighter text-center">{link.label}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
