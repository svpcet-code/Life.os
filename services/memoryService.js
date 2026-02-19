import getDb from '@/lib/db';

export const memoryService = {
    async getAll(userId) {
        const db = await getDb();
        return db.data.memories.filter(m => m.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async create(memory) {
        const db = await getDb();
        db.data.memories.push(memory);
        await db.write();
        return memory;
    },

    async delete(id, userId) {
        const db = await getDb();
        const initialLength = db.data.memories.length;
        db.data.memories = db.data.memories.filter(m => !(m.id === id && m.userId === userId));
        await db.write();
        return db.data.memories.length < initialLength;
    }
};
