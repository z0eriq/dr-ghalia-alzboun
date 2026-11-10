import "server-only";

import { randomUUID } from "node:crypto";

import { d1All, d1One } from "@/lib/d1";
import type { AppointmentStatus } from "@/lib/types";

export type AppointmentRow = {
  id: string;
  reference: string;
  patientName: string;
  phone: string;
  serviceSlug: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string | null;
  staffNote: string | null;
  status: AppointmentStatus;
  activeSlot: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactRow = {
  id: string;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export type AdminRow = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
};

export type AppointmentFilter = {
  status?: AppointmentStatus | AppointmentStatus[];
  statusNot?: AppointmentStatus;
  date?: string;
  dateFrom?: string;
  phone?: string;
  createdSince?: Date;
  activeSlot?: string;
  search?: string;
};

type AppointmentOrder = "schedule" | "newest";

const STATUSES = new Set<AppointmentStatus>(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]);

function text(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function nullable(value: unknown): string | null {
  return value == null || value === "" ? null : text(value);
}

function asStatus(value: unknown): AppointmentStatus {
  const status = text(value);
  return STATUSES.has(status as AppointmentStatus) ? (status as AppointmentStatus) : "PENDING";
}

function asDate(value: unknown): Date {
  const parsed = new Date(text(value));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function appointmentFrom(row: Record<string, unknown>): AppointmentRow {
  return {
    id: text(row.id),
    reference: text(row.reference),
    patientName: text(row.patientName),
    phone: text(row.phone),
    serviceSlug: text(row.serviceSlug),
    serviceName: text(row.serviceName),
    date: text(row.date),
    time: text(row.time),
    notes: nullable(row.notes),
    staffNote: nullable(row.staffNote),
    status: asStatus(row.status),
    activeSlot: text(row.activeSlot),
    locale: text(row.locale),
    createdAt: asDate(row.createdAt),
    updatedAt: asDate(row.updatedAt),
  };
}

function messageFrom(row: Record<string, unknown>): ContactRow {
  return {
    id: text(row.id),
    name: text(row.name),
    phone: text(row.phone),
    message: text(row.message),
    isRead: Number(row.isRead) === 1,
    createdAt: asDate(row.createdAt),
  };
}

function whereSql(filter: AppointmentFilter) {
  const clauses: string[] = [];
  const params: Array<string | null> = [];

  if (typeof filter.status === "string") {
    clauses.push("status = ?");
    params.push(filter.status);
  } else if (filter.status && filter.status.length > 0) {
    clauses.push(`status IN (${filter.status.map(() => "?").join(", ")})`);
    params.push(...filter.status);
  }
  if (filter.statusNot) {
    clauses.push("status != ?");
    params.push(filter.statusNot);
  }
  if (filter.date) {
    clauses.push("date = ?");
    params.push(filter.date);
  }
  if (filter.dateFrom) {
    clauses.push("date >= ?");
    params.push(filter.dateFrom);
  }
  if (filter.phone) {
    clauses.push("phone = ?");
    params.push(filter.phone);
  }
  if (filter.createdSince) {
    clauses.push("createdAt >= ?");
    params.push(filter.createdSince.toISOString());
  }
  if (filter.activeSlot) {
    clauses.push("activeSlot = ?");
    params.push(filter.activeSlot);
  }
  if (filter.search) {
    const like = `%${filter.search.replace(/[%_\\]/g, "")}%`;
    clauses.push("(patientName LIKE ? OR phone LIKE ? OR reference LIKE ?)");
    params.push(like, like, like);
  }

  return {
    sql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

export async function countAppointments(filter: AppointmentFilter = {}): Promise<number> {
  const where = whereSql(filter);
  const row = await d1One<{ total: number | string }>(
    `SELECT COUNT(*) AS total FROM Appointment ${where.sql}`,
    where.params,
  );
  return Number(row?.total ?? 0);
}

export async function listAppointments(
  filter: AppointmentFilter,
  order: AppointmentOrder,
  skip: number,
  take: number,
): Promise<AppointmentRow[]> {
  const where = whereSql(filter);
  const sorting = order === "newest" ? "createdAt DESC" : "date ASC, time ASC";
  const rows = await d1All<Record<string, unknown>>(
    `SELECT * FROM Appointment ${where.sql} ORDER BY ${sorting} LIMIT ? OFFSET ?`,
    [...where.params, String(take), String(skip)],
  );
  return rows.map(appointmentFrom);
}

export async function findAppointment(id: string): Promise<AppointmentRow | null> {
  const row = await d1One<Record<string, unknown>>("SELECT * FROM Appointment WHERE id = ? LIMIT 1", [id]);
  return row ? appointmentFrom(row) : null;
}

export async function insertAppointment(input: {
  reference: string;
  patientName: string;
  phone: string;
  serviceSlug: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string | null;
  locale: string;
}): Promise<AppointmentRow> {
  const now = new Date().toISOString();
  const id = randomUUID();
  const row = await d1One<Record<string, unknown>>(
    `INSERT INTO Appointment (
      id, reference, patientName, phone, serviceSlug, serviceName, date, time, notes, staffNote,
      status, activeSlot, locale, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'PENDING', 'active', ?, ?, ?)
    RETURNING *`,
    [
      id,
      input.reference,
      input.patientName,
      input.phone,
      input.serviceSlug,
      input.serviceName,
      input.date,
      input.time,
      input.notes,
      input.locale,
      now,
      now,
    ],
  );
  if (!row) throw new Error("Appointment was not saved.");
  return appointmentFrom(row);
}

export async function saveAppointment(
  id: string,
  changes: { status: AppointmentStatus; activeSlot: string; staffNote?: string | null },
): Promise<AppointmentRow | null> {
  const now = new Date().toISOString();
  const row =
    changes.staffNote === undefined
      ? await d1One<Record<string, unknown>>(
          "UPDATE Appointment SET status = ?, activeSlot = ?, updatedAt = ? WHERE id = ? RETURNING *",
          [changes.status, changes.activeSlot, now, id],
        )
      : await d1One<Record<string, unknown>>(
          "UPDATE Appointment SET status = ?, activeSlot = ?, staffNote = ?, updatedAt = ? WHERE id = ? RETURNING *",
          [changes.status, changes.activeSlot, changes.staffNote, now, id],
        );
  return row ? appointmentFrom(row) : null;
}

export async function createMessage(input: { name: string; phone: string; message: string }): Promise<void> {
  await d1All(
    "INSERT INTO ContactMessage (id, name, phone, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, ?)",
    [randomUUID(), input.name, input.phone, input.message, new Date().toISOString()],
  );
}

export async function listMessages(limit: number): Promise<ContactRow[]> {
  const rows = await d1All<Record<string, unknown>>(
    "SELECT * FROM ContactMessage ORDER BY createdAt DESC LIMIT ?",
    [String(limit)],
  );
  return rows.map(messageFrom);
}

export async function countUnreadMessages(): Promise<number> {
  const row = await d1One<{ total: number | string }>(
    "SELECT COUNT(*) AS total FROM ContactMessage WHERE isRead = 0",
  );
  return Number(row?.total ?? 0);
}

export async function setMessageRead(id: string, isRead: boolean): Promise<boolean | null> {
  const row = await d1One<{ isRead: number | string }>(
    "UPDATE ContactMessage SET isRead = ? WHERE id = ? RETURNING isRead",
    [isRead ? "1" : "0", id],
  );
  return row ? Number(row.isRead) === 1 : null;
}

export async function findAdminByEmail(email: string): Promise<AdminRow | null> {
  const row = await d1One<Record<string, unknown>>(
    "SELECT id, email, passwordHash, name FROM Admin WHERE email = ? LIMIT 1",
    [email],
  );
  if (!row) return null;
  return {
    id: text(row.id),
    email: text(row.email),
    passwordHash: text(row.passwordHash),
    name: text(row.name),
  };
}

export async function upsertAdmin(input: { email: string; passwordHash: string; name: string }): Promise<void> {
  const now = new Date().toISOString();
  await d1All(
    `INSERT INTO Admin (id, email, passwordHash, name, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       passwordHash = excluded.passwordHash,
       name = excluded.name,
       updatedAt = excluded.updatedAt`,
    [randomUUID(), input.email, input.passwordHash, input.name, now, now],
  );
}
