import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — sob order (admin)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { select: { foodName: true, quantity: true, price: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}