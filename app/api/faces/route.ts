import { NextRequest, NextResponse } from "next/server";
import { addFace, listFaces } from "@/lib/firebase-store";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    return NextResponse.json(await listFaces());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load faces.'
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const file = formData.get("image");
    const name = formData.get("name");
    const relationship = formData.get("relationship");
    
    if (!(file instanceof File) || typeof name !== 'string' || typeof relationship !== 'string') {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const filename = `face-${Date.now()}-${safeName || 'upload.jpg'}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const uploadPath = path.join(uploadDir, filename)

    await mkdir(uploadDir, { recursive: true })
    await writeFile(uploadPath, buffer)

    const newFace = await addFace({
      name,
      relationship,
      imageUrl: `/uploads/${filename}`,
    })

    return NextResponse.json(newFace, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
