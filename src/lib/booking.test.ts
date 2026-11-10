import { describe, expect, it } from "vitest";

import { validateBooking } from "@/lib/booking";
import { normalizeJordanPhone } from "@/lib/phone";
import {
  addDays,
  generateSlots,
  isWithinBookingWindow,
  nowMinutesInAmman,
  slotStartsInFuture,
  todayInAmman,
} from "@/lib/time";
import { bookingMessage, whatsAppLink } from "@/lib/whatsapp";

const morning = new Date("2026-11-10T06:00:00.000Z");

describe("Jordan phone numbers", () => {
  it("accepts local and international mobile formats", () => {
    expect(normalizeJordanPhone("0791853391")).toBe("0791853391");
    expect(normalizeJordanPhone("+962 79 185 3391")).toBe("0791853391");
    expect(normalizeJordanPhone("00962791853391")).toBe("0791853391");
    expect(normalizeJordanPhone("962791853391")).toBe("0791853391");
    expect(normalizeJordanPhone("791853391")).toBe("0791853391");
  });

  it("rejects landlines and incomplete numbers", () => {
    expect(normalizeJordanPhone("0612345678")).toBeNull();
    expect(normalizeJordanPhone("079185339")).toBeNull();
    expect(normalizeJordanPhone("07918533912")).toBeNull();
  });
});

describe("clinic schedule", () => {
  it("builds twenty slots from 10:00 to 19:30", () => {
    const slots = generateSlots();
    expect(slots).toHaveLength(20);
    expect(slots[0]).toBe("10:00");
    expect(slots.at(-1)).toBe("19:30");
  });

  it("uses Asia/Amman for the booking day", () => {
    expect(todayInAmman(new Date("2026-11-10T21:30:00.000Z"))).toBe("2026-11-11");
    expect(nowMinutesInAmman(new Date("2026-11-10T07:15:00.000Z"))).toBe(10 * 60 + 15);
  });

  it("keeps bookings inside a sixty-day window and in the future", () => {
    const today = todayInAmman(morning);
    expect(isWithinBookingWindow(today, morning)).toBe(true);
    expect(isWithinBookingWindow(addDays(today, 60), morning)).toBe(true);
    expect(isWithinBookingWindow(addDays(today, 61), morning)).toBe(false);
    expect(isWithinBookingWindow("2026-02-31", morning)).toBe(false);
    expect(slotStartsInFuture(today, "10:00", new Date("2026-11-10T07:15:00.000Z"))).toBe(false);
    expect(slotStartsInFuture(today, "10:30", new Date("2026-11-10T07:15:00.000Z"))).toBe(true);
  });
});

describe("booking validation", () => {
  const valid = {
    patientName: "ليلى أحمد",
    phone: "0791853391",
    serviceSlug: "cleaning",
    date: "2026-11-12",
    time: "11:00",
    notes: "  أفضّل موعدًا هادئًا  ",
    locale: "ar" as const,
  };

  it("accepts a complete request and stores the Arabic service name", () => {
    const result = validateBooking(valid, morning);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.phone).toBe("0791853391");
    expect(result.data.serviceNameAr).toBe("تنظيف وتلميع الأسنان");
    expect(result.data.notes).toBe("أفضّل موعدًا هادئًا");
  });

  it("rejects a taken-looking closed slot and a honeypot", () => {
    expect(validateBooking({ ...valid, time: "09:00" }, morning)).toEqual({
      ok: false,
      code: "SLOT_CLOSED",
    });
    expect(validateBooking({ ...valid, websiteUrl: "https://spam.test" }, morning).ok).toBe(false);
  });
});

describe("WhatsApp links", () => {
  it("addresses the clinic number and keeps the reference in the message", () => {
    const message = bookingMessage({
      reference: "GA-1234",
      patientName: "ليلى",
      phone: "0791111111",
      serviceName: "تنظيف وتلميع الأسنان",
      dateLabel: "الخميس",
      timeLabel: "11:00 ص",
      notes: null,
    });
    const link = whatsAppLink("0791853391", message);
    expect(link.startsWith("https://wa.me/962791853391?text=")).toBe(true);
    expect(decodeURIComponent(link)).toContain("GA-1234");
  });
});
