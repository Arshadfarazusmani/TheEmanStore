import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 401 }
      );
    }

    // 1️⃣ Verify JWT
    const payload = verifyRefreshToken(refreshToken) as {
      userId: string;
    };

    // 2️⃣ Check token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // 3️⃣ Rotate refresh token (delete old)
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    // 4️⃣ Create new tokens
    const newAccessToken = signAccessToken({
      userId: payload.userId,
      role: "CUSTOMER", // we’ll improve this later
    });

    const newRefreshToken = signRefreshToken({
      userId: payload.userId,
    });

    // 5️⃣ Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 6️⃣ Return tokens
    return NextResponse.json(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
