import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the first day of the current and previous month
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Count unique visitors (based on IP) for the current and previous month
    const [currentMonthUsers, previousMonthUsers, currentMonthClicks, previousMonthClicks] = await Promise.all([
      prisma.visit.findMany({
        where: {
          createdAt: {
            gte: currentMonthStart
          }
        },
        select: {
          ip: true
        },
        distinct: ['ip']
      }),
      prisma.visit.findMany({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart
          }
        },
        select: {
          ip: true
        },
        distinct: ['ip']
      }),
      prisma.visit.count({
        where: {
          createdAt: {
            gte: currentMonthStart
          }
        }
      }),
      prisma.visit.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart
          }
        }
      })
    ]);
    
    return NextResponse.json({
      currentMonthUsers: currentMonthUsers.length,
      previousMonthUsers: previousMonthUsers.length,
      currentMonthClicks,
      previousMonthClicks,
      userGrowth: ((currentMonthUsers.length - previousMonthUsers.length) / previousMonthUsers.length) * 100,
      clickGrowth: ((currentMonthClicks - previousMonthClicks) / previousMonthClicks) * 100
    });
    
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
