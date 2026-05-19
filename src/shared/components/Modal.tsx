import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#141d23]/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={`
        relative w-full ${sizes[size]} bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-full
        animate-slideInUp
      `}>
        {/* Header */}
        <div className="p-8 border-b border-[#f6faff] flex items-center justify-between">
          <h3 className="font-hanken text-[24px] font-black text-[#141d23]">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#5c6a7e]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto bg-white custom-scrollbar flex-grow">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-8 border-t border-[#f6faff] bg-[#fcfdfe]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
