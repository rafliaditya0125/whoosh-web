import { useState } from 'react';
import { Search, ShieldOff, ShieldCheck, Edit2, Users, Mail, Phone, Filter } from 'lucide-react';
import { useAdminUsers, useSetUserStatus, useUpdateUser } from '../hooks/useAdmin';
import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import Table from '@/shared/components/Table';
import Badge from '@/shared/components/Badge';
import Modal from '@/shared/components/Modal';
import Select from '@/shared/components/Select';
import Pagination from '@/shared/components/Pagination';
import type { User, UserRole } from '@/types';

const ROLE_LABELS: Record<UserRole, string> = { user: 'Pengguna', manager: 'Manajer', admin: 'Admin' };

export default function ManageUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('user');

  const { data, isLoading } = useAdminUsers({ search, page, limit: 20 });
  const { mutate: setStatus, isPending: settingStatus } = useSetUserStatus();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();

  const users = data?.items ?? [];
  const pagination = data?.pagination;

  const handleEditSave = () => {
    if (!editUser) return;
    updateUser({ id: editUser.user_id, role: editRole });
    setEditUser(null);
  };

  const columns = [
    {
      header: 'Identitas Pengguna',
      accessor: (u: User) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#f6faff] flex items-center justify-center text-[#141d23] font-black border border-[#eef2f6]">
            {u.full_name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-[#141d23] leading-none mb-1">{u.full_name}</p>
            <p className="text-[12px] text-[#8c9aaf] font-medium">{u.user_id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Kontak',
      accessor: (u: User) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#5c6a7e] text-[13px]">
            <Mail size={12} /> {u.email}
          </div>
          <div className="flex items-center gap-2 text-[#5c6a7e] text-[13px]">
            <Phone size={12} /> {u.phone}
          </div>
        </div>
      ),
    },
    {
      header: 'Role / Peran',
      accessor: (u: User) => (
        <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'manager' ? 'info' : 'neutral'}>
          {ROLE_LABELS[u.role]}
        </Badge>
      ),
    },
    {
      header: 'Status Akun',
      accessor: (u: User) => (
        <Badge variant={u.is_active !== false ? 'success' : 'danger'} dot>
          {u.is_active !== false ? 'Aktif' : 'Diblokir'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      accessor: (u: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditUser(u); setEditRole(u.role); }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5bdba] text-[#5c6a7e] hover:border-[#870012] hover:text-[#870012] transition-all"
            title="Edit peran"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setStatus({ id: u.user_id, isActive: u.is_active === false })}
            disabled={settingStatus}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
              u.is_active !== false 
                ? 'bg-red-50 border-red-100 text-[#ba1a1a] hover:bg-red-100' 
                : 'bg-green-50 border-green-100 text-[#00874e] hover:bg-green-100'
            }`}
            title={u.is_active !== false ? 'Blokir akun' : 'Aktifkan akun'}
          >
            {u.is_active !== false ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-hanken text-[32px] font-black text-[#141d23] mb-1 tracking-tight">Manajemen Pengguna</h1>
          <p className="font-inter text-[#5c6a7e] font-medium">Kelola hak akses dan status akun pengguna Whoosh.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-5 py-2.5 rounded-xl border border-[#e5bdba] flex items-center gap-3 text-sm font-bold text-[#141d23]">
            <Users size={18} className="text-[#870012]" />
            {pagination?.total ?? 0} Total Pengguna
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              placeholder="Cari berdasarkan nama, email, atau ID..."
              leftIcon={<Search size={18} />}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              fullWidth
              className="!mb-0"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter size={18} />} className="whitespace-nowrap">
            Filter Lanjutan
          </Button>
        </div>

        <div className="lg:col-span-12">
          <Table
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="Tidak ada pengguna yang ditemukan"
          />
          
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Ubah Peran Pengguna"
        footer={
          <div className="flex gap-4">
            <Button variant="ghost" fullWidth onClick={() => setEditUser(null)}>BATAL</Button>
            <Button fullWidth onClick={handleEditSave} isLoading={updating}>SIMPAN PERUBAHAN</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-6 bg-[#f6faff] rounded-2xl border border-[#eef2f6] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-[#870012] border border-[#eef2f6]">
              {editUser?.full_name.charAt(0)}
            </div>
            <div>
              <p className="font-hanken font-black text-[#141d23] text-lg">{editUser?.full_name}</p>
              <p className="font-inter text-[#5c6a7e] text-sm">{editUser?.email}</p>
            </div>
          </div>

          <Select
            label="Pilih Peran Baru"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as UserRole)}
            options={(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            fullWidth
          />
          
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
            <div className="text-amber-600 mt-0.5">⚠️</div>
            <p className="text-[12px] font-medium text-amber-800 leading-relaxed">
              Perubahan peran akan memberikan hak akses berbeda kepada pengguna. Pastikan Anda memberikan akses yang sesuai dengan tanggung jawab pengguna tersebut.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
