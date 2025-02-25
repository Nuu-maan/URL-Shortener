import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { shortcode: string } }
) {
  const shortCode = params.shortcode;

  // Debug log to verify the shortCode is being correctly received
  console.log("Received shortCode:", shortCode);

  try {
    // Look up the URL in the database
    const url = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });

    // If URL doesn't exist, return 404
    if (!url) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Get client info for analytics
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    
    // Fix IP address extraction
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : "unknown";

    // Track the visit
    await prisma.visit.create({
      data: {
        urlId: url.id,
        ip: ip,
        userAgent,
        referrer: referer,
      },
    });

    // Redirect to the original URL
    return NextResponse.redirect(url.longUrl);
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json(
      { error: "Failed to process the redirect" },
      { status: 500 }
    );
  }
}