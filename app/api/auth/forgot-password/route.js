import { userService } from '@/services/userService';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const resetSchema = z.object({
    email: z.string().email('Invalid email address'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate input
        const validation = resetSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email, newPassword } = validation.data;

        // Check if user exists
        const user = await userService.getByEmail(email);
        if (!user) {
            // Return same message to avoid user enumeration
            return NextResponse.json(
                { message: 'If this email is registered, the password has been reset.' },
                { status: 200 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await userService.updatePassword(email, hashedPassword);

        return NextResponse.json(
            { message: 'Password reset successful! You can now log in.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
