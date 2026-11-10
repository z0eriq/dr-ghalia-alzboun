import { getService, isServiceSlug } from "@/content/services";
import { normalizeJordanPhone } from "@/lib/phone";
import {
  generateSlots,
  isWithinBookingWindow,
  slotStartsInFuture,
} from "@/lib/time";
import type { AppointmentStatus, Locale } from "@/lib/types";

const NAME_PATTERN = /^[\p{L}\p{M}\s.'’-]+$/u;

export type BookingCode = "INVALID_INPUT" | "SLOT_CLOSED" | "HONEYPOT";

export type BookingPayload = {
  patientName?: unknown;
  phone?: unknown;
  serviceSlug?: unknown;
  date?: unknown;
  time?: unknown;
  notes?: unknown;
  locale?: unknown;
  websiteUrl?: unknown;
};

export type NormalizedBooking = {
  patientName: string;
  phone: string;
  serviceSlug: string;
  serviceNameAr: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string | null;
  locale: Locale;
};

export function cleanText(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}

export function activeSlotKey(status: AppointmentStatus, id: string): string {
  // A cancelled visit releases its time. Any other status keeps the single active lock.
  return status === "CANCELLED" ? id : "active";
}

export function validateBooking(
  input: unknown,
  now = new Date(),
): { ok: true; data: NormalizedBooking } | { ok: false; code: BookingCode } {
  const record: BookingPayload = input && typeof input === "object" ? (input as BookingPayload) : {};
  if (typeof record.websiteUrl === "string" && record.websiteUrl.trim() !== "") {
    return { ok: false, code: "HONEYPOT" };
  }

  if (typeof record.patientName !== "string" || typeof record.phone !== "string") {
    return { ok: false, code: "INVALID_INPUT" };
  }

  const patientName = cleanText(record.patientName);
  if (patientName.length < 2 || patientName.length > 80 || !NAME_PATTERN.test(patientName)) {
    return { ok: false, code: "INVALID_INPUT" };
  }

  const phone = normalizeJordanPhone(record.phone);
  if (!phone) return { ok: false, code: "INVALID_INPUT" };

  if (typeof record.serviceSlug !== "string" || !isServiceSlug(record.serviceSlug)) {
    return { ok: false, code: "INVALID_INPUT" };
  }

  const service = getService(record.serviceSlug);
  if (!service) return { ok: false, code: "INVALID_INPUT" };

  if (record.locale !== "ar" && record.locale !== "en") {
    return { ok: false, code: "INVALID_INPUT" };
  }

  if (typeof record.date !== "string" || typeof record.time !== "string") {
    return { ok: false, code: "INVALID_INPUT" };
  }

  if (!isWithinBookingWindow(record.date, now) || !generateSlots().includes(record.time)) {
    return { ok: false, code: "SLOT_CLOSED" };
  }

  if (!slotStartsInFuture(record.date, record.time, now)) {
    return { ok: false, code: "SLOT_CLOSED" };
  }

  let notes: string | null = null;
  if (typeof record.notes === "string" && record.notes.trim()) {
    notes = cleanText(record.notes);
    if (notes.length > 500) return { ok: false, code: "INVALID_INPUT" };
  }

  return {
    ok: true,
    data: {
      patientName,
      phone,
      serviceSlug: service.slug,
      serviceNameAr: service.title.ar,
      serviceName: service.title[record.locale],
      date: record.date,
      time: record.time,
      notes,
      locale: record.locale,
    },
  };
}

export function validateContact(input: unknown):
  | { ok: true; data: { name: string; phone: string; message: string } }
  | { ok: false; code: "INVALID_INPUT" | "HONEYPOT" } {
  const record =
    input && typeof input === "object"
      ? (input as { name?: unknown; phone?: unknown; message?: unknown; websiteUrl?: unknown })
      : {};

  if (typeof record.websiteUrl === "string" && record.websiteUrl.trim() !== "") {
    return { ok: false, code: "HONEYPOT" };
  }

  if (typeof record.name !== "string" || typeof record.phone !== "string" || typeof record.message !== "string") {
    return { ok: false, code: "INVALID_INPUT" };
  }

  const name = cleanText(record.name);
  const message = cleanText(record.message);
  const phone = normalizeJordanPhone(record.phone);

  if (name.length < 2 || name.length > 80 || !NAME_PATTERN.test(name)) {
    return { ok: false, code: "INVALID_INPUT" };
  }
  if (!phone) return { ok: false, code: "INVALID_INPUT" };
  if (message.length < 5 || message.length > 1000) {
    return { ok: false, code: "INVALID_INPUT" };
  }

  return { ok: true, data: { name, phone, message } };
}
