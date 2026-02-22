import { JSONFilePreset } from 'lowdb/node';
import path from 'path';

const defaultData = {
    users: [],
    memories: [],
    moods: [],
    messages: [],
    gallery: [],
    tasks: []
};

// Use absolute path so it works both locally and on Vercel
const dbPath = path.join(process.cwd(), 'data.json');
const dbPromise = JSONFilePreset(dbPath, defaultData);

export default async function getDb() {
    const db = await dbPromise;
    await db.read(); // Ensure we have the latest data
    // Initialize defaults if they don't exist
    db.data ||= defaultData;
    db.data.users ||= [];
    db.data.memories ||= [];
    db.data.moods ||= [];
    db.data.messages ||= [];
    db.data.gallery ||= [];
    db.data.tasks ||= [];
    return db;
}
