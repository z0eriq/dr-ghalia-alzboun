import { NextResponse } from "next/server";

import { SlotTakenError, updateAppointment } from "@/lib/appointments";
import { cleanText } from "@/lib/booking";
import { isSameOrigin } from "@/lib/http";
import { readAdminSession } from "@/lib/session";
import type { AppointmentStatus } from "@/lib/types";

const STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

function isStatus(value: unknown): value is AppointmentStatus {
  return typeof value === "string" && STATUSES.includes(value as AppointmentStatus);
}

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

  let status: AppointmentStatus | undefined;
  let staffNote: string | null | undefined;
  try {
    const body = (await request.json()) as { status?: unknown; staffNote?: unknown };
    if (body.status !== undefined) {
      if (!isStatus(body.status)) {
        return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
      }
      status = body.status;
    }
    if (body.staffNote !== undefined) {
      if (typeof body.staffNote !== "string" || body.staffNote.length > 1000) {
        return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
      }
      const cleaned = cleanText(body.staffNote);
      staffNote = cleaned || null;
    }
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  if (status === undefined && staffNote === undefined) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const updated = await updateAppointment(id, { status, staffNote });
    if (!updated) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return NextResponse.json({ ok: false, error: "SLOT_TAKEN" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
