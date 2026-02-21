import getDb from '@/lib/db';

export const userService = {
    async getByEmail(email) {
        const db = await getDb();
        return db.data.users.find(u => u.email === email);
    },

    async getById(id) {
        const db = await getDb();
        return db.data.users.find(u => u.id === id);
    },

    async create(user) {
        const db = await getDb();
        db.data.users.push(user);
        await db.write();
        return user;
    },

    async updatePassword(email, hashedPassword) {
        const db = await getDb();
        const user = db.data.users.find(u => u.email === email);
        if (!user) return false;
        user.password = hashedPassword;
        await db.write();
        return true;
    }
};
