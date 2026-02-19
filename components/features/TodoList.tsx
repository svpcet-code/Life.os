'use client';
import { useState, useEffect, FormEvent } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export function TodoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        const res = await fetch('/api/tasks');
        if (res.ok) setTasks(await res.json());
    }

    async function addTask(e: FormEvent) {
        e.preventDefault();
        if (!newTask.trim()) return;

        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newTask })
        });

        if (res.ok) {
            const task = await res.json();
            setTasks([task, ...tasks]);
            setNewTask('');
        }
    }

    async function toggleTask(id: string, completed: boolean) {
        // Optimistic update
        setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));

        await fetch('/api/tasks', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, completed })
        });
    }

    async function deleteTask(id: string) {
        setTasks(tasks.filter(t => t.id !== id));
        await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    }

    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <GlassCard className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Daily Tasks</h3>
                <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                    {completedCount} / {tasks.length} Done
                </span>
            </div>

            <form onSubmit={addTask} className="mb-4 relative">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
                <button
                    type="submit"
                    disabled={!newTask.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500/20 text-indigo-400 rounded-md hover:bg-indigo-500/40 disabled:opacity-0 transition-all"
                >
                    <Plus size={16} />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm italic">
                        No tasks yet. Start your day!
                    </div>
                )}
                <AnimatePresence initial={false}>
                    {tasks.map(task => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="group flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <button
                                onClick={() => toggleTask(task.id, !task.completed)}
                                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-green-400' : 'text-gray-500 hover:text-indigo-400'}`}
                            >
                                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>

                            <span className={`flex-1 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
