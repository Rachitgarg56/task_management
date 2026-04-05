'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import authService from '@/services/authService';
import { User } from '@/types';
import { tokenStorage } from '@/lib/tokens';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        const { user } = await authService.login(payload);
        setUser(user);
        toast.success(`Welcome back, ${user.name}!`);
        router.push('/dashboard');
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Login failed';
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        const { user } = await authService.register(payload);
        setUser(user);
        toast.success(`Welcome, ${user.name}!`);
        router.push('/dashboard');
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Registration failed';
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      tokenStorage.clearAll();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { user, loading, login, register, logout, isAuthenticated: !!user };
}
