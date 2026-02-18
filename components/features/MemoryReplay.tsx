"use client";

import { Memory } from "@/lib/data";
import { useImmersive } from "@/lib/contexts/ImmersiveContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Play, Pause, SkipForward, Music } from "lucide-react";
import Image from "next/image";

interface MemoryReplayProps {
    memories: Memory[];
    onClose: () => void;
}

export function MemoryReplay({ memories, onClose }: MemoryReplayProps) {
    const { enableImmersive, disableImmersive } = useImmersive();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(false);

    // Auto-enable immersive mode on mount, disable on unmount
    useEffect(() => {
        enableImmersive();
        return () => disableImmersive();
    }, [enableImmersive, disableImmersive]);

    // Slideshow logic
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setTimeout(() => {
            if (currentIndex < memories.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setIsPlaying(false); // Stop at end
            }
        }, 5000); // 5 seconds per memory

        return () => clearTimeout(timer);
    }, [currentIndex, isPlaying, memories.length]);

    const currentMemory = memories[currentIndex];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
            onMouseMove={() => {
                setShowControls(true);
                // Hide after 3s of inactivity could be added here
            }}
        >
            {/* Background Image (Blurred) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMemory.id + "-bg"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 z-0"
                >
                    {currentMemory.image && (
                        <Image
                            src={currentMemory.image}
                            alt="Background"
                            fill
                            className="object-cover blur-3xl scale-110"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                </motion.div>
            </AnimatePresence>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMemory.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 1 }} // Slow, cinematic transition
                    className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center"
                >
                    <div className="mb-8 relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                        {currentMemory.image ? (
                            <Image
                                src={currentMemory.image}
                                alt={currentMemory.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                <span className="text-gray-500 italic">No visual record</span>
                            </div>
                        )}

                        {/* Ken Burns effect overlay could go here */}
                    </div>

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-medium uppercase tracking-widest text-white/80 mb-4 bg-black/20 backdrop-blur-md">
                                {currentMemory.date} • {currentMemory.mood}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                                {currentMemory.title}
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                                "{currentMemory.description}"
                            </p>
                        </motion.div>
                    </div>

                </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex gap-1">
                {memories.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: idx < currentIndex ? "100%" : idx === currentIndex && isPlaying ? "100%" : "0%" }}
                            transition={idx === currentIndex && isPlaying ? { duration: 5, ease: "linear" } : { duration: 0 }}
                            className="h-full bg-white"
                        />
                    </div>
                ))}
            </div>


            {/* Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
                className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-8"
            >
                <button onClick={onClose} className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors">
                    <X size={24} />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-6 rounded-full bg-white text-black hover:scale-105 transition-transform"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                </button>

                <button
                    onClick={() => {
                        if (currentIndex < memories.length - 1) setCurrentIndex(prev => prev + 1);
                    }}
                    className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
                >
                    <SkipForward size={24} />
                </button>
            </motion.div>

            {/* Music Indicator (Fake) */}
            <div className="absolute bottom-10 right-10 z-20 flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest animate-pulse">
                <Music size={14} />
                <span>Ambient: Ethereal Drift</span>
            </div>

        </motion.div>
    );
}
