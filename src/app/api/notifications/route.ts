import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — sob notification
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const orderIds = notifications
      .map((notif) => notif.orderId)
      .filter((orderId): orderId is string => Boolean(orderId));

    const orders = orderIds.length
      ? await prisma.order.findMany({
          where: { id: { in: orderIds } },
          select: { id: true, status: true },
        })
      : [];

    const statusMap = orders.reduce<Record<string, string>>((acc, order) => {
      acc[order.id] = order.status;
      return acc;
    }, {});

    const enrichedNotifications = notifications.map((notif) => ({
      ...notif,
      orderStatus: notif.orderId ? statusMap[notif.orderId] ?? null : null,
    }));

    const unreadCount = await prisma.notification.count({
      where: { isRead: false },
    });

    return NextResponse.json({ notifications: enrichedNotifications, unreadCount });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}

// PATCH — sob read mark
export async function PATCH() {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}