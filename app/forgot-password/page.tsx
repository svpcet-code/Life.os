'use client';
import { useState, FormEvent } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [step, setStep] = useState<'form' | 'done'>('form');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Something went wrong');
            }

            setSuccess(json.message);
            setStep('done');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#0a0a0a] to-[#0a0a0a] p-4 text-white">
            <GlassCard className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mb-4"
                    >
                        {step === 'done' ? <CheckCircle2 size={24} /> : <KeyRound size={24} />}
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        {step === 'done' ? 'Password Reset!' : 'Reset Password'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        {step === 'done'
                            ? 'Your password has been updated successfully.'
                            : 'Enter your email and choose a new password.'}
                    </p>
                </div>

                {step === 'form' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                                New Password
                            </label>
                            <input
                                name="newPassword"
                                type="password"
                                required
                                minLength={6}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                                Confirm New Password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-amber-600 px-4 py-3 font-medium text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20 mb-6">
                            {success}
                        </div>
                        <Link
                            href="/login"
                            className="inline-block w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-500 transition-all text-center"
                        >
                            Go to Login
                        </Link>
                    </motion.div>
                )}

                {step === 'form' && (
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Remember your password?{' '}
                        <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
                            Sign in
                        </Link>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
