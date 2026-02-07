// import jwt from "jsonwebtoken";

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// export type JwtPayload = {
//   userId: string;
//   role: string;
// };

// export function signAccessToken(payload: JwtPayload) {
//   return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
//     expiresIn: "15m",
//   });
// }

// export function signRefreshToken(payload: Pick<JwtPayload, "userId">) {
//   return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
//     expiresIn: "7d",
//   });
// }

import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

/* =========================
   SIGN TOKENS
========================= */

export function signAccessToken(payload: {
  userId: string;
  role: string;
}) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: { userId: string }) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

/* =========================
   VERIFY TOKENS
========================= */

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
