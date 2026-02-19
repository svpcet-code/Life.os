import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.data.posts);
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
        db.data.posts.push(newItem);
        await db.write();
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
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
        const index = db.data.posts.findIndex((post) => post.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        db.data.posts[index] = { ...db.data.posts[index], ...body };
        await db.write();

        return NextResponse.json(db.data.posts[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
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
        const initialLength = db.data.posts.length;
        db.data.posts = db.data.posts.filter((post) => post.id !== id);

        if (db.data.posts.length === initialLength) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        await db.write();
        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
