import { taskService } from '@/services/taskService';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tasks = await taskService.getAll(session.user.id);
    return NextResponse.json(tasks);
}

export async function POST(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        if (!body.text) return NextResponse.json({ error: 'Text required' }, { status: 400 });

        const newTask = await taskService.create({
            id: crypto.randomUUID(),
            userId: session.user.id,
            text: body.text,
            completed: false,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const updatedTask = await taskService.update(id, session.user.id, updates);

        if (!updatedTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

        return NextResponse.json(updatedTask);
    } catch {
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const success = await taskService.delete(id, session.user.id);

    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ message: 'Deleted successfully' });
}
