import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — sob offer (active filter optional)
export async function GET(req: NextRequest) {
  try {
    const activeOnly = req.nextUrl.searchParams.get("active") === "true";

    const offers = await prisma.offer.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Offers fetch error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}

// POST — notun offer
export async function POST(req: NextRequest) {
  try {
    const { type, title, description, imageUrl, originalPrice, offerPrice } =
      await req.json();

    if (!type || !title || !imageUrl || !originalPrice || !offerPrice) {
      return NextResponse.json({ error: "সব তথ্য পূরণ করুন" }, { status: 400 });
    }

    const offer = await prisma.offer.create({
      data: {
        type,
        title,
        description: description || null,
        imageUrl,
        originalPrice: parseFloat(originalPrice),
        offerPrice: parseFloat(offerPrice),
      },
    });

    return NextResponse.json({ offer });
  } catch (error) {
    console.error("Offer create error:", error);
    return NextResponse.json({ error: "অফার তৈরি করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}