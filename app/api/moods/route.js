import { moodService } from '@/services/moodService';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const moodSchema = z.object({
    value: z.number().min(1).max(10), // 1-10 intensity
    note: z.string().optional(),
    moodType: z.enum(['happy', 'sad', 'neutral', 'excited', 'calm', 'anxious']).default('neutral'),
});

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const moods = await moodService.getAll(session.user.id);
    return NextResponse.json(moods);
}

export async function POST(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const validation = moodSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const newMood = await moodService.create({
            id: crypto.randomUUID(),
            userId: session.user.id,
            ...validation.data,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json(newMood, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to log mood' }, { status: 500 });
    }
}
