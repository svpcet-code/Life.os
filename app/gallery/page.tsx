"use client";

import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { Footer } from "@/components/layout/Footer";
import { memories } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

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
                    <p className="text-gray-400">Windows into the past.</p>
                </motion.div>

                {/* Masonry Layout Simulation using columns */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {imageMemories.map((memory, idx) => (
                        <Link key={memory.id} href={`/memory/${memory.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="break-inside-avoid mb-6"
                            >
                                <GlassCard className="p-0 overflow-hidden group hover:border-accent-primary/50 transition-colors">
                                    <div className="relative w-full overflow-hidden">
                                        <Image
                                            src={memory.image!}
                                            alt={memory.title}
                                            width={600}
                                            height={400} // Aspect ratio varies, but this is base
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
            </section>

            <Footer />
        </main>
    );
}
