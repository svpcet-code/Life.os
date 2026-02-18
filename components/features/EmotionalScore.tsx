"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Memory } from "@/lib/data";
import { motion } from "framer-motion";

interface EmotionalScoreProps {
    memories: Memory[];
}

export function EmotionalScore({ memories }: EmotionalScoreProps) {
    // Calculated mock scores based on memory counts
    // In a real app, this would be complex logic
    const total = memories.length;
    const resilience = Math.min(100, Math.round((memories.filter(m => ["Lesson", "Growth", "Sad"].includes(m.mood)).length / total) * 100 * 1.5));
    const happiness = Math.min(100, Math.round((memories.filter(m => ["Happy", "Love", "Achievement", "Calm"].includes(m.mood)).length / total) * 100 * 1.2));
    const growth = Math.min(100, Math.round((memories.filter(m => ["Growth", "Lesson", "Achievement"].includes(m.mood)).length / total) * 100 * 1.8));

    const scores = [
        { label: "Resilience", value: resilience, color: "text-blue-500", stroke: "#3b82f6" },
        { label: "Happiness", value: happiness, color: "text-green-500", stroke: "#22c55e" },
        { label: "Growth", value: growth, color: "text-purple-500", stroke: "#a855f7" },
    ];

    /** Radial Progress Component */
    const RadialProgress = ({ value, stroke, label, delay }: { value: number, stroke: string, label: string, delay: number }) => {
        const radius = 35;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;

        return (
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-white/5"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            whileInView={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, delay: delay, ease: "easeOut" }}
                            viewport={{ once: true }}
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke={stroke}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{value}%</span>
                    </div>
                </div>
                <span className="mt-2 text-sm text-gray-400 font-medium uppercase tracking-wider">{label}</span>
            </div>
        );
    };

    return (
        <GlassCard className="p-6 h-full flex flex-col justify-center">
            <div className="mb-6 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-1">Core Metrics</h3>
                <p className="text-gray-400 text-sm">Quantified emotional performance.</p>
            </div>

            <div className="flex flex-wrap justify-around gap-4 text-center">
                {scores.map((score, i) => (
                    <RadialProgress
                        key={score.label}
                        value={score.value}
                        stroke={score.stroke}
                        label={score.label}
                        delay={i * 0.2}
                    />
                ))}
            </div>
        </GlassCard>
    );
}
