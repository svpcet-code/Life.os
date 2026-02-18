"use client";

import { memories } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { GlowingButton } from "@/components/ui/GlowingButton";

export default function MemoryDetailPage({ params }: { params: { id: string } }) {
    const memory = memories.find((m) => m.id === params.id);

    if (!memory) {
        return notFound();
    }

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex-1 pt-24 pb-20 relative"
            >
                {/* Cinematic Header Image */}
                {memory.image && (
                    <div className="absolute top-0 left-0 w-full h-[60vh] z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
                        <Image
                            src={memory.image}
                            alt={memory.title}
                            fill
                            className="object-cover opacity-60"
                        />
                    </div>
                )}

                <div className="max-w-4xl mx-auto px-6 relative z-10 mt-[20vh] md:mt-[30vh]">
                    <Link href="/timeline">
                        <motion.button
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeft size={20} /> Back to Timeline
                        </motion.button>
                    </Link>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="glass rounded-3xl p-8 md:p-12 border border-white/10"
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-accent-primary/20 border border-accent-primary/30 text-accent-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <Tag size={14} /> {memory.mood}
                            </span>
                            <span className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                                <Calendar size={14} /> {memory.date}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">{memory.title}</h1>

                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="lead text-xl text-gray-200 mb-8 font-light italic border-l-4 border-accent-secondary pl-6">
                                "{memory.description}"
                            </p>

                            <div className="space-y-6 text-gray-300 leading-relaxed">
                                {memory.fullStory ? (
                                    memory.fullStory.split('\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p>No detailed story available for this memory.</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 flex justify-end">
                            <GlowingButton variant="secondary" className="px-6 py-2 text-sm">
                                Edit Memory
                            </GlowingButton>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
