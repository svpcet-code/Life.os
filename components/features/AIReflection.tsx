"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";

export function AIReflection() {
    const [isGenerating, setIsGenerating] = useState(true);
    const [text, setText] = useState("");
    const fullText = "Based on your recent memories, you've shown remarkable resilience. The transition from University Life to Career Beginnings marked a significant shift in your emotional baseline, moving from frequent 'Calm' states to moments of 'Intense' growth. Your happiness ratio has increased by 15% in the last quarter, correlating with your 'New Apartment' milestone. You are currently in a high-growth phase.";

    useEffect(() => {
        if (!isGenerating) return;

        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) {
                setIsGenerating(false);
                clearInterval(interval);
            }
        }, 30); // Typing effect

        return () => clearInterval(interval);
    }, [isGenerating]);

    return (
        <GlassCard className="p-8 relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-accent-secondary/20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 p-32 bg-accent-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent-primary/20 text-accent-primary animate-pulse">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">AI Reflection</h3>
                        <p className="text-xs text-accent-primary/80 uppercase tracking-widest font-mono">Analysis Complete</p>
                    </div>
                </div>

                <div className="min-h-[100px]">
                    <p className="text-gray-200 leading-relaxed font-light text-lg">
                        {text}
                        {isGenerating && <span className="inline-block w-2 h-4 bg-accent-primary ml-1 animate-blink" />}
                    </p>
                </div>

                <div className="mt-6 flex gap-4">
                    <button className="text-xs flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <Sparkles size={12} /> Generate New Insight
                    </button>
                </div>
            </div>
        </GlassCard>
    );
}
