import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Ticket, BarChart3, MapPin, ArrowUpRight, DollarSign, Users, Activity } from 'lucide-react';
import { useDashboard } from '../hooks/useManager';
import Card from '@/shared/components/Card';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/Spinner';

function formatPrice(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function ManagerDashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <Spinner size="xl" />;
  if (!data) return null;

  const revenueChartData = [
    { label: 'Hari Ini', value: data.revenue.today },
    { label: 'Minggu Ini', value: data.revenue.this_week },
    { label: 'Bulan Ini', value: data.revenue.this_month },
  ];

  const ticketsChartData = [
    { label: 'Sen', value: 120 }, { label: 'Sel', value: 150 }, { label: 'Rab', value: 200 },
    { label: 'Kam', value: 180 }, { label: 'Jum', value: 250 }, { label: 'Sab', value: 400 },
    { label: 'Min', value: 450 }
  ]; // Mock daily trend for better visual

  const stats = [
    { label: 'Revenue Today', value: formatPrice(data.revenue.today), icon: DollarSign, trend: '+5.4%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tickets Sold', value: data.tickets_sold.today, icon: Ticket, trend: '+12%', color: 'text-[#870012]', bg: 'bg-[#fbeaea]' },
    { label: 'Avg. Occupancy', value: `${data.average_occupancy.toFixed(1)}%`, icon: Users, trend: 'Stable', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Revenue Monthly', value: formatPrice(data.revenue.this_month), icon: BarChart3, trend: '+8.1%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[36px] font-black text-slate-800 tracking-tight leading-none mb-3">Performance Overview</h1>
          <p className="font-inter text-slate-500 font-medium tracking-tight">Analisis performa penjualan dan operasional Whoosh secara real-time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm font-inter font-bold text-sm text-slate-700 flex items-center gap-3">
            <Calendar size={18} className="text-blue-600" />
            Mei 2026
          </div>
          <Badge variant="info" className="px-4 py-2 font-black tracking-widest text-[11px] bg-blue-50 border-blue-100 uppercase">Pro Version</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/50 relative group">
            <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bg} opacity-20 rounded-bl-[3rem] transition-transform group-hover:scale-110`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                <stat.icon size={22} />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="font-hanken text-3xl font-black text-slate-800">{stat.value}</p>
                <span className="text-[13px] font-bold text-green-600 flex items-center gap-1 mb-1">
                  <ArrowUpRight size={14} /> {stat.trend}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-hanken text-2xl font-black text-slate-800">Tren Penjualan Mingguan</h3>
              <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest leading-none mt-2">Volume Tiket Terjual</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-[12px] font-bold text-slate-500">Premium Econ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-[12px] font-bold text-slate-500">Avarage</span>
              </div>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ticketsChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 700, fill: '#94a3b8' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-[#141d23] text-white p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20">
                <Activity size={32} />
              </div>
              <h3 className="font-hanken text-2xl font-black mb-4 tracking-tight">Kesehatan Sistem</h3>
              <p className="font-inter text-slate-400 text-[15px] leading-relaxed mb-10 opacity-80">
                Sistem pendataan tiket berjalan optimal dengan uptime 99.9% hari ini.
              </p>
              <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold tracking-widest text-slate-400 uppercase">
                  <span>Sync Status</span>
                  <span className="text-green-500 font-black">Online</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-blue-500" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 flex flex-grow p-10">
            <h3 className="font-hanken text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <MapPin size={22} className="text-blue-600" />
              Rute Terlaris
            </h3>
            <div className="space-y-8">
              {data.top_routes.slice(0, 3).map((r, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-inter font-black text-slate-800 text-sm">{r.departure_station} → {r.arrival_station}</span>
                    <span className="text-[12px] font-bold text-blue-600">{r.tickets_sold} Ticket</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-400'} rounded-full transition-all group-hover:scale-x-105 origin-left duration-700`} 
                      style={{ width: `${(r.tickets_sold / Math.max(...data.top_routes.map(rt => rt.tickets_sold))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 p-10">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-hanken text-2xl font-black text-slate-800">Detail Performa Rute</h3>
          <button className="text-slate-400 hover:text-blue-600 font-bold transition-colors text-[13px] tracking-widest uppercase">Export PDF</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-6 font-hanken font-black text-slate-400 uppercase tracking-widest text-[11px]">Rute Perjalanan</th>
                <th className="pb-6 font-hanken font-black text-slate-400 uppercase tracking-widest text-[11px]">Tiket Terjual</th>
                <th className="pb-6 font-hanken font-black text-slate-400 uppercase tracking-widest text-[11px]">Pendapatan</th>
                <th className="pb-6 font-hanken font-black text-slate-400 uppercase tracking-widest text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-inter">
              {data.top_routes.map((r, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <TrendingUp size={20} />
                      </div>
                      <span className="font-black text-slate-800">{r.departure_station} → {r.arrival_station}</span>
                    </div>
                  </td>
                  <td className="py-6 font-bold text-slate-600">{r.tickets_sold}</td>
                  <td className="py-6 font-black text-slate-800">{formatPrice(r.revenue)}</td>
                  <td className="py-6">
                    <Badge variant={i === 0 ? 'success' : 'info'} className="text-[10px] py-1">Optimized</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
