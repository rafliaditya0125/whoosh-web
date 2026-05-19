import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';

const schema = z.object({
  identifier: z.string().trim().min(1, 'Alamat email atau nomor telepon wajib diisi'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

type FormData = z.infer<typeof schema>;

export default function StaffLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: 'onSubmit'
  });

  const identifierValue = watch('identifier');
  const passwordValue = watch('password');

  const isButtonDisabled = isPending || !identifierValue || !passwordValue;

  const onSubmit = (data: FormData) => {
    login({
      email: data.identifier,
      password: data.password,
    });
  };

  return (
    <main className="flex-grow flex items-center justify-center lg:p-12 p-6 min-h-screen bg-[#f6faff]">
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 min-h-[700px] bg-white overflow-hidden shadow-2xl rounded-2xl">
        {/* Left Side: Professional Branding */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-[#141d23] items-center justify-center overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#870012]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          {/* Business Content */}
          <div className="relative z-10 p-24 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-4 mb-8 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md text-white/60">
                <ShieldCheck size={20} className="text-[#870012]" />
                <span className="text-[12px] font-black uppercase tracking-[0.2em]">Management System</span>
            </div>
            <h1 className="font-hanken text-white text-[72px] font-black leading-[80px] tracking-tight mb-8">
              Whoosh <span className="text-[#870012]">Portal</span>
            </h1>
            <p className="font-hanken text-white/70 text-[24px] font-medium leading-[36px] mb-12">
              Sistem Pengelolaan Terintegrasi Kereta Cepat Jakarta-Bandung.
            </p>
            <div className="w-24 h-1.5 bg-[#870012] rounded-full"></div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center p-16 lg:p-32 bg-white">
          <div className="w-full max-w-lg">
            <div className="mb-16">
              <h2 className="font-hanken text-[#141d23] text-[36px] font-black leading-tight mb-4 uppercase tracking-tight">
                Login Personel
              </h2>
              <p className="font-inter text-[#5c6a7e] text-[16px] leading-[28px] font-medium">
                Silakan masukkan kredensial Anda untuk mengakses sistem pengelolaan Whoosh.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email/Phone Input */}
              <div className="space-y-3">
                <label 
                  className="font-hanken block text-[13px] font-black uppercase tracking-widest text-[#141d23]" 
                  htmlFor="identifier"
                >
                  Alamat Email / Nomor Telepon
                </label>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Masukkan alamat email resmi Anda"
                  {...register('identifier')}
                  className="font-inter w-full bg-slate-50 border-2 border-slate-100 focus:border-[#870012] focus:bg-white rounded-2xl transition-all outline-none text-[16px] placeholder:text-slate-400 p-4"
                />
                {errors.identifier && (
                  <p className="font-inter text-[#ba1a1a] text-[14px] font-bold mt-2">{errors.identifier.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label 
                    className="font-hanken block text-[13px] font-black uppercase tracking-widest text-[#141d23]" 
                    htmlFor="password"
                  >
                    Kata Sandi
                  </label>
                  <a 
                    className="font-hanken text-[12px] font-black uppercase tracking-wider text-[#870012] hover:text-[#b3001b] transition-colors" 
                    href="#"
                  >
                    Lupa Kata Sandi?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi Anda"
                    {...register('password')}
                    className="font-inter w-full bg-slate-50 border-2 border-slate-100 focus:border-[#870012] focus:bg-white rounded-2xl transition-all outline-none text-[16px] placeholder:text-slate-400 p-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#870012] transition-colors p-2"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-inter text-[#ba1a1a] text-[14px] font-bold mt-2">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="font-hanken w-full bg-[#141d23] hover:bg-black text-white text-[15px] font-black rounded-2xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] shadow-2xl shadow-[#141d23]/20 disabled:opacity-50 h-16 mt-8"
              >
                {isPending ? 'Memproses...' : 'Masuk ke Sistem'}
              </button>
            </form>

            <div className="mt-20 pt-8 border-t border-slate-100 text-center">
                <p className="font-hanken text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Whoosh Personnel Authentication v2.0
                </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .font-hanken { font-family: 'Hanken Grotesk', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </main>
  );
}
