'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { Home, Brain, Activity, Send, LogOut, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/memories', label: 'Memory Vault', icon: Brain },
    { href: '/moods', label: 'Mood Analytics', icon: Activity },
    { href: '/messages', label: 'Time Capsule', icon: Send },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        // In a real app we'd call an API to clear cookie, 
        // but for now we can just redirect to login which middleware handles or clear client state
        // We'll rename the cookie clearing api later
        // For now just force redirect
        document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
        router.refresh();
    }

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex h-screen w-64 flex-col justify-between border-r border-white/5 bg-black/20 text-white backdrop-blur-xl"
        >
            <div className="p-6">
                <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <Code2 className="text-indigo-400" />
                    <span>Life.OS</span>
                </div>

                <nav className="mt-8 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-white/5',
                                    isActive ? 'bg-white/10 text-indigo-400 shadow-lg shadow-indigo-500/10' : 'text-gray-400'
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-red-400"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </motion.div>
    );
}
