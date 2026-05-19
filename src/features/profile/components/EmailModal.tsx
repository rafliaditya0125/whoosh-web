import React, { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import profileService from '../services/profileService';
import useAuthStore from '@/features/auth/stores/authStore';
import { toast } from 'react-hot-toast';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const { user, setUser } = useAuthStore();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await profileService.update({ email });
      setUser(updatedUser);
      toast.success('Email berhasil diperbarui');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ganti Email">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[14px] font-black text-[#141d23] uppercase tracking-widest">
            Email Baru
          </label>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Masukkan email baru"
            required
            className="!rounded-2xl"
          />
          <p className="text-[12px] font-medium text-[#8c9aaf]">
            Kami akan mengirimkan notifikasi penting ke email ini.
          </p>
        </div>

        <Button 
          type="submit" 
          isLoading={loading}
          className="w-full h-16 !rounded-2xl bg-[#870012] hover:bg-[#ba1a1a] font-black uppercase tracking-widest text-sm"
        >
          Simpan Perubahan
        </Button>
      </form>
    </Modal>
  );
}
