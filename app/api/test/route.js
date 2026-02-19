import getDb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = await getDb();
        return NextResponse.json({
            message: "Local LowDB Connected Successfully 🚀",
            itemCounts: {
                users: db.data.users?.length || 0,
                memories: db.data.memories?.length || 0,
                moods: db.data.moods?.length || 0,
                messages: db.data.messages?.length || 0
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Database connection failed", details: error.message },
            { status: 500 }
        );
    }
}
