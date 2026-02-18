"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Memory, getMoodTrends } from "@/lib/data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";

interface EmotionalChartProps {
    memories: Memory[];
}

export function EmotionalChart({ memories }: EmotionalChartProps) {
    const data = getMoodTrends(memories);

    return (
        <GlassCard className="p-6 h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Emotional Frequency</h3>
                <p className="text-gray-400 text-sm">6-month trend analysis of memory valence.</p>
            </div>

            <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#9ca3af' }}
                        />
                        <YAxis
                            hide
                            domain={[0, 10]} // Assuming max score is around 10
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                            formatter={(value: any) => [`${value} Index`, 'Positivity']}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
