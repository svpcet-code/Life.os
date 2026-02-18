"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { memories, moods } from "@/lib/data";
import { TimelineItem } from "@/components/features/TimelineItem";
import { MoodFilter } from "@/components/features/MoodFilter";
import { useState } from "react";

export default function TimelinePage() {
    const [currentMood, setCurrentMood] = useState("All");

    const filteredMemories = currentMood === "All"
        ? memories
        : memories.filter(m => m.mood === currentMood);

    // Sort by date descending
    const sortedMemories = [...filteredMemories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="pt-32 pb-20 px-4 max-w-5xl mx-auto w-full flex-1">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-tertiary via-accent-primary to-accent-secondary">
                        Memory Timeline
                    </h1>
                    <p className="text-gray-400">Tracing the coordinates of your life.</p>
                </motion.div>

                <MoodFilter currentMood={currentMood} onMoodChange={setCurrentMood} moods={moods} />

                <div className="relative flex flex-col md:items-center">
                    {/* Center Line for Desktop */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-primary/30 to-transparent hidden md:block" />

                    {sortedMemories.length > 0 ? (
                        sortedMemories.map((memory, idx) => (
                            <TimelineItem key={memory.id} memory={memory} idx={idx} />
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            No memories found for this mood.
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
