import "server-only";

import { activeSlotKey } from "@/lib/booking";
import { countAppointments, findAppointment, insertAppointment, listAppointments, saveAppointment } from "@/lib/db";
import { isUniqueViolation } from "@/lib/d1";
import { makeReference } from "@/lib/reference";
import { ammanDayStart } from "@/lib/time";
import type { AppointmentStatus, Locale } from "@/lib/types";

export class SlotTakenError extends Error {
  constructor() {
    super("SLOT_TAKEN");
    this.name = "SlotTakenError";
  }
}

type CreateAppointmentInput = {
  patientName: string;
  phone: string;
  serviceSlug: string;
  serviceNameAr: string;
  date: string;
  time: string;
  notes: string | null;
  locale: Locale;
};

export async function countRecentBookings(phone: string, now = new Date()) {
  return countAppointments({ phone, createdSince: ammanDayStart(now) });
}

export async function createAppointment(input: CreateAppointmentInput) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await insertAppointment({
        reference: makeReference(),
        patientName: input.patientName,
        phone: input.phone,
        serviceSlug: input.serviceSlug,
        serviceName: input.serviceNameAr,
        date: input.date,
        time: input.time,
        notes: input.notes,
        locale: input.locale,
      });
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      if (message.includes("reference")) continue;
      throw new SlotTakenError();
    }
  }

  throw new Error("Could not allocate an appointment reference.");
}

export async function listTakenSlots(date: string) {
  const rows = await listAppointments({ date, activeSlot: "active" }, "schedule", 0, 48);
  return rows.map((row) => row.time);
}

export async function updateAppointment(
  id: string,
  changes: { status?: AppointmentStatus; staffNote?: string | null },
) {
  const current = await findAppointment(id);
  if (!current) return null;

  const status = changes.status ?? current.status;

  try {
    return await saveAppointment(id, {
      status,
      activeSlot: activeSlotKey(status, current.id),
      staffNote: changes.staffNote,
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlotTakenError();
    throw error;
  }
}
