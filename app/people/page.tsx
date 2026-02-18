"use client";

import { useState } from "react";

import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { Footer } from "@/components/layout/Footer";
import { memories, MoodType } from "@/lib/data";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PeoplePage() {
    const [viewMode, setViewMode] = useState<"selection" | "Family" | "Friends">("selection");

    const familyMemories = memories.filter(
        (m) => m.mood === "Family" || m.tags?.some(t => t.toLowerCase().includes("family"))
    );

    const friendsMemories = memories.filter(
        (m) => m.mood === "Friends" || m.tags?.some(t => t.toLowerCase().includes("friends"))
    );

    const displayedMemories = viewMode === "Family" ? familyMemories : friendsMemories;

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                        <Users size={32} className="text-accent-tertiary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-tertiary via-pink-400 to-accent-secondary">
                        Inner Circle
                    </h1>
                    <p className="text-gray-400">Moments with the ones who matter most.</p>
                </motion.div>

                {viewMode === "selection" ? (
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Family Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setViewMode("Family")}
                            className="cursor-pointer"
                        >
                            <GlassCard className="h-64 flex flex-col items-center justify-center p-8 hover:bg-white/10 transition-colors border-purple-500/30">
                                <Users size={64} className="text-purple-400 mb-6" />
                                <h2 className="text-3xl font-bold text-white mb-2">Family</h2>
                                <p className="text-gray-400 text-center">Roots, heritage, and unconditional love.</p>
                            </GlassCard>
                        </motion.div>

                        {/* Friends Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => setViewMode("Friends")}
                            className="cursor-pointer"
                        >
                            <GlassCard className="h-64 flex flex-col items-center justify-center p-8 hover:bg-white/10 transition-colors border-pink-500/30">
                                <Heart size={64} className="text-pink-400 mb-6" />
                                <h2 className="text-3xl font-bold text-white mb-2">Friends</h2>
                                <p className="text-gray-400 text-center">Chosen family and shared adventures.</p>
                            </GlassCard>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            onClick={() => setViewMode("selection")}
                            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            ← Back to Selection
                        </button>

                        <h2 className="text-3xl font-bold mb-8 text-white border-b border-white/10 pb-4">
                            {viewMode} Memories
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {displayedMemories.length > 0 ? (
                                displayedMemories.map((memory, idx) => (
                                    <motion.div
                                        key={memory.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <GlassCard className="h-full flex flex-col hover:border-accent-tertiary/30 transition-colors group">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${memory.mood === 'Family' ? 'bg-purple-500/20 text-purple-300' : 'bg-pink-500/20 text-pink-300'}`}>
                                                    {memory.mood}
                                                </span>
                                                <span className="text-xs text-gray-500">{memory.date}</span>
                                            </div>

                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-tertiary transition-colors">{memory.title}</h3>
                                            <p className="text-gray-400 mb-6 flex-1">{memory.description}</p>

                                            {memory.image && (
                                                <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                                                    <Image
                                                        src={memory.image}
                                                        alt={memory.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                            )}

                                            <Link href={`/memory/${memory.id}`} className="mt-auto">
                                                <button className="text-sm font-bold uppercase tracking-widest text-accent-tertiary hover:text-white transition-colors flex items-center gap-2">
                                                    View Memory <Heart size={14} />
                                                </button>
                                            </Link>
                                        </GlassCard>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    <p>No memories found in {viewMode}.</p>
                                    <Link href="/add" className="text-accent-primary hover:underline mt-4 inline-block">Add one now</Link>
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
