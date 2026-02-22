"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, Quote } from "lucide-react";

const QUOTES = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
    { text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
    { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "You become what you believe.", author: "Oprah Winfrey" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
    { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
    { text: "Great minds discuss ideas; small minds discuss people.", author: "Eleanor Roosevelt" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "An unexamined life is not worth living.", author: "Socrates" },
    { text: "Spread love everywhere you go.", author: "Mother Teresa" },
    { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
    { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
    { text: "Do not go where the path may lead; go instead where there is no path.", author: "Ralph Waldo Emerson" },
    { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time.", author: "Nelson Mandela" },
    { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
    { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
    { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
    { text: "Many of life's failures are people who did not realize how close they were to success.", author: "Thomas A. Edison" },
];

function getDailyQuote() {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
}

function getGreeting(hour: number) {
    if (hour < 5) return "🌙 Good Night";
    if (hour < 12) return "🌅 Good Morning";
    if (hour < 17) return "☀️ Good Afternoon";
    if (hour < 21) return "🌆 Good Evening";
    return "🌙 Good Night";
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

export function DailyWidget() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const ticker = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(ticker);
    }, []);

    if (!now) return null;

    const quote = getDailyQuote();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = (h % 12 || 12).toString().padStart(2, "0");

    const dayName = DAYS[now.getDay()];
    const dateStr = `${dayName}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-2xl mx-auto mt-12 mb-2"
        >
            {/* Glass container */}
            <div className="relative rounded-2xl overflow-hidden"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 8px 40px rgba(99,102,241,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)"
                }}
            >
                {/* Subtle glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

                <div className="px-8 py-7 flex flex-col items-center gap-5">

                    {/* Greeting */}
                    <motion.p
                        key={getGreeting(h)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300/70"
                    >
                        {getGreeting(h)}
                    </motion.p>

                    {/* Clock */}
                    <div className="flex items-end gap-2">
                        <div className="flex items-end gap-1">
                            <span className="text-6xl font-bold tabular-nums tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-none">
                                {h12}:{m}
                            </span>
                            <span className="text-2xl font-bold tabular-nums text-white/30 leading-none mb-1">
                                :{s}
                            </span>
                        </div>
                        <span className="text-lg font-bold text-indigo-400/80 mb-1">{ampm}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} className="text-indigo-400/60" />
                        <span>{dateStr}</span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Daily Quote */}
                    <div className="flex flex-col items-center gap-3 text-center px-2">
                        <Quote size={16} className="text-indigo-400/50 rotate-180" />
                        <AnimatePresence mode="wait">
                            <motion.blockquote
                                key={quote.text}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.5 }}
                                className="text-sm md:text-base text-gray-300 leading-relaxed italic"
                            >
                                "{quote.text}"
                            </motion.blockquote>
                        </AnimatePresence>
                        <p className="text-xs font-semibold tracking-wider text-indigo-400/70 uppercase">
                            — {quote.author}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
