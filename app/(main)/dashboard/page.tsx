'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Brain, Activity, Send, Play, Sparkles, Zap, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { memories } from '@/lib/data';
import { EmotionalChart } from '@/components/features/EmotionalChart';
import { TodoList } from '@/components/features/TodoList';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DashboardPage() {
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [stats, setStats] = useState({
        totalMemories: 0,
        moodEntries: 0,
        messagesSent: 12, // Mock data
        streak: 8        // Mock data
    });

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => setUser({ name: 'Commander' })); // Fallback

        // Simulate data loading
        setStats(prev => ({
            ...prev,
            totalMemories: memories.length,
            moodEntries: memories.length
        }));
    }, []);

    if (!user) return <div className="min-h-screen bg-[#050510] flex items-center justify-center text-indigo-400">Initializing Life.OS...</div>;

    return (
        <div className="min-h-screen bg-[#050510] text-gray-100 overflow-hidden relative">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px] pointer-events-none" />

            {/* Stars / Particles (Simple CSS) */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay" />

            <div className="max-w-7xl mx-auto px-6 pt-28 pb-12 relative z-10">

                {/* Hero Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-12"
                >
                    <motion.div variants={itemVariants} className="mb-8">
                        <h1 className="text-5xl md:text-6xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                                Welcome back, {user.name}.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 flex items-center gap-2">
                            <Sparkles size={18} className="text-yellow-400" />
                            Ready to organize your digital life?
                        </p>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <StatCard label="Total Memories" value={stats.totalMemories} icon={Brain} color="text-purple-400" delay={0} />
                        <StatCard label="Mood Entries" value={stats.moodEntries} icon={Activity} color="text-blue-400" delay={0.1} />
                        <StatCard label="Messages Sent" value={stats.messagesSent} icon={Send} color="text-pink-400" delay={0.2} />
                        <StatCard label="Active Streak" value={`${stats.streak} Days`} icon={Zap} color="text-yellow-400" delay={0.3} />
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <FeatureCard
                            href="/memories"
                            title="Memory Vault"
                            description="Store and reflect on your precious moments in a secure timeline."
                            icon={Brain}
                            color="purple"
                        />
                        <FeatureCard
                            href="/moods"
                            title="Mood Analysis"
                            description="Track your emotional journey with AI-powered insights."
                            icon={Activity}
                            color="blue"
                        />
                        <FeatureCard
                            href="/messages"
                            title="Time Capsule"
                            description="Send messages to your future self to unlock later."
                            icon={MessageSquare}
                            color="indigo"
                        />
                    </motion.div>

                    {/* Main Dashboard Content Grid */}
                    <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Mood Graph */}
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-white">Recent Emotional Trends</h2>
                                <Link href="/moods" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View Full Analysis &rarr;</Link>
                            </div>
                            <div className="h-[400px] w-full">
                                <EmotionalChart memories={memories} />
                            </div>
                        </motion.div>

                        {/* Todo List */}
                        <motion.div variants={itemVariants} className="h-full">
                            <TodoList />
                        </motion.div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}

// Subcomponents

function StatCard({ label, value, icon: Icon, color, delay }: { label: string, value: string | number, icon: any, color: string, delay: number }) {
    return (
        <GlassCard className="p-6 flex flex-col items-start justify-between h-32 hover:bg-white/5 transition-colors group">
            <div className={`p-2 rounded-lg bg-white/5 ${color} mb-2 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {/* Simple count up animation could be added here */}
                    {value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</div>
            </div>
        </GlassCard>
    );
}

function FeatureCard({ href, title, description, icon: Icon, color }: { href: string, title: string, description: string, icon: any, color: string }) {
    const colorClasses = {
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]",
    };

    // @ts-ignore
    const activeColorClass = colorClasses[color] || colorClasses.purple;

    return (
        <Link href={href}>
            <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
            >
                <GlassCard className={`h-full p-8 flex flex-col relative overflow-hidden group transition-all duration-300 border border-white/5`}>
                    {/* Gradient Hover Background */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-${color}-500/10 to-transparent`} />

                    <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${activeColorClass}`}>
                            <Icon size={32} />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">{title}</h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                            {description}
                        </p>

                        <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                            <span>Explore</span>
                            <Play size={12} className="ml-2 fill-current opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </Link>
    );
}
