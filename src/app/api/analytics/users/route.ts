import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ✅ Get the first day of the current and previous month
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // ✅ Count unique visitors (based on IP) for the current and previous month
    const [currentMonthUsers, previousMonthUsers, currentMonthClicks, previousMonthClicks] = await Promise.all([
      prisma.visit.findMany({
        where: { createdAt: { gte: currentMonthStart } }// ✅ Change `createdAt` → `timestamp`
        select: { ip: true },
        distinct: ['ip'],
      }),
      prisma.visit.findMany({
        where: { timestamp: { gte: previousMonthStart, lt: currentMonthStart } },
        select: { ip: true },
        distinct: ['ip'],
      }),
      prisma.visit.count({
        where: { timestamp: { gte: currentMonthStart } },
      }),
      prisma.visit.count({
        where: { timestamp: { gte: previousMonthStart, lt: currentMonthStart } },
      }),
    ]);
    
    return NextResponse.json({
      currentMonthUsers: currentMonthUsers.length || 0, // Ensure it's always a number
      previousMonthUsers: previousMonthUsers.length || 0,
      currentMonthClicks: currentMonthClicks || 0,
      previousMonthClicks: previousMonthClicks || 0,
    });
    
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
