import React, { useState, useEffect } from 'react';
import Modal from '@/shared/components/Modal';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import passengerService from '@/features/booking/services/passengerService';
import { toast } from 'react-hot-toast';
import type { SavedPassenger } from '@/types';
import { Trash2, UserPlus, Fingerprint, User } from 'lucide-react';
import Spinner from '@/shared/components/Spinner';

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PassengerModal({ isOpen, onClose }: PassengerModalProps) {
  const [passengers, setPassengers] = useState<SavedPassenger[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', id_number: '' });

  const fetchPassengers = async () => {
    setLoading(true);
    try {
      const data = await passengerService.getAll();
      setPassengers(data);
    } catch (error) {
      toast.error('Gagal mengambil daftar penumpang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPassengers();
    }
  }, [isOpen]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await passengerService.save(formData);
      toast.success('Penumpang berhasil ditambahkan');
      setFormData({ full_name: '', id_number: '' });
      setIsAdding(false);
      fetchPassengers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan penumpang');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus penumpang ini?')) return;
    try {
      await passengerService.delete(id);
      toast.success('Penumpang berhasil dihapus');
      fetchPassengers();
    } catch (error) {
      toast.error('Gagal menghapus penumpang');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isAdding ? "Tambah Penumpang" : "Penumpang Terdaftar"}
      size="lg"
    >
      <div className="space-y-6">
        {isAdding ? (
          <form onSubmit={handleAdd} className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#141d23] uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-[#870012]" /> Nama Lengkap
                </label>
                <Input 
                  value={formData.full_name} 
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
                  placeholder="Sesuai KTP/Paspor"
                  required
                  className="!rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#141d23] uppercase tracking-widest flex items-center gap-2">
                    <Fingerprint size={14} className="text-[#870012]" /> Nomor Identitas (NIK/Paspor)
                </label>
                <Input 
                  value={formData.id_number} 
                  onChange={(e) => setFormData({ ...formData, id_number: e.target.value })} 
                  placeholder="Masukkan nomor identitas"
                  required
                  className="!rounded-2xl"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="flex-1 h-14 !rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                isLoading={loading}
                className="flex-1 h-14 !rounded-2xl bg-[#870012] hover:bg-[#ba1a1a] font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100"
              >
                Simpan
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#f6faff] p-6 rounded-3xl border border-[#eef2f6]">
                <div>
                    <h4 className="font-hanken font-black text-[#141d23] text-lg leading-tight">Daftar Penumpang</h4>
                    <p className="text-[12px] font-medium text-[#8c9aaf] uppercase tracking-widest">Total {passengers.length} Penumpang</p>
                </div>
                <Button 
                    onClick={() => setIsAdding(true)}
                    className="!rounded-2xl bg-[#141d23] hover:bg-[#252f38] group flex items-center gap-2 px-6"
                >
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Tambah Baru</span>
                </Button>
            </div>

            <div className="grid gap-4">
              {loading && !passengers.length ? (
                <div className="py-20 flex justify-center">
                    <Spinner size="lg" />
                </div>
              ) : passengers.length === 0 ? (
                <div className="text-center py-20 bg-[#fcfdfe] rounded-[2.5rem] border-2 border-dashed border-[#eef2f6]">
                  <div className="w-16 h-16 bg-[#f6faff] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-[#bdc7d1]" />
                  </div>
                  <p className="text-[#8c9aaf] font-black uppercase tracking-widest text-[12px]">Belum ada penumpang terdaftar</p>
                </div>
              ) : (
                passengers.map((p) => (
                  <div 
                    key={p.id} 
                    className="flex items-center justify-between p-6 bg-white border border-[#f6faff] rounded-[2rem] hover:shadow-xl hover:shadow-[#141d23]/5 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#f6faff] rounded-2xl flex items-center justify-center text-[#870012] group-hover:bg-[#870012] group-hover:text-white transition-all">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-black text-[#141d23] text-lg uppercase tracking-tight leading-none mb-2">{p.full_name}</p>
                        <div className="flex items-center gap-2 text-[#8c9aaf]">
                            <Fingerprint size={14} />
                            <p className="text-[13px] font-medium tracking-wider">{p.id_number}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white transition-all transform hover:scale-110 active:scale-95"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
