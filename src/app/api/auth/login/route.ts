import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { clientIp, isSameOrigin, rateLimit } from "@/lib/http";
import { SESSION_COOKIE, sessionCookieOptions, signAdminToken } from "@/lib/jwt";
import { findAdminByEmail } from "@/lib/db";

let dummyHash: string | null = null;

async function comparePassword(password: string, hash: string | null) {
  dummyHash ??= await bcrypt.hash("invalid-password-placeholder", 12);
  return bcrypt.compare(password, hash ?? dummyHash);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 403 });
  }

  if (!rateLimit(`login:${clientIp(request)}`, 8, 15 * 60 * 1000).ok) {
    return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  if (!email || password.length < 8 || password.length > 200) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const admin = await findAdminByEmail(email);
    const matches = await comparePassword(password, admin?.passwordHash ?? null);
    if (!admin || !matches) {
      return NextResponse.json({ ok: false, error: "INVALID_LOGIN" }, { status: 401 });
    }

    const token = await signAdminToken({ id: admin.id, email: admin.email, name: admin.name });
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());
    return NextResponse.json({ ok: true, name: admin.name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
