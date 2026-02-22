import getDb from '@/lib/db';

export const messageService = {
    async getAll(userId) {
        const db = await getDb();
        const now = new Date();

        // Auto-unlock logic check (simplified for read)
        // In a real app, strict unlock logic might hide content
        return db.data.messages.filter(m => m.userId === userId).map(msg => {
            const isUnlocked = new Date(msg.unlockAt) <= now;
            return {
                ...msg,
                isLocked: !isUnlocked,
                content: isUnlocked ? msg.content : "🔒 Locked until " + new Date(msg.unlockAt).toLocaleDateString()
            };
        });
    },

    async create(message) {
        const db = await getDb();
        db.data.messages.push(message);
        await db.write();
        return message;
    },

    async delete(id, userId) {
        const db = await getDb();
        db.data.messages = db.data.messages.filter(
            m => !(m.id === id && m.userId === userId)
        );
        await db.write();
    }
};
