import { NextResponse } from "next/server";

import { listTakenSlots } from "@/lib/appointments";
import { generateSlots, isWithinBookingWindow, slotStartsInFuture } from "@/lib/time";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!isWithinBookingWindow(date)) {
    return NextResponse.json({ ok: false, error: "SLOT_CLOSED" }, { status: 400 });
  }

  try {
    const taken = new Set(await listTakenSlots(date));
    const slots = generateSlots()
      .filter((time) => slotStartsInFuture(date, time))
      .map((time) => ({ time, available: !taken.has(time) }));

    return NextResponse.json({ ok: true, slots });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
