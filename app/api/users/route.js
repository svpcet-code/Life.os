import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.data.users);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = await getDb();
        const newItem = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...body,
        };
        db.data.users.push(newItem);
        await db.write();
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const db = await getDb();
        const index = db.data.users.findIndex((user) => user.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        db.data.users[index] = { ...db.data.users[index], ...body };
        await db.write();

        return NextResponse.json(db.data.users[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const db = await getDb();
        const initialLength = db.data.users.length;
        db.data.users = db.data.users.filter((user) => user.id !== id);

        if (db.data.users.length === initialLength) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await db.write();
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
