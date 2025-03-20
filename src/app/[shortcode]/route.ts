import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortcode: string }> | { shortcode: string } }
) {
  try {
    const { shortcode } = await context.params;

    // ✅ Ignore favicon.ico requests
    if (shortcode === "favicon.ico") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("Received shortcode:", shortcode);

    // Look up the URL in the database
    const url = await prisma.url.findUnique({
      where: { shortCode: shortcode },
      select: { id: true, longUrl: true },
    });

    // If URL doesn't exist, return 404
    if (!url) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Extract client info for analytics
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    // Track the visit asynchronously
    trackVisit(url.id, ip, userAgent, referer).catch(console.error);

    // Redirect to the original URL with 301 (permanent) redirect
    return NextResponse.redirect(url.longUrl, 301);
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json(
      { error: "Failed to process the redirect" },
      { status: 500 }
    );
  }
}

// Separate function for visit tracking to keep the main handler clean
async function trackVisit(
  urlId: number,
  ip: string,
  userAgent: string,
  referrer: string
) {
  try {
    await prisma.visit.create({
      data: {
        urlId,
        ip,
        userAgent,
        referrer,
      },
    });
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
}
