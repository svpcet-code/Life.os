'use client';
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Plus } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Mood {
    id: string;
    value: number;
    moodType: string;
    createdAt: string;
}

export default function MoodsPage() {
    const [moods, setMoods] = useState<Mood[]>([]);

    useEffect(() => { fetchMoods(); }, []);

    async function fetchMoods() {
        const res = await fetch('/api/moods');
        if (res.ok) setMoods(await res.json());
    }

    async function handleLog(value: number, type: string) {
        await fetch('/api/moods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value, moodType: type })
        });
        fetchMoods();
    }

    const chartData = {
        labels: moods.map(m => new Date(m.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Mood Intensity',
                data: moods.map(m => m.value),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const, labels: { color: 'white' } },
        },
        scales: {
            y: { min: 0, max: 10, ticks: { color: 'gray' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: 'gray' }, grid: { display: false } }
        }
    };

    return (
        <div className="p-8 pt-24 mx-auto max-w-6xl space-y-6">
            <h1 className="text-3xl font-bold text-white">Mood Analysis</h1>

            <div className="grid gap-6 lg:grid-cols-3">
                <GlassCard className="lg:col-span-2">
                    <Line options={options} data={chartData} />
                </GlassCard>

                <GlassCard>
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Log</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { l: 'Happy', v: 8, t: 'happy', c: 'bg-green-500/20 text-green-300' },
                            { l: 'Excited', v: 9, t: 'excited', c: 'bg-yellow-500/20 text-yellow-300' },
                            { l: 'Calm', v: 7, t: 'calm', c: 'bg-blue-500/20 text-blue-300' },
                            { l: 'Neutral', v: 5, t: 'neutral', c: 'bg-gray-500/20 text-gray-300' },
                            { l: 'Anxious', v: 4, t: 'anxious', c: 'bg-orange-500/20 text-orange-300' },
                            { l: 'Sad', v: 3, t: 'sad', c: 'bg-red-500/20 text-red-300' },
                        ].map((btn) => (
                            <button
                                key={btn.l}
                                onClick={() => handleLog(btn.v, btn.t)}
                                className={`p-4 rounded-xl font-medium transition-transform hover:scale-105 ${btn.c}`}
                            >
                                {btn.l}
                            </button>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
