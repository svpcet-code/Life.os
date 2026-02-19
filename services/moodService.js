import getDb from '@/lib/db';

export const moodService = {
    async getAll(userId) {
        const db = await getDb();
        return db.data.moods.filter(m => m.userId === userId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    async create(mood) {
        const db = await getDb();
        db.data.moods.push(mood);
        await db.write();
        return mood;
    }
};
