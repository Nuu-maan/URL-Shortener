import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { shortcode: string } }) {
  if (!params || !params.shortcode) {
    return NextResponse.json({ error: "Invalid short URL" }, { status: 400 });
  }

  const shortCode = params.shortcode;
  console.log("Received shortCode:", shortCode);

  try {
    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
    }

    // Redirect immediately for better performance
    const redirectResponse = NextResponse.redirect(url.longUrl);

    // Track visit asynchronously (does not block the redirect)
    trackVisit(url.id, request);

    return redirectResponse;
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json({ error: "Failed to process the redirect" }, { status: 500 });
  }
}

async function trackVisit(urlId: number, request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : "unknown";

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