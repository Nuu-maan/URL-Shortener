import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { shortcode?: string } }
) {
  if (!params?.shortcode) {
    return NextResponse.json({ error: "Invalid short URL" }, { status: 400 });
  }

  const shortCode = params.shortcode.trim();
  console.log("Received shortCode:", shortCode);

  try {
    const url = await prisma.url.findUnique({
      where: { shortCode },
      select: { id: true, longUrl: true }, // Select only needed fields
    });

    if (!url) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
    }

    // Redirect immediately
    const redirectResponse = NextResponse.redirect(url.longUrl);

    // Track visit asynchronously (non-blocking)
    trackVisit(url.id, request);

    return redirectResponse;
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json({ error: "Failed to process the redirect" }, { status: 500 });
  }
}

async function trackVisit(urlId: number, request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "direct";
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    await prisma.visit.create({
      data: {
        urlId,
        ip,
        userAgent,
        referrer: referer,
      },
    });
  } catch (err) {
    console.error("Error tracking visit:", err);
  }
}
