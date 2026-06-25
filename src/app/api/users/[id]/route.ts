import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — ban/unban
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isBanned, role } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(isBanned !== undefined && { isBanned }),
        ...(role && { role }),
      },
      select: { id: true, name: true, isBanned: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "আপডেট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}