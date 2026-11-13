import { NextResponse } from "next/server";
import { RADAR_COOKIE, passwordMatches, sessionCookieValue } from "@/lib/radar/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") || "");

  if (!passwordMatches(password)) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // frena intentos en serie
    return NextResponse.redirect(new URL("/radar?error=1", request.url), 303);
  }

  const res = NextResponse.redirect(new URL("/radar", request.url), 303);
  res.cookies.set(RADAR_COOKIE, sessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/radar",
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
