import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const {
      firebaseUid,
      items,
      totalAmount,
      deliveryAddress,
      phoneNumber,
    } = await req.json();

    // Validation
    if (!firebaseUid || !items?.length || !deliveryAddress || !phoneNumber) {
      return NextResponse.json(
        { error: "প্রয়োজনীয় তথ্য নেই" },
        { status: 400 }
      );
    }

    // User khujo
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true, isBanned: true },
    });

    if (!user) {
      return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    if (user.isBanned) {
      return NextResponse.json(
        { error: "আপনার অ্যাকাউন্ট ব্লক করা হয়েছে" },
        { status: 403 }
      );
    }

    // Order create (items soho — nested create)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        deliveryAddress,
        phoneNumber,
        status: "PENDING",
        items: {
          create: items.map(
            (item: {
              id: string;
              name: string;
              price: number;
              quantity: number;
            }) => ({
              foodId: item.id, // food database e thakle link, na thakle Prisma handle korbe
              foodName: item.name,
              price: item.price,
              quantity: item.quantity,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { error: "অর্ডার তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}