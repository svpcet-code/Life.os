import { userService } from '@/services/userService';
import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate input
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const { name, email, password } = validation.data;

        // Check if user exists
        const existingUser = await userService.getByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await userService.create({
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        });

        // Auto-login (create session)
        // We don't store password in session
        await login({ id: newUser.id, email: newUser.email, name: newUser.name });

        return NextResponse.json({
            message: 'User registered successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
