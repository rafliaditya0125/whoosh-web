import { useState } from 'react';
import { Download, Calendar, Filter, FileSpreadsheet, FileText, ArrowRight, TrendingUp } from 'lucide-react';
import { useSalesReport } from '../hooks/useManager';
import reportService from '../services/reportService';
import Button from '@/shared/components/Button';
import Table from '@/shared/components/Table';
import Badge from '@/shared/components/Badge';
import Card from '@/shared/components/Card';
import Pagination from '@/shared/components/Pagination';
import type { SalesReportItem } from '@/types';

const CLASS_LABELS: Record<string, string> = { economy: 'Ekonomi', business: 'Bisnis', vip: 'VIP' };

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function SalesReportPage() {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = today.slice(0, 8) + '01';

  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState(today);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSalesReport({ date_from: dateFrom, date_to: dateTo, page });
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const handleExport = (format: 'csv' | 'xlsx') => {
    const url = reportService.exportReport({ date_from: dateFrom, date_to: dateTo, format });
    window.open(url, '_blank');
  };

  const columns = [
    {
      header: 'Periode & Rute',
      accessor: (item: SalesReportItem) => (
        <div className="space-y-1">
          <p className="font-inter font-black text-[#141d23] text-[13px]">{item.date}</p>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#8c9aaf] uppercase tracking-widest">
            {item.route}
          </div>
        </div>
      ),
    },
    {
      header: 'Unit Kereta',
      accessor: (item: SalesReportItem) => (
        <div className="font-hanken font-bold text-[#5c6a7e]">{item.train_name}</div>
      ),
    },
    {
      header: 'Klasifikasi',
      accessor: (item: SalesReportItem) => (
        <Badge variant={item.class === 'vip' ? 'danger' : item.class === 'business' ? 'info' : 'neutral'}>
          {CLASS_LABELS[item.class]}
        </Badge>
      ),
    },
    {
      header: 'Volume Penjualan',
      accessor: (item: SalesReportItem) => (
        <div className="font-black text-[#141d23]">{item.tickets_sold} <span className="text-[10px] text-[#8c9aaf]">TIKET</span></div>
      ),
    },
    {
      header: 'Revenue',
      accessor: (item: SalesReportItem) => (
        <div className="font-black text-[#00874e]">{formatPrice(item.revenue)}</div>
      ),
    },
    {
      header: 'Okupansi',
      accessor: (item: SalesReportItem) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${item.occupancy_rate > 80 ? 'bg-green-500' : 'bg-blue-500'} transition-all`} 
              style={{ width: `${item.occupancy_rate}%` }}
            />
          </div>
          <span className="text-[12px] font-black text-[#141d23]">{item.occupancy_rate.toFixed(1)}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[36px] font-black text-[#141d23] tracking-tight leading-none mb-2">Laporan Penjualan</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Rekapitulasi pendapatan dan statistik okupansi armada Whoosh.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            leftIcon={<FileText size={18} />} 
            onClick={() => handleExport('csv')}
            className="border-[#eef2f6] shadow-sm font-black text-[11px] tracking-widest"
          >
            EKSPOR CSV
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<FileSpreadsheet size={18} />} 
            onClick={() => handleExport('xlsx')}
            className="shadow-lg shadow-[#870012]/10 font-black text-[11px] tracking-widest"
          >
            EKSPOR EXCEL
          </Button>
        </div>
      </div>

      <Card noPadding className="p-8 border-none shadow-xl shadow-[#141d23]/5">
        <div className="flex flex-col lg:flex-row items-end gap-6">
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} className="text-[#870012]" /> Range Mulai
              </label>
              <input
                type="date"
                value={dateFrom}
                max={dateTo}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="w-full h-12 bg-[#f6faff] border-2 border-[#eef2f6] rounded-xl px-4 outline-none focus:border-[#870012] focus:bg-white transition-all font-inter font-bold text-sm text-[#141d23]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#8c9aaf] uppercase tracking-widest ml-1 flex items-center gap-2">
                <ArrowRight size={12} className="text-[#870012]" /> Range Berakhir
              </label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="w-full h-12 bg-[#f6faff] border-2 border-[#eef2f6] rounded-xl px-4 outline-none focus:border-[#870012] focus:bg-white transition-all font-inter font-bold text-sm text-[#141d23]"
              />
            </div>
          </div>
          <div className="w-full lg:w-auto">
            <Button variant="outline" className="h-12 w-full lg:px-10 border-[#eef2f6] bg-white group">
              <Filter size={18} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
              SARING DATA
            </Button>
          </div>
        </div>
      </Card>

      <div className="lg:col-span-12">
        <Table
          columns={columns}
          data={items}
          isLoading={isLoading}
          emptyMessage="Tidak ada data penjualan untuk periode yang dipilih"
        />
        
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Card className="bg-[#141d23] text-white p-10 border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#870012]/10 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#870012] border border-white/10">
                <TrendingUp size={32} />
              </div>
              <div>
                <h4 className="font-hanken text-xl font-black mb-1">Rangkuman Performa</h4>
                <p className="text-white/60 text-sm font-medium">Laporan ini dihasilkan secara otomatis berdasarkan data transaksi yang tervalidasi.</p>
              </div>
           </div>
           <Badge variant="success" className="bg-green-500/10 text-green-400 border-green-500/20 px-6 py-2 tracking-[0.2em] font-black uppercase">
             Data Real-Time
           </Badge>
        </div>
      </Card>
    </div>
  );
}
