import { memoryService } from '@/services/memoryService';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const memorySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    mood: z.enum(['happy', 'sad', 'neutral', 'excited', 'calm', 'anxious']).default('neutral'),
});

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const memories = await memoryService.getAll(session.user.id);
    return NextResponse.json(memories);
}

export async function POST(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const validation = memorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const newMemory = await memoryService.create({
            id: crypto.randomUUID(),
            userId: session.user.id,
            ...validation.data,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json(newMemory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const success = await memoryService.delete(id, session.user.id);

    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ message: 'Deleted successfully' });
}
