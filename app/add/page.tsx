"use client";

import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { moods } from "@/lib/data";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AddMemoryPage() {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        mood: moods[1], // Default to Happy
        description: "",
        fullStory: "",
        image: "",
        isPrivate: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit to API
        alert("Memory Saved to Vault (Simulated)");
        console.log(formData);
    };

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4 max-w-3xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold mb-2">Log a Memory</h1>
                    <p className="text-gray-400">Preserve this moment for eternity.</p>
                </motion.div>

                <GlassCard className="p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., The Big Promotion"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all text-white placeholder:text-gray-600"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all text-white inverted-calendar-icon"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Mood</label>
                            <div className="flex flex-wrap gap-2">
                                {moods.map((mood) => (
                                    <button
                                        key={mood}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mood })}
                                        className={`px-4 py-2 rounded-full text-sm border transition-all ${formData.mood === mood
                                            ? "bg-accent-primary border-accent-primary text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        {mood}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Short Description</label>
                            <input
                                type="text"
                                required
                                placeholder="One sentence summary..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all text-white placeholder:text-gray-600"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Full Story</label>
                            <textarea
                                rows={5}
                                required
                                placeholder="Write the details..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all text-white placeholder:text-gray-600 resize-none"
                                value={formData.fullStory}
                                onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Image URL (Optional)</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all text-white placeholder:text-gray-600"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex-1">
                                <label className="text-sm font-bold text-white block">Private Memory</label>
                                <p className="text-xs text-gray-400">Only visible in the Private Vault</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPrivate ? "bg-accent-primary" : "bg-white/10"}`}
                            >
                                <motion.div
                                    animate={{ x: formData.isPrivate ? 26 : 2 }}
                                    className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                                />
                            </button>
                        </div>

                        <div className="pt-4">
                            <GlowingButton type="submit" className="w-full justify-center">
                                Preserve Memory
                            </GlowingButton>
                        </div>
                    </form>
                </GlassCard>
            </section>

        </main>
    );
}
