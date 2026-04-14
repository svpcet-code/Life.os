import path from 'path';
import fs from 'fs';

const defaultData = {
    users: [],
    memories: [],
    moods: [],
    messages: [],
    gallery: [],
    tasks: []
};

const dbPath = path.join(process.cwd(), 'data.json');

// Simple in-memory cache
let cache = null;

function readFromDisk() {
    try {
        const raw = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { ...defaultData };
    }
}

function writeToDisk(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch {
        // On Vercel, writes fail silently — data is in-memory only for this request
        return false;
    }
}

export default async function getDb() {
    // Always read fresh from disk (handles Vercel cold starts)
    const data = readFromDisk();

    // Ensure all collections exist
    data.users ||= [];
    data.memories ||= [];
    data.moods ||= [];
    data.messages ||= [];
    data.gallery ||= [];
    data.tasks ||= [];

    return {
        data,
        write: async () => {
            writeToDisk(data);
        }
    };
}
