import getDb from '@/lib/db';

export const taskService = {
    async getAll(userId) {
        const db = await getDb();
        return db.data.tasks
            .filter(t => t.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async create(task) {
        const db = await getDb();
        db.data.tasks.push(task);
        await db.write();
        return task;
    },

    async update(id, userId, updates) {
        const db = await getDb();
        const task = db.data.tasks.find(t => t.id === id && t.userId === userId);
        if (!task) return null;

        Object.assign(task, updates);
        await db.write();
        return task;
    },

    async delete(id, userId) {
        const db = await getDb();
        const initialLength = db.data.tasks.length;
        db.data.tasks = db.data.tasks.filter(t => !(t.id === id && t.userId === userId));
        await db.write();
        return db.data.tasks.length < initialLength;
    }
};
