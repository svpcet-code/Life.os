"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Memory } from "@/lib/data";
import { motion } from "framer-motion";
import { useState } from "react";

// Fallback simple tooltip if shadcn tooltip not available
const SimpleTooltip = ({ children, content }: { children: React.ReactNode, content: string }) => {
    const [show, setShow] = useState(false);
    return (
        <div
            className="relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black/80 text-white rounded whitespace-nowrap z-50 pointer-events-none">
                    {content}
                </div>
            )}
        </div>
    );
};


interface HeatmapCalendarProps {
    memories: Memory[];
}

export function HeatmapCalendar({ memories }: HeatmapCalendarProps) {
    // Generate last 365 days
    const today = new Date();
    const days: string[] = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }

    // Map memories to dates
    const memoryMap: Record<string, Memory[]> = {};
    memories.forEach(m => {
        if (!memoryMap[m.date]) memoryMap[m.date] = [];
        memoryMap[m.date].push(m);
    });

    const getColor = (dateStr: string) => {
        const mems = memoryMap[dateStr];
        if (!mems || mems.length === 0) return "bg-white/5";

        // Priority color based on mood
        const mood = mems[0].mood; // Simplified: take first memory's mood
        switch (mood) {
            case "Happy": return "bg-green-500";
            case "Achievement": return "bg-green-400 shadow-[0_0_5px_currentColor]";
            case "Love": return "bg-pink-500";
            case "Calm": return "bg-blue-500";
            case "Growth": return "bg-purple-500";
            case "Lesson": return "bg-indigo-500";
            case "Sad": return "bg-gray-600";
            case "Intense": return "bg-red-500 shadow-[0_0_5px_currentColor]";
            default: return "bg-white/20";
        }
    };

    return (
        <GlassCard className="p-6 overflow-x-auto">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Emotional Topography</h3>
                    <p className="text-gray-400 text-sm">A year in pixels.</p>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-white/5"></div> Empty</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500"></div> Positive</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-500"></div> Intense</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500"></div> Calm</div>
                </div>
            </div>

            <div className="flex gap-1 justify-center min-w-[800px]">
                {/* Simplified Grid: 52 weeks x 7 days */}
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const dayOfYearIndex = weekIndex * 7 + dayIndex;
                            if (dayOfYearIndex >= days.length) return null;
                            const dateStr = days[dayOfYearIndex];
                            const count = memoryMap[dateStr]?.length || 0;

                            return (
                                <SimpleTooltip key={dateStr} content={`${dateStr}: ${count} memories`}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: weekIndex * 0.01 + dayIndex * 0.01 }}
                                        className={`w-3 h-3 rounded-[2px] ${getColor(dateStr)} hover:opacity-80 transition-opacity cursor-pointer`}
                                    />
                                </SimpleTooltip>
                            );
                        })}
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
