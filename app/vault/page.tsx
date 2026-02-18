"use client";

import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { motion } from "framer-motion";
import { Lock, Send } from "lucide-react";

export default function VaultPage() {
    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4 max-w-4xl mx-auto w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-16"
                >
                    <div className="inline-block p-6 rounded-full bg-white/5 border border-white/10 mb-6 relative">
                        <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full" />
                        <Lock size={48} className="text-accent-primary relative z-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Message Vault</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Send encrypted transmissions to your future self.
                        Time-locked until the moment is right.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                    {/* Write New Message */}
                    <GlassCard className="p-8 flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Send size={18} /> New Transmission
                        </h3>
                        <textarea
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 mb-4 resize-none focus:outline-none focus:border-accent-primary transition-colors h-48"
                            placeholder="Dear Future Me..."
                        />
                        <div className="flex items-center gap-4">
                            <input
                                type="date"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400"
                            />
                            <GlowingButton className="flex-1 justify-center py-2 text-sm">Lock & Send</GlowingButton>
                        </div>
                    </GlassCard>

                    {/* Locked Messages */}
                    <div className="space-y-4">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Time-Locked Capsules</h3>

                        {[1, 2, 3].map((i) => (
                            <GlassCard key={i} className="p-4 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-white/5">
                                        <Lock size={16} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-300">Capsule #{100 + i}</div>
                                        <div className="text-xs text-gray-500">Unlocks: Dec 31, 202{5 + i}</div>
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-accent-secondary">Encrypted</div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
