import { JSONFilePreset } from 'lowdb/node';

async function test() {
    try {
        const db = await JSONFilePreset('test_data.json', { posts: [] });
        await db.read();
        console.log('LowDB Init Success');
    } catch (err) {
        console.error('LowDB Init Failed:', err);
    }
}

test();
