import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — update
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        ...(body.type && { type: body.type }),
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.imageUrl && { imageUrl: body.imageUrl }),
        ...(body.originalPrice !== undefined && {
          originalPrice: parseFloat(body.originalPrice),
        }),
        ...(body.offerPrice !== undefined && {
          offerPrice: parseFloat(body.offerPrice),
        }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json({ offer });
  } catch (error) {
    console.error("Offer update error:", error);
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
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer delete error:", error);
    return NextResponse.json({ error: "ডিলিট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}