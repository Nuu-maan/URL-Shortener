import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ Ensure Prisma is imported correctly

export async function GET(
  request: NextRequest,
  { params }: { params: { shortcode: string } }
) {
  // ✅ Extract shortcode from params or fallback from URL path
  const shortcode = params?.shortcode?.trim() || extractShortcode(request.nextUrl.pathname);
  
  if (!shortcode) {
    return NextResponse.json({ error: "Invalid short URL" }, { status: 400 });
  }

  console.log("Received shortcode:", shortcode);

  try {
    // ✅ Find the original URL in the database
    const urlEntry = await prisma.url.findUnique({
      where: { shortCode: shortcode },
      select: { id: true, longUrl: true },
    });

    if (!urlEntry) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
    }

    // ✅ 301 Redirect for SEO-friendly permanent redirection
    const redirectResponse = NextResponse.redirect(urlEntry.longUrl, 301);

    // ✅ Track visit asynchronously (non-blocking)
    trackVisit(urlEntry.id, request).catch((err) =>
      console.error("Error tracking visit:", err)
    );

    return redirectResponse;
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json({ error: "Failed to process the redirect" }, { status: 500 });
  }
}

// ✅ Function to extract `shortcode` from URL path
function extractShortcode(pathname: string) {
  const parts = pathname.split("/");
  return parts[parts.length - 1] || null;
}

// ✅ Non-blocking visit tracking function
async function trackVisit(urlId: number, request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "direct";

    // ✅ Best way to get IP: x-forwarded-for (fallbacks included)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const cloudflareIp = request.headers.get("cf-connecting-ip"); // Cloudflare support
    const ip = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : cloudflareIp || "unknown";

    console.log(`Tracking visit: ${ip} | ${userAgent} | ${referer}`);

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