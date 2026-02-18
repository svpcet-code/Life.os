"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

interface GlassCardProps extends ComponentProps<typeof motion.div> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={
                hoverEffect
                    ? {
                        y: -5,
                        boxShadow: "0 15px 30px rgba(139, 92, 246, 0.2)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                    }
                    : {}
            }
            className={cn(
                "glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
