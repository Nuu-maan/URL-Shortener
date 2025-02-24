import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { shortCode: string } }
) {
  try {
    const url = await prisma.url.findUnique({
      where: { shortCode: params.shortCode }
    });

    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Log visit
    await prisma.visit.create({
      data: {
        urlId: url.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent'),
        referrer: req.headers.get('referer')
      }
    });

    return NextResponse.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
