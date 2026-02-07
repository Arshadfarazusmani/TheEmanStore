import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const { fullName, phone, address, dob } = await req.json();

    if (!fullName || !phone || !address) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const profile = await prisma.userProfile.upsert({
      where: { userId: auth.userId },
      update: {
        fullName,
        phone,
        address,
        dob: dob ? new Date(dob) : null,
      },
      create: {
        userId: auth.userId,
        fullName,
        phone,
        address,
        dob: dob ? new Date(dob) : null,
      },
    });

    return NextResponse.json(profile, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}
