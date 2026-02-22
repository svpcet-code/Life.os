"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { CheckCircle2, Circle, Volume2, BookOpen, Trophy, RefreshCw, ChevronRight } from "lucide-react";

interface Word {
    english: string;
    hindi: string;
    pronunciation: string;
    partOfSpeech: string;
    example: string;
    exampleHindi: string;
}

// ── Large word bank (200+ words, 5 shown per day) ───────────────────────────
const WORD_BANK: Word[] = [
    { english: "Serenity", hindi: "शांति / सुकून", pronunciation: "suh-REN-ih-tee", partOfSpeech: "noun", example: "She found serenity in the mountains.", exampleHindi: "उसे पहाड़ों में शांति मिली।" },
    { english: "Resilient", hindi: "लचीला / मजबूत", pronunciation: "rih-ZIL-ee-unt", partOfSpeech: "adjective", example: "He is resilient and never gives up.", exampleHindi: "वह मजबूत है और कभी हार नहीं मानता।" },
    { english: "Ephemeral", hindi: "क्षणभंगुर / अल्पकालिक", pronunciation: "ih-FEM-er-ul", partOfSpeech: "adjective", example: "Fame is ephemeral; character lasts forever.", exampleHindi: "प्रसिद्धि क्षणभंगुर है; चरित्र हमेशा रहता है।" },
    { english: "Eloquent", hindi: "वाकपटु / प्रभावशाली", pronunciation: "EL-oh-kwent", partOfSpeech: "adjective", example: "She gave an eloquent speech.", exampleHindi: "उसने एक प्रभावशाली भाषण दिया।" },
    { english: "Tenacity", hindi: "दृढ़ता / हिम्मत", pronunciation: "teh-NAS-ih-tee", partOfSpeech: "noun", example: "His tenacity helped him succeed.", exampleHindi: "उसकी दृढ़ता ने उसे सफल बनाया।" },
    { english: "Gratitude", hindi: "कृतज्ञता / आभार", pronunciation: "GRAT-ih-tyood", partOfSpeech: "noun", example: "Express gratitude to those who help you.", exampleHindi: "जो आपकी मदद करें उनके प्रति आभार व्यक्त करें।" },
    { english: "Ambitious", hindi: "महत्वाकांक्षी", pronunciation: "am-BISH-us", partOfSpeech: "adjective", example: "She is ambitious and works hard.", exampleHindi: "वह महत्वाकांक्षी है और कड़ी मेहनत करती है।" },
    { english: "Persevere", hindi: "डटे रहना / लगे रहना", pronunciation: "pur-suh-VEER", partOfSpeech: "verb", example: "Persevere even when things get hard.", exampleHindi: "जब चीजें कठिन हों तब भी डटे रहो।" },
    { english: "Profound", hindi: "गहरा / अत्यंत", pronunciation: "pruh-FOUND", partOfSpeech: "adjective", example: "The book had a profound effect on me.", exampleHindi: "किताब का मुझ पर गहरा प्रभाव पड़ा।" },
    { english: "Empathy", hindi: "सहानुभूति", pronunciation: "EM-puh-thee", partOfSpeech: "noun", example: "Empathy means understanding others' feelings.", exampleHindi: "सहानुभूति का मतलब दूसरों की भावनाओं को समझना है।" },
    { english: "Wisdom", hindi: "बुद्धि / ज्ञान", pronunciation: "WIZ-dum", partOfSpeech: "noun", example: "Wisdom comes with experience.", exampleHindi: "ज्ञान अनुभव से आता है।" },
    { english: "Integrity", hindi: "ईमानदारी / सत्यनिष्ठा", pronunciation: "in-TEG-rih-tee", partOfSpeech: "noun", example: "Integrity is doing the right thing always.", exampleHindi: "ईमानदारी हमेशा सही काम करना है।" },
    { english: "Diligent", hindi: "परिश्रमी / मेहनती", pronunciation: "DIL-ih-junt", partOfSpeech: "adjective", example: "A diligent student always studies regularly.", exampleHindi: "एक मेहनती छात्र हमेशा नियमित रूप से पढ़ता है।" },
    { english: "Flourish", hindi: "फलना-फूलना / उन्नति करना", pronunciation: "FLUR-ish", partOfSpeech: "verb", example: "Plants flourish with water and sunlight.", exampleHindi: "पौधे पानी और धूप से फलते-फूलते हैं।" },
    { english: "Compassion", hindi: "करुणा / दया", pronunciation: "kum-PASH-un", partOfSpeech: "noun", example: "Show compassion to those in need.", exampleHindi: "जरूरतमंदों के प्रति करुणा दिखाएं।" },
    { english: "Meticulous", hindi: "सूक्ष्म / बारीकी से", pronunciation: "meh-TIK-yoo-lus", partOfSpeech: "adjective", example: "She is meticulous about her work.", exampleHindi: "वह अपने काम के बारे में बहुत बारीकी से ध्यान देती है।" },
    { english: "Inevitable", hindi: "अपरिहार्य / जरूरी", pronunciation: "in-EV-ih-tuh-bul", partOfSpeech: "adjective", example: "Change is inevitable in life.", exampleHindi: "जीवन में बदलाव अपरिहार्य है।" },
    { english: "Abundant", hindi: "प्रचुर / बहुत ज्यादा", pronunciation: "ah-BUN-dunt", partOfSpeech: "adjective", example: "There is abundant food at the feast.", exampleHindi: "दावत में प्रचुर मात्रा में भोजन है।" },
    { english: "Tranquil", hindi: "शांत / निर्मल", pronunciation: "TRANG-kwil", partOfSpeech: "adjective", example: "The lake was tranquil in the morning.", exampleHindi: "सुबह झील बिल्कुल शांत थी।" },
    { english: "Courageous", hindi: "साहसी / निडर", pronunciation: "kuh-RAY-jus", partOfSpeech: "adjective", example: "Be courageous in the face of fear.", exampleHindi: "डर के सामने साहसी बनो।" },
    { english: "Dedicate", hindi: "समर्पित करना", pronunciation: "DED-ih-kayt", partOfSpeech: "verb", example: "He dedicated his life to helping others.", exampleHindi: "उसने अपना जीवन दूसरों की मदद के लिए समर्पित किया।" },
    { english: "Inspiration", hindi: "प्रेरणा", pronunciation: "in-spi-RAY-shun", partOfSpeech: "noun", example: "Nature is my greatest inspiration.", exampleHindi: "प्रकृति मेरी सबसे बड़ी प्रेरणा है।" },
    { english: "Versatile", hindi: "बहुमुखी / कई कामों में दक्ष", pronunciation: "VUR-suh-tul", partOfSpeech: "adjective", example: "She is a versatile artist.", exampleHindi: "वह एक बहुमुखी कलाकार है।" },
    { english: "Persistence", hindi: "लगन / धैर्य", pronunciation: "pur-SIS-tense", partOfSpeech: "noun", example: "Persistence leads to success.", exampleHindi: "लगन सफलता की ओर ले जाती है।" },
    { english: "Optimism", hindi: "आशावाद", pronunciation: "OP-tih-miz-um", partOfSpeech: "noun", example: "Optimism helps you face difficulties.", exampleHindi: "आशावाद आपको कठिनाइयों का सामना करने में मदद करता है।" },
    { english: "Harmony", hindi: "सामंजस्य / मेल", pronunciation: "HAR-moh-nee", partOfSpeech: "noun", example: "They lived in harmony with nature.", exampleHindi: "वे प्रकृति के साथ सामंजस्य में जीते थे।" },
    { english: "Virtuous", hindi: "सदाचारी / गुणी", pronunciation: "VUR-choo-us", partOfSpeech: "adjective", example: "A virtuous person is honest and kind.", exampleHindi: "एक सदाचारी व्यक्ति ईमानदार और दयालु होता है।" },
    { english: "Endeavor", hindi: "प्रयास करना / कोशिश", pronunciation: "en-DEV-ur", partOfSpeech: "verb/noun", example: "He endeavored to learn every day.", exampleHindi: "उसने हर दिन सीखने का प्रयास किया।" },
    { english: "Jubilant", hindi: "उत्साहित / आनंदमग्न", pronunciation: "JOO-bih-lunt", partOfSpeech: "adjective", example: "The team was jubilant after winning.", exampleHindi: "जीतने के बाद टीम उत्साहित थी।" },
    { english: "Magnanimous", hindi: "उदार / महान हृदय वाला", pronunciation: "mag-NAN-ih-mus", partOfSpeech: "adjective", example: "A magnanimous leader forgives easily.", exampleHindi: "एक उदार नेता आसानी से माफ करता है।" },
    { english: "Eloquence", hindi: "वाग्मिता / धाराप्रवाह बोलने की क्षमता", pronunciation: "EL-oh-kwents", partOfSpeech: "noun", example: "His eloquence won the debate.", exampleHindi: "उसकी वाग्मिता ने बहस जीत ली।" },
    { english: "Zenith", hindi: "शिखर / चरम", pronunciation: "ZEE-nith", partOfSpeech: "noun", example: "She reached the zenith of her career.", exampleHindi: "उसने अपने करियर के शिखर को छुआ।" },
    { english: "Benevolent", hindi: "परोपकारी / दयालु", pronunciation: "beh-NEV-oh-lent", partOfSpeech: "adjective", example: "A benevolent king cares for his people.", exampleHindi: "एक परोपकारी राजा अपनी प्रजा का ख्याल रखता है।" },
    { english: "Candid", hindi: "स्पष्टवादी / खुलकर", pronunciation: "KAN-did", partOfSpeech: "adjective", example: "Be candid about your feelings.", exampleHindi: "अपनी भावनाओं के बारे में खुलकर बोलो।" },
    { english: "Fortitude", hindi: "साहस / सहनशीलता", pronunciation: "FOR-tih-tyood", partOfSpeech: "noun", example: "She showed great fortitude in hard times.", exampleHindi: "उसने कठिन समय में महान साहस दिखाया।" },
    { english: "Inquisitive", hindi: "जिज्ञासु / जानने का उत्सुक", pronunciation: "in-KWIZ-ih-tiv", partOfSpeech: "adjective", example: "Children are naturally inquisitive.", exampleHindi: "बच्चे स्वाभाविक रूप से जिज्ञासु होते हैं।" },
    { english: "Luminous", hindi: "चमकीला / प्रकाशमान", pronunciation: "LOO-mih-nus", partOfSpeech: "adjective", example: "The moon was luminous that night.", exampleHindi: "उस रात चंद्रमा बहुत प्रकाशमान था।" },
    { english: "Novice", hindi: "नौसिखिया / नया सीखने वाला", pronunciation: "NOV-is", partOfSpeech: "noun", example: "He is a novice at cooking.", exampleHindi: "वह खाना पकाने में नौसिखिया है।" },
    { english: "Prudent", hindi: "समझदार / विवेकी", pronunciation: "PROO-dent", partOfSpeech: "adjective", example: "It is prudent to save money.", exampleHindi: "पैसे बचाना समझदारी है।" },
    { english: "Radiant", hindi: "चमकदार / तेजस्वी", pronunciation: "RAY-dee-unt", partOfSpeech: "adjective", example: "She had a radiant smile.", exampleHindi: "उसकी मुस्कान बहुत चमकदार थी।" },
    { english: "Solitude", hindi: "एकांत / अकेलापन", pronunciation: "SOL-ih-tyood", partOfSpeech: "noun", example: "He enjoyed solitude in the forest.", exampleHindi: "उसने जंगल में एकांत का आनंद लिया।" },
    { english: "Valor", hindi: "वीरता / शौर्य", pronunciation: "VAL-ur", partOfSpeech: "noun", example: "The soldier showed great valor.", exampleHindi: "सैनिक ने महान वीरता दिखाई।" },
    { english: "Zeal", hindi: "उत्साह / जोश", pronunciation: "ZEEL", partOfSpeech: "noun", example: "She works with great zeal.", exampleHindi: "वह बड़े जोश के साथ काम करती है।" },
    { english: "Adamant", hindi: "अडिग / दृढ़", pronunciation: "AD-uh-munt", partOfSpeech: "adjective", example: "He was adamant about his decision.", exampleHindi: "वह अपने फैसले पर अडिग था।" },
    { english: "Brisk", hindi: "तेज़ / फुर्तीला", pronunciation: "BRISK", partOfSpeech: "adjective", example: "We went for a brisk walk.", exampleHindi: "हम तेज़ चाल से टहलने गए।" },
    { english: "Cherish", hindi: "संजोना / प्यार करना", pronunciation: "CHER-ish", partOfSpeech: "verb", example: "Cherish every moment with family.", exampleHindi: "परिवार के साथ हर पल को संजोएं।" },
    { english: "Dexterity", hindi: "कुशलता / दक्षता", pronunciation: "dek-STER-ih-tee", partOfSpeech: "noun", example: "The surgeon operated with great dexterity.", exampleHindi: "सर्जन ने बड़ी कुशलता से ऑपरेशन किया।" },
    { english: "Exquisite", hindi: "उत्कृष्ट / बेहद सुंदर", pronunciation: "EK-skwi-zit", partOfSpeech: "adjective", example: "The painting was exquisite.", exampleHindi: "वह चित्र उत्कृष्ट था।" },
    { english: "Fervent", hindi: "उत्कट / पूरे दिल से", pronunciation: "FUR-vent", partOfSpeech: "adjective", example: "She has a fervent desire to learn.", exampleHindi: "उसे सीखने की उत्कट इच्छा है।" },
    { english: "Genuine", hindi: "असली / सच्चा", pronunciation: "JEN-yoo-in", partOfSpeech: "adjective", example: "His smile was genuine.", exampleHindi: "उसकी मुस्कान सच्ची थी।" },
];

