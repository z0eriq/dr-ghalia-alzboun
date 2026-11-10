import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifyAdminToken } from "@/lib/jwt";

const LOCALES = new Set(["ar", "en"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyAdminToken(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyAdminToken(token) : null;
    if (!session) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  const first = pathname.split("/")[1] ?? "";
  if (LOCALES.has(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/ar" : `/ar${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|svg|jpg|jpeg|webp|ico|txt|xml)$).*)"],
};
