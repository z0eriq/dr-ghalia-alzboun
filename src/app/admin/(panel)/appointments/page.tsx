import Link from "next/link";
import { connection } from "next/server";

import { AppointmentBoard } from "@/components/admin/appointment-board";
import { countAppointments, listAppointments, type AppointmentFilter } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { todayInAmman } from "@/lib/time";
import type { AppointmentDto, AppointmentStatus, Locale } from "@/lib/types";

const views = [
  { id: "upcoming", label: "القادمة" },
  { id: "pending", label: "بانتظار التأكيد" },
  { id: "today", label: "اليوم" },
  { id: "cancelled", label: "الملغاة" },
  { id: "all", label: "الكل" },
] as const;

type ViewId = (typeof views)[number]["id"];

function viewFrom(value: string | undefined): ViewId {
  return views.some((view) => view.id === value) ? (value as ViewId) : "upcoming";
}

function hrefFor(view: ViewId, query: string, page: number) {
  const params = new URLSearchParams();
  if (view !== "upcoming") params.set("view", view);
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/admin/appointments?${search}` : "/admin/appointments";
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; q?: string; page?: string }>;
}) {
  await connection();
  await requireAdmin();
  const params = await searchParams;
  const view = viewFrom(params.view);
  const query = (params.q ?? "").trim().slice(0, 80);
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = 12;
  const today = todayInAmman();

  const where: AppointmentFilter = {};
  if (view === "pending") where.status = "PENDING";
  else if (view === "today") {
    where.date = today;
    where.statusNot = "CANCELLED";
  } else if (view === "cancelled") where.status = "CANCELLED";
  else if (view === "upcoming") {
    where.dateFrom = today;
    where.status = ["PENDING", "CONFIRMED"];
  }

  if (query) where.search = query;

  const [total, rows] = await Promise.all([
    countAppointments(where),
    listAppointments(where, view === "all" || view === "cancelled" ? "newest" : "schedule", (page - 1) * pageSize, pageSize),
  ]);

  const appointments: AppointmentDto[] = rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    patientName: row.patientName,
    phone: row.phone,
    serviceSlug: row.serviceSlug,
    serviceName: row.serviceName,
    date: row.date,
    time: row.time,
    notes: row.notes,
    staffNote: row.staffNote,
    status: row.status as AppointmentStatus,
    locale: (row.locale === "en" ? "en" : "ar") as Locale,
    createdAt: row.createdAt.toISOString(),
  }));

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section>
      <h1 className="text-4xl">المواعيد</h1>
      <p className="mt-2 text-sm text-muted">أكّدوا الموعد من هنا، ثم أرسلوا رسالة واتساب الجاهزة إلى المراجع.</p>
      <div className="mt-5 flex gap-2 overflow-x-auto">
        {views.map((item) => (
          <Link
            key={item.id}
            href={hrefFor(item.id, query, 1)}
            aria-current={item.id === view ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${item.id === view ? "bg-ink text-ivory" : "bg-paper text-ink"}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <form className="mt-4 flex flex-wrap gap-2" action="/admin/appointments">
        <input type="hidden" name="view" value={view} />
        <input className="field max-w-sm" name="q" defaultValue={query} placeholder="اسم، هاتف، أو رقم طلب" aria-label="بحث في المواعيد" />
        <button className="min-h-11 rounded-full bg-gold px-5 text-sm font-bold" type="submit">بحث</button>
      </form>
      <div className="mt-6">
        <AppointmentBoard appointments={appointments} />
      </div>
      {pages > 1 ? (
        <nav className="mt-6 flex items-center gap-3 text-sm font-bold" aria-label="صفحات المواعيد">
          {page > 1 ? <Link href={hrefFor(view, query, page - 1)}>السابق</Link> : <span className="text-muted">السابق</span>}
          <span>
            {page} / {pages}
          </span>
          {page < pages ? <Link href={hrefFor(view, query, page + 1)}>التالي</Link> : <span className="text-muted">التالي</span>}
        </nav>
      ) : null}
    </section>
  );
}
