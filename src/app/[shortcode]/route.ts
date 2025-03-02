import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use a shared Prisma instance

type RouteParams = {
  shortcode: string;
};

export async function GET(
  request: NextRequest,
  context: { params?: RouteParams } // ✅ Handle possible undefined params
) {
  if (!context.params) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const shortCode = context.params.shortcode;

  // ✅ Ignore favicon.ico requests
  if (shortCode === "favicon.ico") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  console.log("Received shortCode:", shortCode);

  try {
    // Look up the URL in the database
    const url = await prisma.url.findUnique({
      where: { shortCode },
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

    // Track the visit in the database
    await prisma.visit.create({
      data: {
        urlId: url.id,
        ip,
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
