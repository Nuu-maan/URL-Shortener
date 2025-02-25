import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Generate a short code (example logic)
    const shortCode = Math.random().toString(36).substring(2, 8);

    // Store in database
    const newUrl = await prisma.url.create({
      data: {
        longUrl: url,
        shortCode,
      },
    });

    return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${newUrl.shortCode}` }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
