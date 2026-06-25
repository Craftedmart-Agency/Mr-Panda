import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const firebaseUid = req.nextUrl.searchParams.get("firebaseUid");

    if (!firebaseUid) {
      return NextResponse.json(
        { error: "UID প্রয়োজন" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        isBanned: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ইউজার পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
