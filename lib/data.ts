
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---

export type MoodType = "Happy" | "Sad" | "Achievement" | "Lesson" | "Love" | "Growth" | "Calm" | "Intense";

export interface Memory {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    mood: MoodType;
    description: string;
    fullStory?: string;
    image?: string;
    tags?: string[];
    chapter?: string;
}

export interface Value {
    id: string;
    label: string;
    description: string;
    color: string;
}

export interface LifeChapter {
    id: string;
    title: string;
    period: string; // e.g. "2018 - 2022"
    description: string;
    image?: string;
}

// --- Data ---

export const moods: MoodType[] = [
    "Happy", "Sad", "Achievement", "Lesson", "Love", "Growth", "Calm", "Intense"
];

export const coreValues: Value[] = [
    { id: "1", label: "Discipline", description: "Consistency over intensity.", color: "bg-blue-500" },
    { id: "2", label: "Growth", description: "Always evolving, never stagnant.", color: "bg-green-500" },
    { id: "3", label: "Curiosity", description: "Asking why, exploring how.", color: "bg-purple-500" },
    { id: "4", label: "Resilience", description: "Bouncing back stronger.", color: "bg-red-500" },
    { id: "5", label: "Purpose", description: "Driven by meaning.", color: "bg-amber-500" },
];

export const lifeChapters: LifeChapter[] = [
    { id: "1", title: "The Early Days", period: "2015 - 2018", description: "School days and initial discoveries.", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop" },
    { id: "2", title: "University Life", period: "2018 - 2022", description: "Expanding horizons and building foundations.", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop" },
    { id: "3", title: "Career Beginnings", period: "2022 - Present", description: "Entering the professional world.", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000&auto=format&fit=crop" },
];

// Helper to generate random memories for "bulk" data simulation
const generateMemories = (count: number): Memory[] => {
    // Seeded random generator for consistent data across server/client
    let seed = 12345;
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const baseMemories: Memory[] = [
        {
            id: "1",
            title: "First Lines of Code",
            date: "2020-03-15",
            mood: "Achievement",
            description: "Writing 'Hello World' and realizing the power of creation.",
            fullStory: "It was a rainy Sunday. I sat down with an old laptop and opened a terminal. The cursor blinked...",
            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
            tags: ["#coding", "#beginning"],
            chapter: "The Early Days"
        },
        {
            id: "2",
            title: "A Quiet Morning",
            date: "2021-06-21",
            mood: "Calm",
            description: "Sunrise over the mountains. Absolute silence.",
            fullStory: "The air was crisp. No notifications, no noise. Just the sun rising...",
            image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop",
            tags: ["#nature", "#peace"],
            chapter: "University Life"
        },
        {
            id: "3",
            title: "The Hardest Goodbye",
            date: "2022-11-04",
            mood: "Sad",
            description: "Letting go is the hardest part of growth.",
            fullStory: "We stood at the station. Words failed us, but the silence said everything...",
            image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=2080&auto=format&fit=crop",
            tags: ["#relationship", "#loss"],
            chapter: "University Life"
        },
        {
            id: "4",
            title: "Finding My Path",
            date: "2023-01-10",
            mood: "Growth",
            description: "Deciding to pursue what truly matters.",
            fullStory: "I realized I was climbing a ladder on the wrong wall. I took a breath and stepped off...",
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
            tags: ["#career", "#self-discovery"],
            chapter: "Career Beginnings"
        },
        {
            id: "5",
            title: "Graduation Day",
            date: "2023-05-20",
            mood: "Achievement",
            description: "Four years of hard work culminating in this moment.",
            fullStory: "The cap thrown in the air symbolized more than just a degree...",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
            tags: ["#education", "#milestone"],
            chapter: "University Life"
        },
        // Adding more specific memories to flesh out the timeline
        {
            id: "6",
            title: "First Solo Trip",
            date: "2022-07-15",
            mood: "Growth",
            description: "Traveling alone to a new city. Scared but excited.",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
            tags: ["#travel", "#independence"],
            chapter: "University Life"
        },
        {
            id: "7",
            title: "Late Night Coding",
            date: "2023-11-02",
            mood: "Intense",
            description: "Debugging until sunrise. The breakthrough moment.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
            tags: ["#coding", "#work"],
            chapter: "Career Beginnings"
        },
        {
            id: "8",
            title: "Family Reunion",
            date: "2021-12-25",
            mood: "Love",
            description: "Everyone together after a long time.",
            image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop",
            tags: ["#family", "#holidays"],
            chapter: "University Life"
        },
        {
            id: "9",
            title: "Failed Project",
            date: "2023-03-10",
            mood: "Lesson",
            description: "It didn't work out, but I learned so much.",
            tags: ["#failure", "#learning"],
            chapter: "University Life"
        },
        {
            id: "10",
            title: "New Apartment",
            date: "2023-09-01",
            mood: "Happy",
            description: "Keys to my own place. A new beginning.",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
            tags: ["#home", "#adulting"],
            chapter: "Career Beginnings"
        }
    ];

    // Generate deterministic filler memories to reach count
    const generated: Memory[] = [];
    const interactions = ["Coffee with friends", "Read a good book", "Workout session", "Project meeting", "Walk in the park", "Cooking dinner", "Movie night", "Learning Rust", "Meditation", "Rainy day"];

    for (let i = 0; i < count - baseMemories.length; i++) {
        // Deterministic date within last 2 years
        const dateOffset = Math.floor(random() * 2 * 365 * 24 * 60 * 60 * 1000);
        const date = new Date(Date.now() - dateOffset).toISOString().split('T')[0];

        const mood = moods[Math.floor(random() * moods.length)];
        const title = interactions[Math.floor(random() * interactions.length)];

        generated.push({
            id: `gen-${i}`,
            title: `${title} ${i + 1}`,
            date,
            mood,
            description: `Auto-generated memory of a ${mood.toLowerCase()} moment.`,
            tags: ["#daily"],
            chapter: "Career Beginnings"
        });
    }

    return [...baseMemories, ...generated].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const memories: Memory[] = generateMemories(60);

// --- Analytics Helpers ---

export function getDominantMood(memories: Memory[]): string {
    if (memories.length === 0) return "Neutral";
    const counts: Record<string, number> = {};
    memories.forEach(m => {
        counts[m.mood] = (counts[m.mood] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

export function getMoodTrends(memories: Memory[]) {
    // Group by month for chart data
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toISOString().slice(0, 7); // YYYY-MM
    }).reverse();

    return last6Months.map(month => {
        const monthlyMemories = memories.filter(m => m.date.startsWith(month));
        // Calculate a "positivity score" for the month (simple heuristic)
        // Happy/Achievement/Love/Calm/Growth = +1, Sad/Intense = 0, Lesson = +0.5
        let score = 0;
        if (monthlyMemories.length > 0) {
            const sum = monthlyMemories.reduce((acc, m) => {
                if (["Happy", "Achievement", "Love", "Calm", "Growth"].includes(m.mood)) return acc + 10;
                if (["Lesson"].includes(m.mood)) return acc + 5;
                return acc + 2; // Sad/Intense still counts as experience
            }, 0);
            score = Math.round(sum / monthlyMemories.length);
        }

        return {
            name: new Date(month + "-01").toLocaleDateString('en-US', { month: 'short' }),
            score: score,
            count: monthlyMemories.length
        };
    });
}
