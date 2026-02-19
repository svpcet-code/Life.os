'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Registration failed');
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] p-4 text-white">
            <GlassCard className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 mb-4"
                    >
                        <UserPlus size={24} />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Join Life.OS and start tracking your journey
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Get Started'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Sign in
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