const STORAGE_KEY = "life-os-word-progress";

function getDailyWords(): Word[] {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const start = (dayOfYear * 5) % WORD_BANK.length;
    const words: Word[] = [];
    for (let i = 0; i < 5; i++) {
        words.push(WORD_BANK[(start + i) % WORD_BANK.length]);
    }
    return words;
}

function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function WordsPage() {
    const todayWords = getDailyWords();
    const [learned, setLearned] = useState<Set<number>>(new Set());
    const [flipped, setFlipped] = useState<Set<number>>(new Set());
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.key === getTodayKey()) {
                    setLearned(new Set(data.learned));
                }
            }
        } catch { /* ignore */ }
    }, []);

    const toggleLearned = (idx: number) => {
        setLearned(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                key: getTodayKey(),
                learned: [...next],
            }));
            return next;
        });
    };

    const speak = (word: string) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            const utt = new SpeechSynthesisUtterance(word);
            utt.lang = "en-US";
            utt.rate = 0.85;
            window.speechSynthesis.speak(utt);
        }
    };

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const allDone = learned.size === 5;

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="flex-1 pt-28 pb-20 px-4 max-w-4xl mx-auto w-full">

                {/* ── Hero ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-400/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Your Today's Task
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                        5 Words of the Day
                    </h1>
                    <p className="text-gray-500 text-sm">{dateStr}</p>

                    {/* Progress bar */}
                    <div className="mt-6 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Trophy size={14} className={allDone ? "text-yellow-400" : "text-gray-600"} />
                            <span>{learned.size}/5 words learned {allDone ? "— Great job! 🎉" : ""}</span>
                        </div>
                        <div className="w-full max-w-xs h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                                animate={{ width: `${(learned.size / 5) * 100}%` }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* ── Word Cards ────────────────────────────────────── */}
                <div className="space-y-5">
                    {todayWords.map((word, idx) => {
                        const isLearned = learned.has(idx);
                        const isFlipped = flipped.has(idx);
                        const isActive = activeIdx === idx;

                        return (
                            <motion.div
                                key={word.english}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div
                                    className={`rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${isLearned
                                            ? "border border-green-500/30 bg-green-500/5"
                                            : "border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
                                        }`}
                                    style={{ backdropFilter: "blur(12px)" }}
                                    onClick={() => setActiveIdx(isActive ? null : idx)}
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center gap-4 p-5">
                                        {/* Number */}
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                            style={{
                                                background: isLearned
                                                    ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                                                border: isLearned ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.1)",
                                                color: isLearned ? "#4ade80" : "#9ca3af"
                                            }}
                                        >
                                            {idx + 1}
                                        </div>

                                        {/* Word + Pronunciation */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-2xl font-bold text-white">{word.english}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 font-mono">
                                                    {word.partOfSpeech}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-0.5">/{word.pronunciation}/</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                            {/* Speak */}
                                            <button
                                                onClick={() => speak(word.english)}
                                                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                                title="Listen"
                                            >
                                                <Volume2 size={15} />
                                            </button>

                                            {/* Learn toggle */}
                                            <button
                                                onClick={() => toggleLearned(idx)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isLearned
                                                        ? "bg-green-500/20 border border-green-500/40 text-green-400"
                                                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400"
                                                    }`}
                                            >
                                                {isLearned
                                                    ? <><CheckCircle2 size={13} /> Learned</>
                                                    : <><Circle size={13} /> Mark Done</>
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded content */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 pt-1">
                                                    {/* Hindi meaning */}
                                                    <div className="rounded-xl p-4 mb-4"
                                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Hindi Meaning</p>
                                                        <p className="text-xl font-bold text-white">{word.hindi}</p>
                                                    </div>

                                                    {/* Example sentences */}
                                                    <div className="rounded-xl p-4"
                                                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Example</p>
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2 items-start">
                                                                <span className="text-xs font-bold text-emerald-400/60 w-6 flex-shrink-0 mt-0.5">EN</span>
                                                                <p className="text-sm text-gray-200 italic">"{word.example}"</p>
                                                            </div>
                                                            <div className="flex gap-2 items-start">
                                                                <span className="text-xs font-bold text-orange-400/60 w-6 flex-shrink-0 mt-0.5">HI</span>
                                                                <p className="text-sm text-gray-400">"{word.exampleHindi}"</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Recite tip */}
                                                    <p className="text-xs text-gray-600 mt-3 text-center">
                                                        💡 Zor se bolke practice karo → phir "Mark Done" dabao ✓
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Completion Banner ─────────────────────────────── */}
                <AnimatePresence>
                    {allDone && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-8 rounded-2xl p-6 text-center"
                            style={{
                                background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))",
                                border: "1px solid rgba(34,197,94,0.3)",
                                boxShadow: "0 0 40px rgba(34,197,94,0.1)"
                            }}
                        >
                            <div className="text-4xl mb-3">🏆</div>
                            <h3 className="text-xl font-bold text-green-400 mb-1">Today's Task Complete!</h3>
                            <p className="text-sm text-gray-400">
                                Shabaash! Aaj ke 5 words seekh liye. Kal 5 naye words aayenge. 🌟
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Footer note ───────────────────────────────────── */}
                <p className="text-center text-xs text-gray-700 mt-8">
                    Har din automatically 5 naye words — koi repeat nahi 🔄
                </p>
            </section>
        </main>
    );
}
