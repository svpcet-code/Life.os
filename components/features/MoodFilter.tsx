"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoodFilterProps {
    currentMood: string;
    onMoodChange: (mood: string) => void;
    moods: string[];
}

export function MoodFilter({ currentMood, onMoodChange, moods }: MoodFilterProps) {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {moods.map((mood, index) => (
                <button
                    key={mood}
                    onClick={() => onMoodChange(mood)}
                    className={cn(
                        "relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        currentMood === mood
                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                >
                    {currentMood === mood && (
                        <motion.div
                            layoutId="activeMood"
                            className="absolute inset-0 rounded-full bg-white mix-blend-overlay"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    {mood}
                </button>
            ))}
        </div>
    );
}
