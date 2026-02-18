"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { Footer } from "@/components/layout/Footer";
import { memories } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Shield, EyeOff } from "lucide-react";
import Link from "next/link";
import { LockScreen } from "@/components/features/LockScreen";

export default function PrivatePage() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    const privateMemories = memories.filter((m) => m.isPrivate);

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <AnimatePresence>
                {!isUnlocked && (
                    <LockScreen onUnlock={() => setIsUnlocked(true)} />
                )}
            </AnimatePresence>

            <section className="flex-1 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                {isUnlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                                <Shield size={32} className="text-red-400" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-red-100">
                                Restricted Archives
                            </h1>
                            <p className="text-red-300/60">Eyes only. These memories are encrypted.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {privateMemories.length > 0 ? (
                                privateMemories.map((memory, idx) => (
                                    <motion.div
                                        key={memory.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <GlassCard className="h-full border-red-500/20 bg-red-950/10 hover:bg-red-900/20 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-mono text-red-400 border border-red-500/30 px-2 py-1 rounded">
                                                    CONFIDENTIAL
                                                </span>
                                                <EyeOff size={16} className="text-red-400/50" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 text-red-100">{memory.title}</h3>
                                            <p className="text-red-200/60 mb-4">{memory.description}</p>
                                            <div className="text-xs text-red-400/40 text-right">{memory.date}</div>
                                        </GlassCard>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    No private memories found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </section>

            <Footer />
        </main>
    );
}
