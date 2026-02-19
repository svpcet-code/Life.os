const BASE_URL = 'http://localhost:3000/api';
let cookie = '';

async function request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (cookie) headers['Cookie'] = cookie;

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    // Extract cookie from login/register response
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        cookie = setCookie.split(';')[0];
    }

    return res;
}

async function testAuth() {
    console.log('\n🔐 Testing Authentication...');
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    // Register
    console.log(`  POST /auth/register (${email})`);
    const regRes = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test User', email, password })
    });

    if (!regRes.ok) {
        console.error('  Register Failed:', await regRes.text());
        return false;
    }
    console.log('  Registered & Logged in (Cookie set)');

    // Me
    console.log('  GET /auth/me');
    const meRes = await request('/auth/me');
    if (!meRes.ok) {
        console.error('  Auth Me Failed:', await meRes.text());
        return false;
    }
    const me = await meRes.json();
    console.log('  Authenticated as:', me.user.email);
    return true;
}

async function testFeature(feature, payload, updatePayload) {
    console.log(`\n📦 Testing ${feature}...`);

    // Create
    console.log('  POST (Create)');
    const createRes = await request(`/${feature}`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (!createRes.ok) {
        console.error(`  Create Failed: ${createRes.status}`);
        console.error('  ', await createRes.text());
        return false;
    }
    const created = await createRes.json();
    console.log('  Created ID:', created.id);

    // Read
    console.log('  GET (Read All)');
    const readRes = await request(`/${feature}`);
    const items = await readRes.json();
    const found = items.find(i => i.id === created.id);
    if (!found) {
        console.error('  Read Failed: Item not found');
        return false;
    }

    // Message vault specific check
    if (feature === 'messages') {
        console.log('  Message locking check:', found.isLocked ? '✅ Locked' : '❌ Not Locked');
    }

    // Delete (if supported, messages might not have delete in my implemented route, let's check)
    // My memory route has delete. Moods/Messages didn't implement DELETE in route.js in previous steps?
    // Let's check. 
    // I only implemented DELETE for Memories.

    if (feature === 'memories') {
        console.log('  DELETE');
        const delRes = await request(`/${feature}?id=${created.id}`, { method: 'DELETE' });
        if (!delRes.ok) {
            console.error('  Delete Failed');
            return false;
        }
        console.log('  Deleted successfully');
    }

    return true;
}

async function runTests() {
    console.log('🚀 Starting Life.OS API Tests...');

    try {
        if (!await testAuth()) process.exit(1);

        const memoriesOk = await testFeature('memories',
            { title: 'Test Memory', description: 'Testing...', mood: 'happy' }
        );

        const moodsOk = await testFeature('moods',
            { value: 8, moodType: 'excited' }
        );

        const messagesOk = await testFeature('messages',
            { content: 'Future Self', unlockAt: new Date(Date.now() + 86400000).toISOString() }
        );

        if (memoriesOk && moodsOk && messagesOk) {
            console.log('\n✅ ALL SYSTEM TESTS PASSED');
            process.exit(0);
        } else {
            console.error('\n❌ SOME TESTS FAILED');
            process.exit(1);
        }
    } catch (err) {
        console.error('Test Error:', err);
        process.exit(1);
    }
}

runTests();
