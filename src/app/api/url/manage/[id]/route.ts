import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is imported correctly

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Invalid URL ID" }, { status: 400 });
    }

    // Check if the URL exists
    const existingUrl = await prisma.url.findUnique({ where: { id: Number(id) } });

    if (!existingUrl) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    // Delete URL from database
    await prisma.url.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "URL deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 