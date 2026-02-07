import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const {  name,email, password,role } = await req.json();

    if (!email || !password || name) {
      return NextResponse.json(
        { message: "All feilds are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {

       name,
        email,
        password: hashedPassword,
        role: role ?? "CUSTOMER",
      },
    });

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshTokenExpiresAt = new Date();
refreshTokenExpiresAt.setDate(
  refreshTokenExpiresAt.getDate() + 7
);


    const refreshToken = signRefreshToken({
      userId: user.id,
    });

    await prisma.refreshToken.create({
  data: {
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiresAt,
  },
});


    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
