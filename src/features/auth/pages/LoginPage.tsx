import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';

const schema = z.object({
  identifier: z.string().trim().min(1, 'Email atau nomor telepon wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
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

  const getButtonText = () => {
    if (!identifierValue && !passwordValue) return 'Isi email dan password';
    if (!identifierValue) return 'Isi email';
    if (!passwordValue) return 'Isi password';
    return 'Masuk';
  };

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
        {/* Left Side: Full Red Background with Branding */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-[#870012] items-center justify-center overflow-hidden">
          {/* Branding Content */}
          <div className="relative z-10 p-24 max-w-2xl">
            <span className="font-hanken text-white text-[72px] font-black leading-[80px] tracking-tight mb-8">
              Whoosh
            </span>
            <p className="font-hanken text-white text-[32px] font-semibold leading-[40px] opacity-95 mb-12">
              Sat-Set. Aman. Nyaman.
            </p>
            <div className="w-24 h-2 bg-white/50 rounded-full"></div>
          </div>

          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full blur-3xl animate-float"
              style={{
                width: `${Math.random() * 150 + 80}px`,
                height: `${Math.random() * 150 + 80}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${7000 + Math.random() * 5000}ms`,
              }}
            />
          ))}
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center p-16 lg:p-32 bg-white">
          {/* Mobile Branding */}
          <div className="lg:hidden mb-20 text-center">
            <span className="font-hanken text-[#870012] text-[48px] font-black tracking-tight">
              Whoosh
            </span>
          </div>

          <div className="w-full max-w-lg">
            <div className="mb-20">
              <h2 className="font-hanken text-[#141d23] text-[40px] font-bold leading-[48px] mb-4">
                Halo, Apa Kabar?
              </h2>
              <p className="font-inter text-[#5c403e] text-[18px] leading-[28px]">
                Yuk, masuk ke akun Whoosh kamu buat lanjutin perjalanan.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" style={{ marginBottom: '1rem' }}>
              {/* Email/Phone Input */}
              <div>
                <label 
                  className="font-inter block text-[16px] font-semibold leading-[24px] mb-4 text-[#141d23]" 
                  htmlFor="identifier"
                >
                  Email atau Nomor Telepon
                </label>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Ketik email atau no. HP kamu"
                  {...register('identifier')}
                  className="font-inter w-full bg-white border-2 border-[#e5bdba] focus:border-[#870012] focus:ring-2 focus:ring-[#870012]/20 rounded-xl transition-all outline-none text-[16px] leading-[24px] placeholder:text-gray-400"
                  style={{ padding: '0.75rem 1rem', minHeight: '48px' }}
                />
                {errors.identifier && (
                  <p className="font-inter text-[#ba1a1a] text-[16px] mt-4 font-semibold">{errors.identifier.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <label 
                    className="font-inter block text-[16px] font-semibold leading-[24px] text-[#141d23]" 
                    htmlFor="password"
                  >
                    Kata Sandi
                  </label>
                  <a 
                    className="font-inter text-[16px] font-semibold leading-[24px] text-[#870012] hover:text-[#b3001b] hover:underline transition-colors" 
                    href="#"
                  >
                    Lupa Sandi?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ketik password kamu"
                    {...register('password')}
                    className="font-inter w-full bg-white border-2 border-[#e5bdba] focus:border-[#870012] focus:ring-2 focus:ring-[#870012]/20 rounded-xl transition-all outline-none text-[16px] leading-[24px] placeholder:text-gray-400"
                    style={{ padding: '0.75rem 1rem', minHeight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c403e] hover:text-[#870012] transition-colors p-2"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-inter text-[#ba1a1a] text-[16px] mt-4 font-semibold">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="font-hanken w-full bg-[#870012] hover:bg-[#9d0015] active:bg-[#6b000e] text-white text-[16px] font-bold leading-[20px] rounded-xl transition-all active:scale-[0.98] uppercase tracking-wider shadow-xl shadow-[#870012]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                style={{ padding: '0.75rem 1.5rem', marginTop: '1rem' }}
              >
                {isPending ? 'Memuat...' : getButtonText()}
              </button>
            </form>

            {/* Divider */}
            <div className="relative" style={{ margin: '1.5rem 0' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dbe4ed]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="font-inter bg-white px-6 text-[16px] leading-[24px] text-[#5c403e] font-semibold">
                  Atau pake ini juga bisa
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="w-full">
              <button className="flex items-center justify-center gap-4 w-full border-2 border-[#e5bdba] hover:bg-[#f6faff] hover:border-[#870012] transition-all rounded-xl group" style={{ padding: '1rem 2rem' }}>
                <img 
                  alt="Google" 
                  className="w-5 h-5" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOqrMtqq9a8qIT7l0VZxVBUZnBQk1ZjESI_01_Hx4rr12SBG36A-HKq9lNukfrUG-7YxWmG9FZS18LPiZTi6oER78VTcyYi5mxpHg_IaP2mU1sj6KWgtz4HBlCJ10TS3atq7OzaXXbiUUYZvlt3eE-eaGL-jNJ74DDn85eSI87P3wZohDmi-pm8HecizB2o0dI3NtFfbWcOyWuA8MSWFndgnhwqVpJqIjhLfyvzD582yhJ2E66RhPALT3zr2CTVKKbWDubxOf_8us"
                />
                <span className="font-jetbrains text-[16px] leading-[20px] tracking-[0.05em] font-semibold text-[#141d23] group-hover:text-[#870012]">
                  Google
                </span>
              </button>
            </div>

            {/* Footer Link */}
            <p className="font-inter text-center text-[16px] leading-[24px] text-[#5c403e]" style={{ marginTop: '1.5rem' }}>
              Belum ada akun?{' '}
              <Link 
                to="/register" 
                className="text-[#870012] font-bold hover:text-[#b3001b] hover:underline transition-colors"
              >
                Daftar Dulu Yuk
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .font-hanken {
          font-family: 'Hanken Grotesk', sans-serif;
        }
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .font-jetbrains {
          font-family: 'JetBrains Mono', monospace;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -40px); }
        }
        .animate-float {
          animation: float ease-in-out infinite alternate;
        }
      `}</style>
    </main>
  );
}
