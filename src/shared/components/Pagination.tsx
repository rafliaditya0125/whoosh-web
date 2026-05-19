import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#e5bdba] text-[#141d23] hover:bg-[#870012] hover:text-white hover:border-[#870012] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`
              w-12 h-12 flex items-center justify-center rounded-xl font-hanken font-bold transition-all
              ${currentPage === p 
                ? 'bg-[#870012] text-white shadow-lg shadow-[#870012]/30 scale-110' 
                : 'border border-[#e5bdba] text-[#141d23] hover:bg-[#870012]/5 hover:border-[#870012] hover:text-[#870012]'}
            `}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#e5bdba] text-[#141d23] hover:bg-[#870012] hover:text-white hover:border-[#870012] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
