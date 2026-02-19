'use client';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={twMerge(
                'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl',
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            {children}
        </motion.div>
    );
}
