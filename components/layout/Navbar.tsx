"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, Zap, Clock, MessageSquare, Image as ImageIcon, LayoutDashboard, Menu, X, BookOpen, User, LogOut, Users, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";

const navItems = [
    { name: "Timeline", href: "/timeline", icon: Clock },
    { name: "Chapters", href: "/chapters", icon: BookOpen },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Inner Circle", href: "/people", icon: Users },
    { name: "Private", href: "/private", icon: Lock },
    { name: "Vault", href: "/vault", icon: MessageSquare },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Memory", href: "/add", icon: Zap },
    { name: "Words", href: "/words", icon: Sparkles },
];

const sidebarRoutes = ['/dashboard', '/memories', '/moods', '/messages'];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    // Check if current page has sidebar
    const isSidebarPage = sidebarRoutes.some(route => pathname.startsWith(route));

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "fixed top-0 right-0 z-50 px-6 py-4 transition-all duration-300",
                isSidebarPage ? "md:pl-72 left-0" : "left-0"
            )}
        >
            <div className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden group-hover:scale-110 transition-transform">
                        <Image
                            src="/life-logo-jj.avif"
                            alt="Life.OS Logo"
                            fill
                            className="object-cover p-1"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-wider group-hover:text-accent-primary transition-colors">
                        Life.OS
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-primary",
                                    isActive ? "text-accent-primary" : "text-gray-400"
                                )}
                            >
                                <Icon size={16} />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Auth Button Desktop */}
                    {isAuthenticated ? (
                        <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
                            <LogOut size={16} />
                        </button>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            <User size={16} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-300"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-20 left-6 right-6 glass rounded-2xl p-4 flex flex-col gap-4 md:hidden"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <item.icon size={20} className="text-accent-primary" />
                            <span className="text-white">{item.name}</span>
                        </Link>
                    ))}

                    {/* Mobile Auth Button */}
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                            }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors w-full text-left"
                        >
                            <LogOut size={20} className="text-red-400" />
                            <span className="text-white">Logout</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <User size={20} className="text-accent-primary" />
                            <span className="text-white">Login</span>
                        </Link>
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
}
