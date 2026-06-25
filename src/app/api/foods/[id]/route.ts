import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — update
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, price, imageUrl, categoryId, isAvailable } =
      await req.json();

    const food = await prisma.food.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(imageUrl && { imageUrl }),
        ...(categoryId && { categoryId }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
    });

    return NextResponse.json({ food });
  } catch (error) {
    console.error("Food update error:", error);
    return NextResponse.json({ error: "আপডেট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.food.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Food delete error:", error);
    return NextResponse.json({ error: "ডিলিট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}