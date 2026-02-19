import { userService } from '@/services/userService';
import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate input
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const { email, password } = validation.data;

        // Find user
        const user = await userService.getByEmail(email);
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        await login({ id: user.id, email: user.email, name: user.name });

        return NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
