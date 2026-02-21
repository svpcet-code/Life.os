'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Login failed');
            }

            login(); // Update context state immediately
            router.push('/dashboard');
            router.refresh();
            // Sync with context
            // We can manually set it or let the auto-check handle it, but manual is faster for UX
            // Since we are redirecting, the layout might remount or we relies on the context persistence?
            // Actually, simply calling login() from context (which sets local state) is good immediate feedback
            // But we need to access context.
            // However, we are inside a function.
            // Let's rely on the router.push causing a navigation, and hopefully the context persists or re-checks?
            // Wait, context state is in memory. If we don't reload the page, we need to update the context.

            // To do this properly in this file:
            // 1. We need useAuth hook.
            // 2. We call login(). 
            // BUT login() in context just sets true. Ideally it should also maybe fetch? 
            // For now, setting true is enough because we know we just succeeded.

            // We need to pass the login function to this component or use the hook.
            // I'll add the hook usage below.
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0a] to-[#0a0a0a] p-4 text-white">
            <GlassCard className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 mb-4"
                    >
                        <LogIn size={24} />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your credentials to access Life.OS
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                            <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Create one
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
