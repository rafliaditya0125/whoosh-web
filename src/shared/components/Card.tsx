import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  noPadding?: boolean;
}

export default function Card({ children, className = '', onClick, hoverable = false, noPadding = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-[#e5bdba] overflow-hidden transition-all duration-300
        ${hoverable ? 'hover:shadow-xl hover:shadow-[#141d23]/5 hover:border-[#870012] cursor-pointer active:scale-[0.99]' : ''}
        ${noPadding ? '' : 'p-6 md:p-8'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
