import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export function requireAuth(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    const payload = verifyAccessToken(token) as {
      userId: string;
      role: string;
      iat: number;
      exp: number;
    };

    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
