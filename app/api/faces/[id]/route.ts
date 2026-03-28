import { NextRequest, NextResponse } from "next/server";
import { deleteFace } from "@/lib/firebase-store";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const deleted = await deleteFace(id)
    if (!deleted) {
      return NextResponse.json({ error: "Face not found" }, { status: 404 });
    }

    if (deleted.imageUrl.startsWith('/uploads/')) {
      const filename = path.basename(deleted.imageUrl)
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
      try {
        await unlink(filePath)
      } catch {
        // Keep delete idempotent even if the local file is already gone.
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    const message = error instanceof Error ? error.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
