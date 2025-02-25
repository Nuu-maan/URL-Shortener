// src/app/api/url/route.ts - Fix for unused variables
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// Define a type for the URL with count information without importing Url
type UrlWithVisitCount = {
  id: string;
  shortCode: string;
  longUrl: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    visits: number;
  };
};

// POST /api/url - Create a new short URL
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // Validate URL
    try {
      new URL(url);
    } catch (_) { // Changed 'error' to '_' to indicate unused parameter
      return NextResponse.json(
        { error: "Invalid URL. Please provide a valid URL." },
        { status: 400 }
      );
    }

    // Generate a short code
    const shortCode = nanoid(6); // 6 character unique ID
    
    // Create new URL record
    const newUrl = await prisma.url.create({
      data: {
        shortCode,
        longUrl: url,
      },
    });

    return NextResponse.json({
      id: newUrl.id,
      shortCode: newUrl.shortCode,
      longUrl: newUrl.longUrl,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${newUrl.shortCode}`,
      createdAt: newUrl.createdAt,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return NextResponse.json(
      { error: "Failed to create short URL" },
      { status: 500 }
    );
  }
}

// GET /api/url - List all URLs
export async function GET() { // Removed unused 'request' parameter
  try {
    const urls = await prisma.url.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    });

    // Add proper typing to the urls array
    const urlsWithShortUrl = (urls as UrlWithVisitCount[]).map((url) => ({
      id: url.id,
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${url.shortCode}`,
      createdAt: url.createdAt,
      visits: url._count.visits,
    }));

    return NextResponse.json(urlsWithShortUrl);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch URLs" },
      { status: 500 }
    );
  }
}