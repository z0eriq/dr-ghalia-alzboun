import "server-only";

import { Prisma } from "@prisma/client";

import { activeSlotKey } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
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

function uniqueTarget(error: unknown): string | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return null;
  }
  const target = error.meta?.target;
  if (Array.isArray(target)) return target.join(",").toLowerCase();
  return typeof target === "string" ? target.toLowerCase() : "";
}

export async function countRecentBookings(phone: string, now = new Date()) {
  return prisma.appointment.count({
    where: { phone, createdAt: { gte: ammanDayStart(now) } },
  });
}

export async function createAppointment(input: CreateAppointmentInput) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.appointment.create({
        data: {
          reference: makeReference(),
          patientName: input.patientName,
          phone: input.phone,
          serviceSlug: input.serviceSlug,
          serviceName: input.serviceNameAr,
          date: input.date,
          time: input.time,
          notes: input.notes,
          locale: input.locale,
          status: "PENDING",
          activeSlot: "active",
        },
      });
    } catch (error) {
      const target = uniqueTarget(error);
      if (target?.includes("reference")) continue;
      if (target !== null) throw new SlotTakenError();
      throw error;
    }
  }

  throw new Error("Could not allocate an appointment reference.");
}

export async function listTakenSlots(date: string) {
  const rows = await prisma.appointment.findMany({
    where: { date, activeSlot: "active" },
    select: { time: true },
  });
  return rows.map((row) => row.time);
}

export async function updateAppointment(
  id: string,
  changes: { status?: AppointmentStatus; staffNote?: string | null },
) {
  const current = await prisma.appointment.findUnique({ where: { id } });
  if (!current) return null;

  const status = changes.status ?? current.status;
  const data: Prisma.AppointmentUpdateInput = {
    status,
    activeSlot: activeSlotKey(status, current.id),
  };

  if (changes.staffNote !== undefined) {
    data.staffNote = changes.staffNote;
  }

  try {
    return await prisma.appointment.update({ where: { id }, data });
  } catch (error) {
    if (uniqueTarget(error) !== null) throw new SlotTakenError();
    throw error;
  }
}
