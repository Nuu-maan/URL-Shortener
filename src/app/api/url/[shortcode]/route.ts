import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ Ensure Prisma is imported correctly

export async function GET(
  request: NextRequest,
  { params }: { params: { shortcode: string } } // ✅ Fix casing to match route
) {
  if (!params?.shortcode) {
    return NextResponse.json({ error: "Invalid short URL" }, { status: 400 });
  }

  const shortcode = params.shortcode.trim();
  console.log("Received shortcode:", shortcode);

  try {
    // ✅ Find the original URL in the database
    const urlEntry = await prisma.url.findUnique({
      where: { shortCode: shortcode }, // Ensure this matches your Prisma schema
      select: { id: true, longUrl: true },
    });

    if (!urlEntry) {
      return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
    }

    // ✅ Use 301 Redirect for better SEO
    const redirectResponse = NextResponse.redirect(urlEntry.longUrl, 301);

    // ✅ Track visit asynchronously
    trackVisit(urlEntry.id, request).catch((err) =>
      console.error("Error tracking visit:", err)
    );

    return redirectResponse;
  } catch (error) {
    console.error("Error processing redirect:", error);
    return NextResponse.json({ error: "Failed to process the redirect" }, { status: 500 });
  }
}

// ✅ Non-blocking visit tracking function
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
