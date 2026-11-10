import { clinic } from "@/lib/clinic";
import type { Locale } from "@/lib/types";

const OPEN_MINUTES = 10 * 60;
const CLOSE_MINUTES = 20 * 60;

export function minutesToTime(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Thirty-minute visits from 10:00 through 19:30, ending at 20:00. */
export function generateSlots(): string[] {
  const slots: string[] = [];
  for (
    let cursor = OPEN_MINUTES;
    cursor + clinic.slotMinutes <= CLOSE_MINUTES;
    cursor += clinic.slotMinutes
  ) {
    slots.push(minutesToTime(cursor));
  }
  return slots;
}

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function todayInAmman(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: clinic.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function nowMinutesInAmman(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: clinic.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  const nextYear = date.getUTCFullYear();
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getUTCDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function isWithinBookingWindow(date: string, now = new Date()): boolean {
  if (!isValidIsoDate(date)) return false;
  const today = todayInAmman(now);
  const lastDay = addDays(today, clinic.bookingWindowDays);
  return date >= today && date <= lastDay;
}

export function slotStartsInFuture(date: string, time: string, now = new Date()): boolean {
  const today = todayInAmman(now);
  if (date > today) return true;
  if (date < today) return false;
  const minutes = timeToMinutes(time);
  if (minutes === null) return false;
  return minutes > nowMinutesInAmman(now);
}

export function ammanDayStart(now = new Date()): Date {
  return new Date(`${todayInAmman(now)}T00:00:00+03:00`);
}

export function formatDate(isoDate: string, locale: Locale): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatTime(time: string, locale: Locale): string {
  const minutes = timeToMinutes(time);
  if (minutes === null) return time;
  const date = new Date(Date.UTC(2026, 0, 1, Math.floor(minutes / 60), minutes % 60));
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(value: Date, locale: Locale = "ar"): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: clinic.timezone,
  }).format(value);
}
