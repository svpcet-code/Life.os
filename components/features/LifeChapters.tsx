"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { lifeChapters } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LifeChapters() {
    return (
        <section className="py-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-light tracking-wide mb-2">The Saga</h2>
                <div className="w-24 h-0.5 bg-accent-primary mx-auto opacity-50"></div>
                <p className="text-gray-400 mt-4">Your life, divided into epochs.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                {lifeChapters.map((chapter, i) => (
                    <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="group"
                    >
                        <GlassCard className="h-full overflow-hidden p-0 relative hover:border-accent-primary/50 transition-colors">
                            <div className="h-48 relative overflow-hidden">
                                {chapter.image && (
                                    <Image
                                        src={chapter.image}
                                        alt={chapter.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-xs font-mono text-accent-primary uppercase tracking-wider">{chapter.period}</span>
                                    <h3 className="text-2xl font-bold text-white mt-1">{chapter.title}</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    {chapter.description}
                                </p>
                                <button className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest hover:text-accent-primary transition-colors">
                                    Explore Chapter <ArrowRight size={14} />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
