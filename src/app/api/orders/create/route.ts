import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, items, totalAmount, deliveryAddress, phoneNumber, note } =
      await req.json();

    // Validation
    if (!firebaseUid || !items?.length || !deliveryAddress || !phoneNumber) {
      return NextResponse.json(
        { error: "প্রয়োজনীয় তথ্য নেই" },
        { status: 400 },
      );
    }

    // User khujo
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true, isBanned: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ইউজার পাওয়া যায়নি" },
        { status: 404 },
      );
    }

    if (user.isBanned) {
      return NextResponse.json(
        { error: "আপনার অ্যাকাউন্ট ব্লক করা হয়েছে" },
        { status: 403 },
      );
    }

    // Order create (items soho — nested create)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        deliveryAddress,
        phoneNumber,
        note: note || null,
        status: "PENDING",
        items: {
          create: items.map(
            (item: { name: string; price: number; quantity: number }) => ({
              foodName: item.name,
              price: item.price,
              quantity: item.quantity,
            }),
          ),
        },
      },
      include: { items: true },
    });

    // Notification database e save
    const notification = prisma.notification
      ? await prisma.notification.create({
          data: {
            type: "new-order",
            title: "নতুন অর্ডার এসেছে",
            message: `৳${order.totalAmount} এর একটি নতুন অর্ডার এসেছে`,
            orderId: order.id,
          },
        })
      : null;

    if (!notification) {
      console.warn("Notification model unavailable on Prisma client, skipping DB save.");
    }

    // Pusher — instant (notification soho)
    await pusherServer.trigger("admin-orders", "new-order", {
      notification,
      orderId: order.id,
      totalAmount: order.totalAmount,
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { error: "অর্ডার তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}
