import { NextResponse } from "next/server";

import { isSameOrigin } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { readAdminSession } from "@/lib/session";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 403 });
  }

  const session = await readAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const { id } = await context.params;
  if (!id || id.length > 40) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  let isRead: boolean;
  try {
    const body = (await request.json()) as { isRead?: unknown };
    if (typeof body.isRead !== "boolean") {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }
    isRead = body.isRead;
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const updated = await prisma.contactMessage.update({ where: { id }, data: { isRead } });
    return NextResponse.json({ ok: true, isRead: updated.isRead });
  } catch {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }
}
