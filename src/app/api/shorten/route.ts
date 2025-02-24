import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const existingUrl = await prisma.url.findFirst({
      where: { originalUrl: url }
    });

    if (existingUrl) {
      return NextResponse.json({
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${existingUrl.shortCode}`
      });
    }

    const shortCode = nanoid(8);
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: url,
        shortCode,
      }
    });

    return NextResponse.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    );
  }
}

