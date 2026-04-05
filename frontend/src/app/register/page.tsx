'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, CheckSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-700/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-white mb-1">Create an account</h1>
            <p className="text-slate-400 text-sm">Start managing your tasks today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('name')}
                  type="text"
                  className="input-field pl-10"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('email')}
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('password')}
                  type="password"
                  className="input-field pl-10"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="input-field pl-10"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
