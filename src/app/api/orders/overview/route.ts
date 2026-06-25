import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const firebaseUid = req.nextUrl.searchParams.get("firebaseUid");

    if (!firebaseUid) {
      return NextResponse.json({ error: "UID প্রয়োজন" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    const [totalOrders, activeOrders, deliveredOrders, cancelledOrders, recentOrders] =
      await Promise.all([
        prisma.order.count({ where: { userId: user.id } }),
        prisma.order.count({
          where: {
            userId: user.id,
            status: { in: ["PENDING", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"] },
          },
        }),
        prisma.order.count({ where: { userId: user.id, status: "DELIVERED" } }),
        prisma.order.count({ where: { userId: user.id, status: "CANCELLED" } }),
        prisma.order.findMany({
          where: { userId: user.id },
          include: { items: { select: { foodName: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      stats: { totalOrders, activeOrders, deliveredOrders, cancelledOrders },
      recentOrders,
    });
  } catch (error) {
    console.error("Overview error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}