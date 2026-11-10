import { NextResponse } from "next/server";

import { validateContact } from "@/lib/booking";
import { clinic } from "@/lib/clinic";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { clinicInquiryLink, whatsAppLink } from "@/lib/whatsapp";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 403 });
  }

  if (!rateLimit(`contact:${clientIp(request)}`, 6, 60 * 60 * 1000).ok) {
    return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  const parsed = validateContact(payload);
  if (!parsed.ok) {
    if (parsed.code === "HONEYPOT") {
      return NextResponse.json({ ok: true, whatsappUrl: clinicInquiryLink("ar") });
    }
    return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    const text = [
      "السلام عليكم، رسالة من موقع عيادة الدكتورة غالية الزبون.",
      "",
      `الاسم: ${parsed.data.name}`,
      `الهاتف: ${parsed.data.phone}`,
      `الرسالة: ${parsed.data.message}`,
    ].join("\n");

    return NextResponse.json({
      ok: true,
      whatsappUrl: whatsAppLink(clinic.phoneLocal, text),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
