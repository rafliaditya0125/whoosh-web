import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import { useRegister } from '../hooks/useAuth';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';

const schema = z.object({
  full_name: z.string().min(1, 'Nama lengkap wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  phone: z
    .string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(/^\+62[0-9]{9,13}$/, 'Nomor telepon harus diawali +62 (contoh: +628123456789)'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirm_password: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Password tidak cocok',
  path: ['confirm_password'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();

  const {
    register: rhfRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const values = watch();
  const allFilled = values.full_name && values.email && values.phone && values.password && values.confirm_password;

  const onSubmit = ({ confirm_password: _, ...data }: FormData) => {
    register(data);
  };

  return (
    <main className="min-h-screen bg-[#f6faff] flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 min-h-[800px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#870012] p-20 flex-col justify-between overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] border-[40px] border-white rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] border-[60px] border-white rounded-full animate-pulse delay-700" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-4 mb-20 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform">
                <span className="text-[#870012] font-hanken font-black text-2xl">W</span>
              </div>
              <span className="font-hanken text-white text-4xl font-black tracking-tight">Whoosh</span>
            </Link>

            <h2 className="font-hanken text-white text-[56px] font-black leading-[1.1] mb-8 tracking-tighter">
              Mulai Perjalanan<br />Modern Anda.
            </h2>
            <p className="font-inter text-red-100 text-xl leading-relaxed max-w-md opacity-90">
              Daftar sekarang dan nikmati kemudahan memesan tiket kereta cepat dalam satu genggaman.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            {[
              'Pemesanan Tiket Instan',
              'Pilih Kursi Favorit Anda',
              'Keamanan Transaksi Terjamin',
              'Update Jadwal Real-time'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="font-inter font-bold text-lg">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-12 lg:p-24 flex flex-col justify-center bg-white">
          <div className="max-w-xl mx-auto w-full">
            <div className="mb-12">
              <h1 className="font-hanken text-[40px] font-black text-[#141d23] mb-4">Buat Akun Baru</h1>
              <p className="font-inter text-[#5c403e] text-lg">Silakan lengkapi data diri Anda untuk mendaftar</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nama Lengkap"
                  placeholder="Nama sesuai KTP"
                  leftIcon={<User size={20} />}
                  error={errors.full_name?.message}
                  {...rhfRegister('full_name')}
                  fullWidth
                />
                <Input
                  label="Nomor Telepon"
                  placeholder="+628123456789"
                  leftIcon={<Phone size={20} />}
                  error={errors.phone?.message}
                  {...rhfRegister('phone')}
                  fullWidth
                />
              </div>

              <Input
                label="Alamat Email"
                type="email"
                placeholder="email@contoh.com"
                leftIcon={<Mail size={20} />}
                error={errors.email?.message}
                {...rhfRegister('email')}
                fullWidth
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Kata Sandi"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 karakter"
                  leftIcon={<Lock size={20} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#8c9aaf] hover:text-[#870012] transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...rhfRegister('password')}
                  fullWidth
                />
                <Input
                  label="Konfirmasi Sandi"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ulangi sandi"
                  leftIcon={<Lock size={20} />}
                  error={errors.confirm_password?.message}
                  {...rhfRegister('confirm_password')}
                  fullWidth
                />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={isPending}
                  disabled={!allFilled}
                >
                  DAFTAR SEKARANG
                </Button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-[#f6faff] text-center">
              <p className="font-inter text-[#5c403e] text-[16px]">
                Sudah memiliki akun?{' '}
                <Link to="/login" className="text-[#870012] font-black hover:underline ml-2">
                  Masuk di Sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
