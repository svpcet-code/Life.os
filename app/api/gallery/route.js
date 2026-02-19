import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.data.gallery);
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
        db.data.gallery.push(newItem);
        await db.write();
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
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
        const index = db.data.gallery.findIndex((item) => item.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }

        db.data.gallery[index] = { ...db.data.gallery[index], ...body };
        await db.write();

        return NextResponse.json(db.data.gallery[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
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
        const initialLength = db.data.gallery.length;
        db.data.gallery = db.data.gallery.filter((item) => item.id !== id);

        if (db.data.gallery.length === initialLength) {
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }

        await db.write();
        return NextResponse.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}
