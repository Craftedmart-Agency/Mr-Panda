import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsers, totalOrders, totalFoods, revenueData, allOrders] =
      await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.food.count(),
        prisma.order.aggregate({
          where: { status: "DELIVERED" },
          _sum: { totalAmount: true },
        }),
        prisma.order.findMany({
          select: { status: true, totalAmount: true, createdAt: true },
        }),
      ]);

    const pendingOrders = allOrders.filter((o) =>
      ["PENDING", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"].includes(o.status)
    ).length;
    const deliveredOrders = allOrders.filter(
      (o) => o.status === "DELIVERED"
    ).length;

    // Order status breakdown
    const statusCount: Record<string, number> = {};
    allOrders.forEach((o) => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });

    const statusConfig: Record<string, { name: string; color: string }> = {
      PENDING: { name: "পেন্ডিং", color: "#3b82f6" },
      ACCEPTED: { name: "গৃহীত", color: "#8b5cf6" },
      PREPARING: { name: "প্রস্তুত", color: "#f59e0b" },
      OUT_FOR_DELIVERY: { name: "ডেলিভারিতে", color: "#06b6d4" },
      DELIVERED: { name: "ডেলিভার্ড", color: "#22c55e" },
      CANCELLED: { name: "বাতিল", color: "#ef4444" },
    };

    const orderStatus = Object.entries(statusCount).map(([status, value]) => ({
      name: statusConfig[status]?.name || status,
      value,
      color: statusConfig[status]?.color || "#999",
    }));

    // Last 6 months
    const months: { month: string; revenue: number; orders: number }[] = [];
    const now = new Date();
    const monthNames = ["জান", "ফেব", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const monthOrders = allOrders.filter(
        (o) => o.createdAt >= monthStart && o.createdAt <= monthEnd
      );
      const revenue = monthOrders
        .filter((o) => o.status === "DELIVERED")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      months.push({
        month: monthNames[d.getMonth()],
        revenue,
        orders: monthOrders.length,
      });
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        totalOrders,
        totalFoods,
        totalRevenue: revenueData._sum.totalAmount || 0,
        pendingOrders,
        deliveredOrders,
      },
      orderStatus,
      monthlyRevenue: months.map((m) => ({ month: m.month, revenue: m.revenue })),
      monthlyOrders: months.map((m) => ({ month: m.month, orders: m.orders })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}