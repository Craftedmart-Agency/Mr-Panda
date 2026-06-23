import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, email, name, image } = await req.json();

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: "প্রয়োজনীয় তথ্য নেই" },
        { status: 400 }
      );
    }

    // User ache kina check (firebaseUid diye)
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (existingUser) {
      // Already ache — return koro
      return NextResponse.json({ user: existingUser });
    }

    // Notun user create
    const user = await prisma.user.create({
      data: {
        firebaseUid,
        email,
        name: name || email.split("@")[0],
        image: image || null,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json(
      { error: "ইউজার সিঙ্ক করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const firebaseUid = req.nextUrl.searchParams.get("firebaseUid");

    if (!firebaseUid) {
      return NextResponse.json({ error: "UID প্রয়োজন" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true, name: true, email: true, role: true, image: true },
    });

    if (!user) {
      return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "সমস্যা হয়েছে" }, { status: 500 });
  }
}