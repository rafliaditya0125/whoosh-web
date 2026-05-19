import React, { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import profileService from '../services/profileService';
import { toast } from 'react-hot-toast';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setLoading(true);
    try {
      await profileService.changePassword({
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
      });
      toast.success('Kata sandi berhasil diperbarui');
      onClose();
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui kata sandi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ganti Kata Sandi">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[14px] font-black text-[#141d23] uppercase tracking-widest">
              Kata Sandi Lama
            </label>
            <Input 
              type="password" 
              value={formData.oldPassword} 
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} 
              placeholder="Masukkan kata sandi saat ini"
              required
              className="!rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-black text-[#141d23] uppercase tracking-widest">
              Kata Sandi Baru
            </label>
            <Input 
              type="password" 
              value={formData.newPassword} 
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} 
              placeholder="Masukkan kata sandi baru"
              required
              className="!rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-black text-[#141d23] uppercase tracking-widest">
              Konfirmasi Kata Sandi Baru
            </label>
            <Input 
              type="password" 
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
              placeholder="Ulangi kata sandi baru"
              required
              className="!rounded-2xl"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          isLoading={loading}
          className="w-full h-16 !rounded-2xl bg-[#870012] hover:bg-[#ba1a1a] font-black uppercase tracking-widest text-sm"
        >
          Perbarui Kata Sandi
        </Button>
      </form>
    </Modal>
  );
}
