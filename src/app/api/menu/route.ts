import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — menu er jonno available food + categories
export async function GET() {
  try {
    const [foods, categories] = await Promise.all([
      prisma.food.findMany({
        where: { isAvailable: true },
        include: {
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({ foods, categories });
  } catch (error) {
    console.error("Menu fetch error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}