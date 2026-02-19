import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'secret-key-life-os-hackathon';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Session lasts 24 hours
        .sign(key);
}

export async function decrypt(input) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function login(userData) {
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: userData, expires });

    // Save the session in a cookie
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true });
}

export async function logout() {
    // Destroy the session
    const cookieStore = await cookies();
    cookieStore.set('session', '', { expires: new Date(0) });
}
