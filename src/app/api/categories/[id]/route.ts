import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — category update
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, imageUrl } = await req.json();

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json({ error: "আপডেট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

// DELETE — category delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Food ache kina check (food thakle delete na)
    const foodCount = await prisma.food.count({ where: { categoryId: id } });
    if (foodCount > 0) {
      return NextResponse.json(
        { error: "এই ক্যাটাগরিতে খাবার আছে, আগে সেগুলো সরান" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json({ error: "ডিলিট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}