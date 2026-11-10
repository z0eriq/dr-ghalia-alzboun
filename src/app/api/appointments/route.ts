import { NextResponse } from "next/server";

import { SlotTakenError, countRecentBookings, createAppointment } from "@/lib/appointments";
import { validateBooking } from "@/lib/booking";
import { clinic } from "@/lib/clinic";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/http";
import { formatDate, formatTime } from "@/lib/time";
import { bookingMessage, clinicInquiryLink, whatsAppLink } from "@/lib/whatsapp";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 403 });
  }

  if (!rateLimit(`book:${clientIp(request)}`, 8, 60 * 60 * 1000).ok) {
    return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const parsed = validateBooking(payload);
  if (!parsed.ok) {
    if (parsed.code === "HONEYPOT") {
      return NextResponse.json({ ok: true, ignored: true, whatsappUrl: clinicInquiryLink("ar") });
    }
    return NextResponse.json(
      { ok: false, error: parsed.code },
      { status: parsed.code === "SLOT_CLOSED" ? 409 : 400 },
    );
  }

  try {
    const recent = await countRecentBookings(parsed.data.phone);
    if (recent >= 3) {
      return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
    }

    const created = await createAppointment(parsed.data);
    const message = bookingMessage({
      reference: created.reference,
      patientName: created.patientName,
      phone: created.phone,
      serviceName: created.serviceName,
      dateLabel: formatDate(created.date, "ar"),
      timeLabel: formatTime(created.time, "ar"),
      notes: created.notes,
    });

    return NextResponse.json({
      ok: true,
      appointment: {
        reference: created.reference,
        serviceName: parsed.data.serviceName,
        date: created.date,
        time: created.time,
      },
      whatsappUrl: whatsAppLink(clinic.phoneLocal, message),
    });
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return NextResponse.json({ ok: false, error: "SLOT_TAKEN" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
