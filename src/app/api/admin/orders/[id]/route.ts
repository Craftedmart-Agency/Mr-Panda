import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — status update
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = [
      "PENDING",
      "ACCEPTED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "ভুল স্ট্যাটাস" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "আপডেট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}