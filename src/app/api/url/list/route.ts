import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    const urls = await prisma.url.findMany({
      select: {
        id: true,
        shortCode: true,
        longUrl: true,
        createdAt: true,
        visits: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(urls, { status: 200 });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
