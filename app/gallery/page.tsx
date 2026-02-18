"use client";

import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { memories } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowingButton } from "@/components/ui/GlowingButton";

export default function GalleryPage() {
    const imageMemories = memories.filter((m) => m.image);

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                        Visual Archive
                    </h1>
                    <p className="text-gray-400 mb-8">Windows into the past.</p>
                    <Link href="/add">
                        <GlowingButton variant="secondary" className="px-8 py-3 rounded-full flex items-center gap-2 mx-auto">
                            + Log Memory
                        </GlowingButton>
                    </Link>
                </motion.div>

                {/* Categories */}
                <div className="space-y-24">

                    {/* Family & Friends Section */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">
                                Family & Friends
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {imageMemories.filter(m => m.tags?.some(t => ['#family', '#relationship', '#friends', '#love'].includes(t))).map((memory, idx) => (
                                <Link key={memory.id} href={`/memory/${memory.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                        className="relative group overflow-hidden rounded-2xl aspect-[4/3] glass-card border-none"
                                    >
                                        <Image
                                            src={memory.image!}
                                            alt={memory.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-4 left-4">
                                            <p className="text-white font-bold shadow-black drop-shadow-lg">{memory.title}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                            {/* Placeholder if empty */}
                            {imageMemories.filter(m => m.tags?.some(t => ['#family', '#relationship', '#friends', '#love'].includes(t))).length === 0 && (
                                <div className="col-span-3 text-center py-10 text-gray-500 italic">
                                    No family or friends memories found yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Private Section (Locked) */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                Private Gallery
                            </h2>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/5 backdrop-blur-sm bg-black/40 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-red-500/30 transition-colors">

                            {/* Locked Visuals */}
                            <div className="absolute inset-0 grid grid-cols-4 gap-1 opacity-20 blur-xl pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-gray-800/50 w-full h-full" />
                                ))}
                            </div>

                            <div className="relative z-10 p-8">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Restricted Access</h3>
                                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                                    This section contains encrypted visual memories. Biometric authentication required to decrypt.
                                </p>
                                <button className="px-6 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all">
                                    Authenticate
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* All Archives */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                                Complete Archive
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
                        </div>

                        {/* Masonry Layout for All */}
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {imageMemories.map((memory, idx) => (
                                <Link key={memory.id} href={`/memory/${memory.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="break-inside-avoid mb-6"
                                    >
                                        <GlassCard className="p-0 overflow-hidden group hover:border-accent-primary/50 transition-colors">
                                            <div className="relative w-full overflow-hidden">
                                                <Image
                                                    src={memory.image!}
                                                    alt={memory.title}
                                                    width={600}
                                                    height={400}
                                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />

                                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                                                    <h3 className="text-white font-bold text-lg">{memory.title}</h3>
                                                    <p className="text-gray-300 text-sm">{memory.date}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
