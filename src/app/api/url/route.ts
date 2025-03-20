import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure correct Prisma import
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const MAX_GUEST_LINKS = 3;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Generate a short code (6 characters, alphanumeric)
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    // Get base URL from environment or request URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      `${request.nextUrl.protocol}//${request.headers.get("host")}`;

    if (!session) {
      // Guest user logic - track via cookies
      const cookies = request.cookies.get("guestLinks")?.value || "0";
      const guestLinks = parseInt(cookies, 10) || 0;

      if (guestLinks >= MAX_GUEST_LINKS) {
        return NextResponse.json(
          { error: "Guest users can create only 3 short links. Please sign in!" },
          { status: 403 }
        );
      }

      // Increment guest link count in cookies
      const response = NextResponse.json(
        { shortUrl: `${baseUrl}/${shortCode}` },
        { status: 201 }
      );

      response.cookies.set({
        name: "guestLinks",
        value: (guestLinks + 1).toString(),
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Ensure user ID is available
    if (!session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Logged-in user logic - unlimited URLs
    const newUrl = await prisma.url.create({
      data: {
        longUrl: url,
        shortCode,
        userId: session.user.id, // Ensure session user ID exists
      },
    });

    return NextResponse.json({ shortUrl: `${baseUrl}/${newUrl.shortCode}` }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle GET request for user-specific analytics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all links created by the user
    const userLinks = await prisma.url.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        shortCode: true,
        longUrl: true,
        createdAt: true,
        visits: {
          select: {
            id: true, // Visit ID (if needed)
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map visits count for each URL
    const formattedLinks = userLinks.map(link => ({
      ...link,
      totalVisits: link.visits.length, // Count visits
    }));

    return NextResponse.json(formattedLinks, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
