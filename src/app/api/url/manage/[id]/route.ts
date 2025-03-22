import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Invalid URL ID" }, { status: 400 });
    }

    // Check if the URL exists and belongs to the user
    const existingUrl = await prisma.url.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingUrl) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    // Check if the URL belongs to the authenticated user
    if (session?.user?.id && existingUrl.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the URL
    await prisma.url.delete({
      where: { id }
    });

    return NextResponse.json({ message: "URL deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 