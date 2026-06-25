import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — sob category
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { foods: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}

// POST — notun category
export async function POST(req: NextRequest) {
  try {
    const { name, imageUrl } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "ক্যাটাগরির নাম প্রয়োজন" }, { status: 400 });
    }

    // Already ache kina
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json(
        { error: "এই নামে ক্যাটাগরি আগেই আছে" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, imageUrl: imageUrl || null },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Category create error:", error);
    return NextResponse.json({ error: "ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}