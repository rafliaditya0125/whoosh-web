import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
  dot?: boolean;
}

export default function Badge({ children, variant = 'neutral', className = '', dot = false }: BadgeProps) {
  const variants = {
    success: 'bg-green-50 text-[#00874e] border-green-200',
    warning: 'bg-amber-50 text-[#876200] border-amber-200',
    danger: 'bg-red-50 text-[#ba1a1a] border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const dotColors = {
    success: 'bg-[#00874e]',
    warning: 'bg-[#876200]',
    danger: 'bg-[#ba1a1a]',
    info: 'bg-blue-600',
    neutral: 'bg-gray-500',
  };

  return (
    <div className={`
      inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold border uppercase tracking-wider
      ${variants[variant]}
      ${className}
    `}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dotColors[variant]} animate-pulse`} />}
      {children}
    </div>
  );
}
