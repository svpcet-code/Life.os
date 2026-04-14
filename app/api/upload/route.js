import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure directory exists (though we created it, safe to double check)
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: fileUrl }, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
