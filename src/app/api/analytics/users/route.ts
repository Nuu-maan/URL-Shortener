// src/app/api/analytics/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Calculate current month and previous month boundaries
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get unique IP counts for current month
    const currentMonthUsers = await prisma.visit.findMany({
      where: {
        timestamp: {
          gte: currentMonthStart,
        },
      },
      select: {
        ip: true,
      },
      distinct: ['ip'],
    });

    // Get unique IP counts for previous month
    const previousMonthUsers = await prisma.visit.findMany({
      where: {
        timestamp: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
      select: {
        ip: true,
      },
      distinct: ['ip'],
    });

    // Get click counts
    const currentMonthClicks = await prisma.visit.count({
      where: {
        timestamp: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthClicks = await prisma.visit.count({
      where: {
        timestamp: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    return NextResponse.json({
      currentMonthUsers: currentMonthUsers.length,
      previousMonthUsers: previousMonthUsers.length,
      currentMonthClicks,
      previousMonthClicks,
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user analytics" },
      { status: 500 }
    );
  }
}