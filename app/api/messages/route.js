import { messageService } from '@/services/messageService';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const messageSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    unlockAt: z.string().datetime(), // ISO Date string
});

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const messages = await messageService.getAll(session.user.id);
    return NextResponse.json(messages);
}

export async function POST(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const validation = messageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const newMessage = await messageService.create({
            id: crypto.randomUUID(),
            userId: session.user.id,
            ...validation.data,
            isLocked: true, // Initially locked
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create time capsule' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Message ID required' }, { status: 400 });

        await messageService.delete(id, session.user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete capsule' }, { status: 500 });
    }
}
