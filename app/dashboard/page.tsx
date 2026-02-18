"use client";

import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { Footer } from "@/components/layout/Footer";
import { memories } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { EmotionalChart } from "@/components/features/EmotionalChart";
import { EmotionalScore } from "@/components/features/EmotionalScore";
import { HeatmapCalendar } from "@/components/features/HeatmapCalendar";
import { CoreValues } from "@/components/features/CoreValues";
import { AIReflection } from "@/components/features/AIReflection";
import { MemoryReplay } from "@/components/features/MemoryReplay";
import { useState } from "react";
import { Play, BookOpen } from "lucide-react";
import Link from "next/link";
import { GlowingButton } from "@/components/ui/GlowingButton";

export default function DashboardPage() {
    const [showReplay, setShowReplay] = useState(false);

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            {/* Background handled by Layout usually, but keeping ParticleBackground here if not global */}
            {/* Note: In Layout we have stars, but ParticleBackground is interactive. Keeping it. */}
            <ParticleBackground />

            <AnimatePresence>
                {showReplay && <MemoryReplay memories={memories} onClose={() => setShowReplay(false)} />}
            </AnimatePresence>

            <section className="flex-1 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">Life Analytics</h1>
                        <p className="text-gray-400">Quantifying the qualitative measures of your existence.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-4"
                    >
                        <Link href="/chapters">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-bold uppercase tracking-wider">
                                <BookOpen size={16} /> Chapters
                            </button>
                        </Link>
                        <GlowingButton onClick={() => setShowReplay(true)} className="flex items-center gap-2">
                            <Play size={16} fill="currentColor" /> Replay Year
                        </GlowingButton>
                    </motion.div>
                </div>

                {/* AI Reflection Section */}
                <div className="mb-8">
                    <AIReflection />
                </div>

                {/* Top Row: Chart & Scores */}
                <div className="grid md:grid-cols-3 gap-6 mb-8 h-auto md:h-[400px]">
                    <div className="md:col-span-2 h-full">
                        <EmotionalChart memories={memories} />
                    </div>
                    <div className="h-full">
                        <EmotionalScore memories={memories} />
                    </div>
                </div>

                {/* Middle Row: Heatmap */}
                <div className="mb-12">
                    <HeatmapCalendar memories={memories} />
                </div>

                {/* Bottom Row: Core Values */}
                <div className="mb-12">
                    <CoreValues />
                </div>

            </section>
        </main>
    );
}
