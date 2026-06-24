import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const firebaseUid = req.nextUrl.searchParams.get("firebaseUid");
    if (!firebaseUid) {
      return NextResponse.json({ error: "UID প্রয়োজন" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { firebaseUid, name, phone, address, image } = await req.json();
    if (!firebaseUid) {
      return NextResponse.json({ error: "UID প্রয়োজন" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { firebaseUid },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        image: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
