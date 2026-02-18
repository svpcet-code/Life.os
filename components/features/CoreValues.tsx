"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { coreValues } from "@/lib/data";
import { motion } from "framer-motion";

export function CoreValues() {
    return (
        <section className="py-8">
            <h3 className="text-xl font-bold text-white mb-6 px-1">Core Identity Pillars</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {coreValues.map((value, i) => (
                    <motion.div
                        key={value.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="p-6 h-full flex flex-col items-center text-center hover:bg-white/10 transition-colors group cursor-default">
                            <div className={`w-3 h-3 rounded-full ${value.color} mb-4 shadow-[0_0_10px_currentColor] group-hover:scale-125 transition-transform`} />
                            <h4 className="text-lg font-bold text-white mb-2">{value.label}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {value.description}
                            </p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
