"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Memory } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";

interface TimelineItemProps {
    memory: Memory;
    idx: number; // For staggered animation
}

const moodColors: Record<string, string> = {
    Happy: "from-yellow-400/20 to-orange-400/5 border-yellow-400/20 text-yellow-200",
    Sad: "from-blue-900/40 to-slate-900/5 border-blue-400/20 text-blue-200",
    Achievement: "from-purple-500/20 to-fuchsia-500/5 border-purple-400/20 text-purple-200",
    Lesson: "from-emerald-500/20 to-teal-500/5 border-emerald-400/20 text-emerald-200",
    Love: "from-rose-500/20 to-pink-500/5 border-rose-400/20 text-rose-200",
    Growth: "from-indigo-500/20 to-violet-500/5 border-indigo-400/20 text-indigo-200",
    Calm: "from-cyan-400/20 to-sky-400/5 border-cyan-400/20 text-cyan-200",
    Intense: "from-red-600/20 to-orange-600/5 border-red-500/20 text-red-200",
};

export function TimelineItem({ memory, idx }: TimelineItemProps) {
    const isLeft = idx % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn("relative flex items-center md:w-1/2 mb-12", isLeft ? "md:self-start md:pr-12" : "md:self-end md:pl-12")}
        >
            {/* Timeline Dot */}
            <div
                className={cn(
                    "absolute top-8 w-4 h-4 rounded-full bg-accent-primary shadow-[0_0_15px_rgba(139,92,246,0.5)] z-20 hidden md:block",
                    isLeft ? "-right-2" : "-left-2"
                )}
            />

            <GlassCard className={cn("w-full bg-gradient-to-br", moodColors[memory.mood] || "from-white/5 to-transparent")}>
                {memory.image && (
                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden group">
                        <Image
                            src={memory.image}
                            alt={memory.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                )}

                <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/5 border border-white/5", moodColors[memory.mood]?.split(' ')[3])}>
                        {memory.mood}
                    </span>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                        <Calendar size={12} />
                        {memory.date}
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-white">{memory.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{memory.description}</p>

                <Link href={`/memory/${memory.id}`}>
                    <button className="flex items-center gap-2 text-xs font-bold text-accent-secondary hover:text-white transition-colors uppercase tracking-widest group">
                        View Memory <Eye size={12} className="group-hover:scale-125 transition-transform" />
                    </button>
                </Link>
            </GlassCard>
        </motion.div>
    );
}
