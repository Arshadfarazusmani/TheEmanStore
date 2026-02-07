import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${req.nextUrl.pathname}`, req.url)
    );
  }

  try {
    verifyAccessToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL(`/login?redirect=${req.nextUrl.pathname}`, req.url)
    );
  }
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/booking/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/tailor/:path*",
    "/admin/:path*",
  ],
};
