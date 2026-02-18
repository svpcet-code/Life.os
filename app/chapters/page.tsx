"use client";

import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { Footer } from "@/components/layout/Footer";
import { LifeChapters } from "@/components/features/LifeChapters";
import { motion } from "framer-motion";

export default function ChaptersPage() {
    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />

            <section className="flex-1 pt-32 pb-20 px-4 w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-tertiary via-accent-primary to-accent-secondary">
                        Life Saga
                    </h1>
                    <p className="text-gray-400">The epochs of your personal history.</p>
                </motion.div>

                <LifeChapters />
            </section>
        </main>
    );
}
