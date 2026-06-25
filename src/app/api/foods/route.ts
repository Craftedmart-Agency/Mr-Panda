import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — sob food (category soho)
export async function GET(req: NextRequest) {
  try {
    const categoryId = req.nextUrl.searchParams.get("categoryId");

    const foods = await prisma.food.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ foods });
  } catch (error) {
    console.error("Foods fetch error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}

// POST — notun food
export async function POST(req: NextRequest) {
  try {
    const { name, description, price, imageUrl, categoryId, isAvailable } =
      await req.json();

    if (!name || !description || !price || !imageUrl || !categoryId) {
      return NextResponse.json({ error: "সব তথ্য পূরণ করুন" }, { status: 400 });
    }

    const food = await prisma.food.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId,
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json({ food });
  } catch (error) {
    console.error("Food create error:", error);
    return NextResponse.json({ error: "খাবার যোগ করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}