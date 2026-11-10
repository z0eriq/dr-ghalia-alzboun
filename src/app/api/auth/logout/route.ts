import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { isSameOrigin } from "@/lib/http";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/jwt";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 403 });
  }

  (await cookies()).set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return NextResponse.json({ ok: true });
}
