import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function Table<T>({ columns, data, isLoading, onRowClick, emptyMessage = 'Data tidak ditemukan' }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#e5bdba] bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#f6faff]">
          <tr>
            {columns.map((col, i) => (
              <th 
                key={i} 
                className={`p-5 font-hanken text-[14px] font-black uppercase tracking-widest text-[#5c6a7e] border-b border-[#e5bdba] ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-inter">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="p-20 text-center">
                <div className="w-10 h-10 border-4 border-[#870012] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#8c9aaf] font-bold">Memuat data...</p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-20 text-center">
                <div className="w-20 h-20 bg-[#f6faff] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏜️</span>
                </div>
                <p className="text-[#1e2532] font-black text-lg mb-1">{emptyMessage}</p>
                <p className="text-[#8c9aaf] font-medium">Belum ada data untuk ditampilkan saat ini.</p>
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr 
                key={rowIdx} 
                onClick={() => onRowClick?.(item)}
                className={`
                  group transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-[#870012]/5' : 'hover:bg-[#f6faff]'}
                  ${rowIdx !== data.length - 1 ? 'border-b border-[#eef2f6]' : ''}
                `}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`p-5 text-[15px] text-[#141d23] font-medium ${col.className || ''}`}>
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
